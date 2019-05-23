var peicount =52;//有幾張牌
var peiAry = new Array();//牌盒
var plyerAry = new Array();//存放玩家
var Status = new Boolean(true);//牌是否移動
var fa_Num=51;//發第幾張牌
var fa_Index=0;//發牌的index
var defw =30;//牌寬
var defh =50;//牌高
var p_Locate = 60;//增加y軸
var p_Num = 3;//閒家人數
var delayTime=1500;//延遲時間

function init(){
	
	var canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");
	var chkcount =0;//牌已onload數量
	//載入圖片
	for (var i=0;i<peicount;i++){
		var color = parseInt(i/13);
		var num = (i+1)%13; if(num==0)num=13;
		var Src = getSrc(color,num);			
		var img = new Image(); 
		img.src = "./poker/poker_back_other.png";	//一開始都顯示牌背		
		//檢查每張都有載入
		img.onload=function(){
			chkcount++;
			checkok(chkcount);
			}
		var p = new Pei();
		p.setData(img,defw,defh,color,num,(i+1));
		p._src = Src;//牌正面的路徑
		peiAry[i] = p;
		}
		wishPei(1000);//洗牌
		
		//要牌
		var Deal = document.getElementById("deal");//發牌
		deal.onclick = doDeal;
		//夠了	
		var Enough = document.getElementById("enough");//發牌
		enough.onclick = doEnough;
		//比牌
		var Stop = document.getElementById("stop");//比牌
		Stop.onclick = doStop;		
		//開始	設定人數
		start(p_Num,p_Locate);
		
}
//要牌
function doDeal(){	
	var player = plyerAry[fa_Index];
	var pei = peiAry[fa_Num];
	if(player.point < 0){
		console.log( player.Name + " <<< YOU ARE A LOOSER!!!!");
		fa_Index++;
		} 
	else
		animation(player.ID,pei);//拿牌		
}

//夠了
function doEnough(){
	fa_Index++;
	if(fa_Index >= plyerAry.length) fa_Index=0;
	reDraw();
}	

//比牌
function doStop(){
	var Banker = plyerAry[0];
	var Darkcard = Banker.handCard[0];//莊家第一張
	var pei = peiAry[fa_Num];
	//莊家暗排改成正面
	Darkcard.img.src = Darkcard._src;
	var timer = setInterval(function(){
	//當莊家不足17點
		if(Banker.point < 17 && Banker.point > 0) animation(Banker.ID,pei);
		else{
			clearInterval(timer);
			reDraw();
			Rule();
			}
		},delayTime);
}
//遊戲一開始的動作
function start(p_Num,p_Locate){
	//設定玩家成員
	var Banker = new Player();
	Banker.setData("Banker",plyerAry.length,200,0);
	plyerAry.push(Banker);
	for(var i=1;i <= p_Num;i++){
		var p_Name ="player" + i;
		var p_y =(p_Locate*i);
		var player = new Player();
		player.setData(p_Name,plyerAry.length,200,p_y);
		plyerAry.push(player);
		}
		
	//第一次發牌
	var timer = setInterval(function(){
		var pei = peiAry[fa_Num];//要發出去的牌
		fa_Index++;
		if(fa_Index >= plyerAry.length) fa_Index=0;
		var player = plyerAry[fa_Index];
		if(player.handCount < 2){	//手牌兩張牌
			animation(player.ID,pei);//發牌
			}
		else {
			clearInterval(timer); 
			fa_Index =1;
			reDraw();
			}
		},delayTime);
}

//規則
function Rule(){
	var players  = plyerAry.slice();
	var Banker = players[0];

  if( BJ(Banker) == true)//莊家Black Jack 
		showResult(Banker.Name,"BJ");
	else if( passFive(Banker) == true)//過五關 
		showResult(Banker.Name,"Five");	
			
	else{
		for(i=1;i < players.length;i++){
			if(BJ(players[i]) == true)//Black Jack 
				showResult(players[i].Name,"BJ");
			else if(passFive(players[i]) == true)//過五關
				showResult(players[i].Name,"Five");
			else if(players[i].point > Banker.point)//贏莊家:true
				showResult(players[i].Name,true); 
				
			else
				showResult(players[i].Name,false) //輸莊家:false
			}	
		}
		
	function BJ(who){//丟牌
		if(who.point== 21 && who.handCount== 2) return true;
		}
	function passFive(who){
		if(who.point<= 21 && who.handCount>= 5) return true;
		}	
}

