
function Player(){
	var self = this;
	self.Name;
	self.ID =0;
	self.handCard = new Array();//手牌
	self.handCount=0;//手牌數量
	self.point=0;
	self.x;//手牌所在位置
	self.y;
	
	self.setData = function(Name,ID,x,y){
		self.Name = Name;
		self.ID=ID;
		self.x = x;
		self.y = y;
		}

	
}