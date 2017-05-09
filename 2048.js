var game={
	data:[],
	RN:4,
	CN:4,
	score:0,
	state:0,//保存游戏的状态
	RUNNING:1,
	GAMEOVER:0,
	getGridsHtml:function(){//生成所有背景格的html代码
		for(var r=0,arr=[];r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				arr.push(""+r+c);
			}
		}
		return ('<div id="g'+arr.join('" class="grid"></div><div id="g')+'" class="grid"></div>');
	},
	getCellsHtml:function(){//生成所有前景格的html代码
		for(var r=0,arr=[];r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				arr.push(""+r+c);
			}
		}
		return ('<div id="c'+arr.join('" class="cell"></div><div id="c')+'" class="cell"></div>');
	},
	init:function(){
		var gp=document.getElementById("gridPanel");
		gp.style.width=116*this.CN+16+"px";
		gp.style.height=116*this.RN+16+"px";
		gp.innerHTML=this.getGridsHtml()+this.getCellsHtml();
	},
	start:function(){  //游戏启动时调用方法
		this.init();
		this.state=this.RUNNING;
		for(var r=0;r<this.RN;r++){
			this.data[r]=[];//初始化每一行为空数组
			for(var c=0;c<this.CN;c++){
				this.data[r][c]=0;
			}
		}
		this.score=0;//初始化游戏分数为0
		this.randomNum();
		this.randomNum();
		this.updateView();
	},
	isGameOver:function(){
		for(var r=0;r<this.data.length;r++){
			for(var c=0;c<this.data[r].length;c++){
				if(this.data[r][c]==0){
					return false;
				}else if((this.data[r][c]!=this.data[r][this.CN-1])&&(this.data[r][c]==this.data[r][c+1])){
					return false;
				}else if((this.data[r][c]!=this.data[this.RN-1][c])&&(this.data[r][c]==this.data[r+1][c])){
					return false;
				}
			}
		}
		this.state=this.GAMEOVER;
		return true;
	},
	randomNum:function(){//随机挑选一个位置，生成2或4
		if(!this.isFull()){
		while(true){
			var row=parseInt(Math.random()*this.RN);
			var col=parseInt(Math.random()*this.CN);
			if(this.data[row][col]==0){
				this.data[row][col]=Math.random()<0.5 ? 2 : 4;
				break;
			}
		}
		}
	},
	isFull:function(){//专门用来判断数组是否已满
		for(var r=0;r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				if(this.data[r][c]==0){
					return false;
				}
			}
		}
		return true;
	},
	updateView:function(){
		for(var r=0;r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				var div=document.getElementById("c"+r+c);
				if(this.data[r][c]!=0){
					div.innerHTML=this.data[r][c];
					div.className="cell n"+this.data[r][c];
				}else {
					div.innerHTML="";
					div.className="cell";
				}
			}
		}
		var span=document.getElementById("score");
		span.innerHTML=this.score;
		var div=document.getElementById("gameOver");
		if(this.state==this.GAMEOVER){
			var span=document.getElementById("finalScore");
			span.innerHTML=this.score;
			div.style.display="block";
		}else{div.style.display="none";}
	},
	moveLeft:function(){//左移所有行
		var before=this.data.toString();
		for(var r=0;r<this.data.length;r++){
			this.moveLeftInRow(r);
		}
		var after=this.data.toString();
		if(before!=after){
			this.randomNum();
			this.isGameOver();
			this.updateView();
		}
	},
	moveLeftInRow:function(r){//左移第r行
		for(var c=0;c<this.data[r].length-1;c++){
			var next=this.getRightNext(r,c);
			if(next==-1){break;}
			else{
				if(this.data[r][c]==0){
					this.data[r][c]=this.data[r][next];
					this.data[r][next]=0;
					c--;
				}else if(this.data[r][c]==this.data[r][next]){
					this.data[r][c]*=2;
					this.data[r][next]=0;
					this.score+=this.data[r][c];
				}
			}
		}
	},
	getRightNext:function(r,c){
		for(var next=c+1;next<this.data[r].length;next++){
			if(this.data[r][next]!=0){
				return next;
			} 
		}
		return -1;
	},
	moveRight:function(){
		var before=this.data.toString();
		for(var r=0;r<this.data.length;r++){
			this.moveRightInRow(r);
		}
		var after=this.data.toString();
		if(before!=after){
			this.randomNum();
			this.isGameOver();
			this.updateView();
		}
	},
	moveRightInRow:function(r){
		for(var c=this.data[r].length-1;c>0;c--){
			var last=this.getLeftLast(r,c);
			if(last==-1){break;}
			else {
				if(this.data[r][c]==0){
					this.data[r][c]=this.data[r][last];
					this.data[r][last]=0;
					c++;
				}else if(this.data[r][c]==this.data[r][last]){
					this.data[r][c]*=2;
					this.data[r][last]=0;
					this.score+=this.data[r][c];
				}
			}
		}
	},
	getLeftLast:function(r,c){
		for(var last=c-1;last>=0;last--){
			if(this.data[r][last]!=0){
				return last;
			}
		}
		return -1;
	},
	moveUp:function(){
		var before=this.data.toString();
		for(var c=0;c<this.CN;c++){
			this.moveUpInCol(c);
		}
		var after=this.data.toString();
		if(before!=after){
			this.randomNum();
			this.isGameOver();
			this.updateView();
		}
	},
	moveUpInCol:function(c){
		for(var r=0;r<this.data.length-1;r++){
			var next=this.getDownNext(r,c);
			if(next==-1){break;}
			else{
				if(this.data[r][c]==0){
					this.data[r][c]=this.data[next][c];
					this.data[next][c]=0;
					r--;
				}else if(this.data[r][c]==this.data[next][c]){
					this.data[r][c]*=2;
					this.data[next][c]=0;
					this.score+=this.data[r][c];
				}
			}
		}
	},
	getDownNext:function(r,c){
		for(var next=r+1;next<this.data.length;next++){
			if(this.data[next][c]!=0){
				return next;
			} 
		}
		return -1;
	},
	moveDown:function(){
		var before=this.data.toString();
		for(var c=0;c<this.CN;c++){
			this.moveDownInCol(c);
		}
		var after=this.data.toString();
		if(before!=after){
			this.randomNum();
			this.isGameOver();
			this.updateView();
		}
	},
	moveDownInCol:function(c){
		for(var r=this.data.length-1;r>0;r--){
			var last=this.getUpLast(r,c);
			if(last==-1){break;}
			else {
				if(this.data[r][c]==0){
					this.data[r][c]=this.data[last][c];
					this.data[last][c]=0;
					r++;
				}else if(this.data[r][c]==this.data[last][c]){
					this.data[r][c]*=2;
					this.data[last][c]=0;
					this.score+=this.data[r][c];
				}
			}
		}
	},
	getUpLast:function(r,c){
		for(var last=r-1;last>=0;last--){
			if(this.data[last][c]!=0){
				return last;
			}
		}
		return -1;
	}
	
}
//当页面加载后启动游戏
window.onload=function(){
	game.start();
	document.onkeydown=function(){//当按键按下时
		if(game.state=game.RUNNING){//只有游戏运行时才响应按键操作
				var e=window.event||arguments[0];
			if(e.keyCode==37){
				game.moveLeft();
			}else if(e.keyCode==39){
				game.moveRight();
			}else if(e.keyCode==38){
				game.moveUp();
			}else if(e.keyCode==40){
				game.moveDown();
			}
		}	
	}
}