//算手牌點數
function calcuPoint(handCard){
	var maxPoint = 21;
	var Point=0;
	//把手牌點數總和
	for(var i =0;i< handCard.length;i++){
		var tmpPoint = handCard[i].num;
		//處理 J,Q,K
		if(tmpPoint==11 || tmpPoint==12 || tmpPoint==13) tmpPoint=10;
		Point+= tmpPoint;	
		}
	var AceCount=0;
	for(var i=0;i<handCard.length;i++){//手牌是否有Ace
		if(handCard[i].num == 1) AceCount++;			
		}
	//判斷Ace點數	如果+10不會爆就＋10
	while(AceCount > 0 && Point <= 21 && (Point+10) <= 21){
		Point+=10;
		AceCount--;
		}  
	//點數爆了發牌索引指向下一個
	if(Point > 21){
		 Point = -1;
		 if( (fa_Index+1) >= plyerAry.length) fa_Index = 0;
		 else	fa_Index++;
		 reDraw();
		}

	return Point;	
}



//顯示結果
function showResult(who,win){
if(win== true) console.log(who +" is Winner !!!");	
else if(win== false) console.log(who +" is Looser !!!");	
else if(win== "BJ") console.log(who +" is Winner (Black Jack)  !!!");	
else if(win== "Five") console.log(who +" is Winner (Pass Five)  !!!");	
}



//拿牌動畫
function animation(ID,pei){
	//console.log(pei);
	var timer = setInterval(function(){
		var O_pei = pei;//要被發出來的牌	
		if(Status == true){
			nextPosition(O_pei,ID);
			reDraw();//更新畫面	
			}		
		//動畫跑完才開始處理手牌資訊
		else if(Status == false){	
			clearInterval(timer);
			fa_Num--;
			reDraw();
			var player = plyerAry[ID];//拿牌者
			//將抽出的牌放進自己的手牌
			player.handCard.push(O_pei);
			//算手牌點數
			player.point = calcuPoint(player.handCard);
			player.handCount++;

			console.log(player.Name+"_point :"+player.point);
			//setTimeout(function(){reDraw();},1);	 
			}
		},1)
	Status = true;
}
//計算下個座標
function nextPosition(pei,ID){	
	var player = plyerAry[ID];
	var speed = 2;
	var t_x = player.x - (player.handCount*30);//計算手牌位置
	var t_y = player.y;
	
	//當牌到達定位後,src改成正確的路徑	 
	if(speed >= Math.abs(t_x - pei.x) && speed >= Math.abs(t_y - pei.y) ){
		if(ID == 0 && plyerAry[0].handCount == 0) ; //莊家的第一張暗牌,src不變
		else pei.img.src = pei._src;//src改成正確的路徑	
		pei.x = t_x;
		pei.y = t_y;
		Status = false;
		}
	else if(Math.abs(t_y - pei.y) > speed)
		 pei.y += speed;
	else if(Math.abs(t_x - pei.x) > speed)
		 pei.x += speed;
	
}

function drawPei(pei){
	ctx.drawImage(pei.img,pei.x,pei.y,pei.w,pei.h);
}
//記號
function drawMark(){
	var player = plyerAry[fa_Index];
	x = player.x + defw+5;
	y = player.y + defh/2;
	ctx.beginPath();
	ctx.arc(x, y, 3, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.fill();
}

//更新畫面 
function reDraw(){
	ctx.clearRect(0,0,500,300);
	for(var i=0;i < peicount;i++){		
		var pei = peiAry[i];
		drawPei(pei);													
		}	
	drawMark();
}

//洗牌 交換位置
function wishPei(count){
	for(var i=0;i<count;i++){		
		var r1 = Math.floor((Math.random() * (peicount-0)+0));
		var r2 = Math.floor((Math.random() * (peicount-0)+0));
		if(r1!=r2){
			//console.log(r1+" "+r2);
			var tmpAry = peiAry[r1];
			peiAry[r1] = peiAry[r2];
			peiAry[r2] = tmpAry;
			}
		tmpAry = null;
	}

}
//檢查圖片是否載完
function checkok(chkcount){
	//console.log(chkcount);
	if(chkcount==peicount){
		console.log("img load ok");
		//牌堆初始位置
		for (var i=0;i < peiAry.length;i++){
		var pei = peiAry[i];
				pei.x =1+i/2;
				pei.y =0;
				drawPei(pei);
				}
		}
}

function getSrc(color,num){
	var s1 = "./poker/poker_";
	var s2 = "_l.png"; 
	var s = "";
	switch (color){
			case 0: 
				var s = "p_" ;
				break;
			case 1:
				var s = "b_" ;
				break;
			case 2:
				var s = "r_" ;
				break;
			case 3:
				var s = "s_" ;
				break;
			}
		
	Src= s1 + s + num + s2;
	return Src ;
}