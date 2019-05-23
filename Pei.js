

//========================

function Pei(){	
	var self = this;// 讓變數可以帶入function
	self.img;
	self._src;//圖片路徑
	self.x=0;
	self.y-0;
	self.w;
	self.h;
	self.color;
	self.num;
	self.realnum;
	
	self.setData = function(img,w,h,color,num,realnum){
		self.img = img;
		self.w = w;
		self.h = h;
		self.x;
		self.y;
		self.color = color;//花色
		self.num = num;//點數
		self.realnum = realnum;//位於第幾張
	}

}	
