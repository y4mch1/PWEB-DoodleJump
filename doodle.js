window.addEventListener('load', main, false);

var background = new Image;
background.onload = function() {
    console.log('Loaded')
}
background.src = 'back.png';

var menu = new Image;
menu.onload = function() {
    console.log('Loaded')
}
menu.src = 'menu2.png';

var head = new Image;
head.onload = function() {
    console.log('Loaded')
}
head.src = 'head.png';

var doodlerImage = new Image;
doodlerImage.onload = function() {
    console.log('Loaded')
}
doodlerImage.src = 'doodler.png';

var platImage = new Image;
platImage.onload = function() {
    console.log('Loaded')
}
platImage.src = 'plat.png';

var PlatMonsterImage = new Image;
PlatMonsterImage.onload = function() {
    console.log('Loaded')
}
PlatMonsterImage.src = 'monsterA.png';

var FlyMonsterImage = new Image;
FlyMonsterImage.onload = function() {
    console.log('Loaded')
}
FlyMonsterImage.src = 'monsterB.png';

var FlyMonsterMirrorImage = new Image;
FlyMonsterMirrorImage.onload = function() {
    console.log('Loaded')
}
FlyMonsterMirrorImage.src = 'monsterBm.png';

var LeviMonsterImage = new Image;
LeviMonsterImage.onload = function() {
    console.log('Loaded')
}
LeviMonsterImage.src = 'monsterC.png';

var HoleImage = new Image;
HoleImage.onload = function() {
    console.log('Loaded')
}
HoleImage.src = 'hole.png';

var SpringImage = new Image;
SpringImage.onload = function() {
    console.log('Loaded')
}
SpringImage.src = 'spring.png';

var PewImage = new Image;
PewImage.onload = function() {
    console.log('Loaded')
}
PewImage.src = 'pew.png';


function main() {
	
	console.log('connected');
	
	var ctxh = ccanvas.getContext('2d');
	var hh = ccanvas.height;
	var wh = ccanvas.width;
	
	ctxh.drawImage(head, 0, 0, wh, hh);

	var ctx = canvas.getContext('2d');
	var h = canvas.height;
	var w = canvas.width;
	
	var gameStarted = true;
	var platList = [];
	var bullets=[];
	var dt = 0.25;
	var t = 0;
	var g = 20;	
	var gap = h/5;
	var pause = true;
	var score = 0;
	var highscore = 0;
	var isLose = false;

	const doodler = {
		x: 0,
		y: 450,
		vy: -80,
		vx: 50,
		w: 40,
		h: 40,
		move: 'none',
		draw: ()=>{
			ctx.drawImage(doodlerImage, doodler.x, doodler.y, doodler.w, doodler.h);
		},	
		isHit: false,
	}
	

	function b(){
		this.x;
		this.y;
		this.r = 7;
		this.vx = 10;
		this.vy = 10;
		this.dx;
		this.dy;
		this.angle;
		this.arg;
		this.draw = ()=>{
			ctx.drawImage(PewImage, this.x-7, this.y-7, 2*this.r, 2*this.r);
		};
		this.m = {};
		this.target = (e)=>{
			this.m.x = e.offsetX;
			this.m.y = e.offsetY;
			return this.m;
		}			
	}
	
	
	function setupPlat(){
		for (var i=0; i<5; i++){
			var PlatY = i*gap;
			var plat = new Platform(PlatY);
			platList.push(plat);
		}
		doodler.x = plat.x + 24;
	}

	function PlatformMonster(x, y) {
		this.x = x;
		this.y = y;
		this.w = 75; 
		this.h = 50; 
		this.vx = 30;
		this.draw = () => {
			ctx.drawImage(PlatMonsterImage, this.x, this.y, this.w, this.h);
		}
		this.moveY = (dy) => {
			this.y -= dy;
		}
	}
	
	function LevitatingMonster(x, y){
		this.x = x;
		this.y = y;
		this.w = 50;
		this.h = 50;
		this.vx;
		this.vy;
		this.currentAngle = 0;
		this.draw = () => {
			ctx.drawImage(LeviMonsterImage, this.x, this.y, this.w, this.h);
		}
		this.moveY = (dy) => {
			this.y -= dy;
		}
	}
	
	function FlyingMonster(x, y) {
		this.x = x;
		this.y = y;
		this.w = 45;
		this.h = 45;
		this.vx = 30;
		this.draw = () => {
			if( this.vx<0){
				ctx.drawImage(FlyMonsterImage, this.x, this.y, this.w, this.h);
			} else {
				ctx.drawImage(FlyMonsterMirrorImage, this.x, this.y, this.w, this.h);
			}
		}
		this.moveY = (dy) => {
			this.y -= dy;
		}
	}
	
	function BlackHole(x, y){
		this.x = x;
		this.y = y;
		this.r = 37;
		this.draw = () => {
			ctx.drawImage(HoleImage, this.x-37, this.y-37, 2*this.r, 2*this.r);
		}
		this.moveY = (dy) => {
			this.y -= dy;
		}
	}
	
	function Platform(PlatY){
		this.x = Math.floor(((Math.random()*286) + 15))
		this.y = PlatY;
		this.w = 85;
		this.h = 17;
		this.firstHit = 0; 
		this.firstSpring = 0;
	
		this.sprX = this.x+Math.floor(Math.random() * 55);
		this.isSpring = Math.random() < 0.2;
		
		if (!this.isSpring && score > 1500){
			this.isMonster = Math.random() < 0.3;
		}
		if (!this.isSpring && score > 3000){
			this.isMonster = Math.random() < 0.5;
		}
		if (!this.isSpring && score > 5000){
			this.isMonster = Math.random() < 0.7;
		}
		if (this.isMonster) {
			this.kind = Math.floor((Math.random()*3)+1);
			if (this.kind == 1){
				this.pmonster = new PlatformMonster(this.x+5, this.y-70);
			} else if (this.kind == 2){
				this.fmonster = new FlyingMonster(this.x, this.y-80);
			} else if(score > 2700 && this.kind == 3 && this.x > 50 && this.x+this.w<250){
				this.lmonster = new LevitatingMonster (this.x+15, this.y-90);
			}
		}
		this.move = (dy) => {
			this.y -= dy;
			if (this.isMonster) {
				if (this.pmonster){
					this.pmonster.moveY(dy);
				}
				if (this.lmonster){
					this.lmonster.moveY(dy);
				}
				if(this.fmonster){
					this.fmonster.moveY(dy);
				}
			}
			if(this.hole){
				this.hole.moveY(dy);
			}
		}
		
		if (!this.isMonster && !this.isSpring && score>3000){
			this.isHole = Math.random()<0.1;
		}
		if (!this.isMonster && !this.isSpring && score>5000){
			this.isHole = Math.random()<0.3;
		}
		if (!this.isMonster && !this.isSpring && score>8000){
			this.isHole = Math.random()<0.5;
		}
		if(this.isHole){
			if (this.x > 70 && this.x < 260){
				this.bla = Math.random();
				if(this.bla <=0.5){
					this.hole = new BlackHole((this.x-(Math.random()*15+1)), (this.y-(Math.random()*11+50)))
				} else {
					this.hole = new BlackHole((this.x+this.w+(Math.random()*15+1)),(this.y-(Math.random()*11+50)))
				}
			}
		}
		
		this.draw = () => {
			if (this.isSpring){
				ctx.drawImage(SpringImage, this.sprX, this.y-17, 17, 17);
			}
			ctx.drawImage(platImage, this.x, this.y, this.w, this.h);
			if (this.pmonster) {
				this.pmonster.draw();
			}
			if (this.lmonster){
				this.lmonster.draw();
			}
			if (this.fmonster){
				this.fmonster.draw();
			}
			if(this.hole){
				this.hole.draw();
			}
		}
	}
	
	function draw(){
		scoretext.innerHTML = score;
		highscoretext.innerHTML = highscore;
		if (pause) {
			ctx.drawImage(menu, 0, 0, w, h);
		} else {
			ctx.clearRect(0, 0, w, h);
			ctx.drawImage(background, 0, 0, w, h);
			for (const plat of platList) {
				plat.draw();
			}
			doodler.draw();	
			for (const pew of bullets){
				pew.draw();
			}
		}
	}
	
	function loosing(){
		if(highscore<score){
			highscore = score;
		}
		ctx.clearRect(0, 0, w, h);
		pause = true;
		doodler.x = 0;
		doodler.y = 450;
		doodler.w = 40;
		doodler.h = 40;
		doodler.vy = -80;
		doodler.vx = 50;
		doodler.isHit = false;
		score = 0;
		bullets = [];
		platList = [];
		isLose = false;
		
	}
	
	function collision(monster){
		if 
		(((monster.y+monster.h>doodler.y && monster.y+monster.h<doodler.y+doodler.h) &&
		(monster.x<doodler.x+doodler.w && monster.x+monster.w>doodler.x))
		||
		((monster.x+monster.w>doodler.x && monster.x+monster.w<doodler.x+doodler.w) &&
		(monster.y+monster.h>doodler.y && monster.y<doodler.y+doodler.h))
		||
		((monster.x<doodler.x+doodler.w && monster.x>doodler.x) &&
		(monster.y+monster.h> doodler.y && monster.y<doodler.y+doodler.h)))
		{
			doodler.isHit = true;
			doodler.vy = 60;
		}
	}
	
	function upcollision(monster){
		if(doodler.isHit == false){
			if (doodler.y+doodler.h>monster.y && doodler.y+doodler.h < monster.y+monster.h) {
				if ((doodler.x+doodler.w-monster.x<monster.w && doodler.x+doodler.w-monster.x>0) ||
				(monster.x+monster.w-doodler.x>0 && monster.x+monster.w-doodler.x<monster.w)) {
					doodler.isHit = true;
					doodler.vy = -60;
				}
			}
		}
	}
	
	function shooting(plat, bullet, points){
		var monster = plat.pmonster || plat.fmonster || plat.lmonster
		if 
		
		(((monster.y + monster.h>bullet.y-bullet.r && monster.y+monster.h<bullet.y+bullet.r) &&
		(monster.x<bullet.x+bullet.r && monster.x+monster.w>bullet.x-bullet.r))
		||
		
		((monster.x+monster.w>bullet.x-bullet.r && monster.x+monster.w<bullet.x+bullet.r) &&
		(monster.y+monster.h>bullet.y-bullet.r && monster.y<bullet.y+bullet.r))
		||
		
		((monster.x<bullet.x+bullet.r && monster.x>bullet.x-bullet.r) &&
		(monster.y+monster.h>bullet.y-bullet.r && monster.y<bullet.y+bullet.r))) 
		{
			plat.pmonster = 0; 
			plat.fmonster = 0;
			plat.lmonster = 0;
			score+=points;
		}
	}
	
	function physics(){
		if (!pause) {
			doodler.vy += g*dt;
			
			if (doodler.move=='left') {
				doodler.x -= doodler.vx*dt;
			} else if (doodler.move=='right') {
				doodler.x += doodler.vx*dt;
			}
			
			if (!doodler.isHit){
				if (doodler.vy>0) {
					for (const plat of platList) {
						if (doodler.y+doodler.h>plat.y && doodler.y+doodler.h < plat.y+plat.h) {
							if ((doodler.x+doodler.w-plat.x<plat.w && doodler.x+doodler.w-plat.x>0) ||
							(plat.x+plat.w-doodler.x>0 && plat.x+plat.w-doodler.x<plat.w)) {
								doodler.vy = -80;
								plat.firstHit +=1;
								if(plat.firstHit == 1){
									plat.firstHit = -100000000;
									score += 80;
								}
							}
						}
						if (plat.isSpring){
							if (doodler.y+doodler.h>plat.y-17 && doodler.y+doodler.h < plat.y-17+17) {
								if (doodler.x<plat.sprX+17 && doodler.x + doodler.w > plat.sprX) {
									doodler.vy = -120;
									plat.firstSpring +=1;
									if(plat.firstSpring == 1){
										plat.firstSpring = -100000000;
										score += 120;
									}
								}
							}
						}
					}
				}
			}
			
			if (doodler.y<350 && doodler.vy<0) {
				for (const plat of platList) {
					plat.move(doodler.vy*dt);
				}
			} else {
				doodler.y += doodler.vy*dt;
			}
			
			if (platList[0].y>gap) {
				platList.unshift(new Platform(-17));
			}
			
			for (const plat of platList){
				if (plat.y-100 > h){
					platList.pop();
				}
			}
			
			if (doodler.x < -doodler.w) {
				doodler.x = w;
			} else if (doodler.x > w){
				doodler.x = -doodler.w
			}
			
			if (doodler.y > h){
				isLose = true;
				loosing();			
			}
			
			for (const plat of platList){
				if(plat.isMonster){
					
					if(plat.pmonster){
						plat.pmonster.x += plat.pmonster.vx*dt/10;
						if( plat.pmonster.x < plat.x+3 || plat.pmonster.x+75 > plat.x+82){
							plat.pmonster.vx *= -1;
						}
						for(const pew of bullets){
							shooting(plat, pew, 250)
						}
						collision(plat.pmonster);
						if (doodler.isHit == false){
							if (doodler.y+doodler.h>plat.pmonster.y && doodler.y+doodler.h < plat.pmonster.y+plat.pmonster.h) {
								if ((doodler.x+doodler.w-plat.pmonster.x<plat.pmonster.w && doodler.x+doodler.w-plat.pmonster.x>0) ||
								(plat.pmonster.x+plat.pmonster.w-doodler.x>0 && plat.pmonster.x+plat.w-doodler.x<plat.pmonster.w)) {
									doodler.isHit = false;
									doodler.vy = -120;
									plat.pmonster = 0; 
									score += 250;
								}
							}
						}
					}
					
					
					if(plat.fmonster){
						plat.fmonster.x += plat.fmonster.vx*0.15;
						if( plat.fmonster.x < 3 || plat.fmonster.x+50 > w-3){
							plat.fmonster.vx *= -1;
						}
						for(const pew of bullets){
							shooting(plat, pew, 400)
						}
						collision(plat.fmonster);
						upcollision(plat.fmonster);
					}
					
					
					if(plat.lmonster){
						plat.lmonster.vx = Math.cos(plat.lmonster.currentAngle)*30;
						plat.lmonster.vy = Math.sin(plat.lmonster.currentAngle)*30;
						plat.lmonster.currentAngle += 0.1;
						plat.lmonster.x += plat.lmonster.vx*dt;
						plat.lmonster.y += plat.lmonster.vy*dt;
						for(const pew of bullets){
							shooting(plat, pew, 650)
						}
						collision(plat.lmonster);
						upcollision(plat.lmonster);
					}
				}
				if (plat.hole){
					if
					(((doodler.x>plat.hole.x-plat.hole.r && doodler.x< plat.hole.x+plat.hole.r) &&
					(doodler.y>plat.hole.y-plat.hole.r && doodler.y<plat.hole.y+plat.hole.r)) 
					||
					((doodler.x+doodler.w>plat.hole.x-plat.hole.r && doodler.x+doodler.w< plat.hole.x+plat.hole.r) &&
					(doodler.y>plat.hole.y-plat.hole.r && doodler.y<plat.hole.y+plat.hole.r))
					||
					((doodler.x>plat.hole.x-plat.hole.r && doodler.x< plat.hole.x+plat.hole.r) &&
					(doodler.y+doodler.h>plat.hole.y-plat.hole.r && doodler.y+doodler.h<plat.hole.y+plat.hole.r))
					||
					((doodler.x+doodler.w>plat.hole.x-plat.hole.r && doodler.x+doodler.w< plat.hole.x+plat.hole.r) &&
					(doodler.y+doodler.h>plat.hole.y-plat.hole.r && doodler.y+doodler.h<plat.hole.y+plat.hole.r)))
					{
						isLose = true;
						for (var i=0; i<doodler.w; i++){
							doodler.vy = 0;
							doodler.y = plat.hole.y-doodler.h/2;
							doodler.x = plat.hole.x-doodler.w/2;
							doodler.w -= 0.08;
							doodler.h -= 0.08;
							if(doodler.w <=0){
								loosing();
							}									
						}
					}
				}
			}
			
			
			for (const pew of bullets){
				if(pew.dx>0){
					pew.x += 10*dt*pew.vx*(Math.cos(pew.angle));
					pew.y += 10*dt*pew.vy*-1*Math.sin(pew.angle);
				}
				if(pew.dx<0){
					pew.x -= 10*dt*pew.vx*(Math.cos(pew.angle));
					pew.y -= 10*dt*pew.vy*-1*Math.sin(pew.angle);
				}
				if(pew.x == 0){
					pew.y -= 4*dt*pew.vy*-1
				}
				if(pew.x> w+5 || pew.x < -5 || pew.y < -5){
					bullets.shift();
				}
			}
		}
	}
	
	document.onkeydown = function (e) {
		if (e.keyCode==65 || e.keyCode==37) {
			
			doodler.move = 'left';
		} else 
		if (e.keyCode==68 || e.keyCode==39) {
			
			doodler.move = 'right';
		}
	}
	
	document.onkeyup = function (e) {
		if ((e.keyCode==65 || e.keyCode==37)&&doodler.move=='left') {
			
			doodler.move = 'none';
		} else 
		if ((e.keyCode==68 || e.keyCode==39)&&doodler.move=='right') {
			
			doodler.move = 'none';
		}
		if (e.keyCode == 87 || e.keyCode == 38 ){
			const p = {
				offsetX: doodler.x+18,
				offsetY: 20,
			}
			shoot(p);
		}
	}
	
	function shoot(e){
		if(isLose==false){
			var pew = new b();
			pew.target(e);
			if (pew.m.x == doodler.x){
				pew.m.x = doodler.x-1;
			}
			pew.y = doodler.y -10;
			pew.dy = doodler.y - pew.m.y;
			pew.dx = pew.m.x - doodler.x;
			if(pew.dx<0){
				pew.x = doodler.x;
			} else { 
				pew.x = doodler.x + 40;
			}
			pew.arg =  pew.dy/pew.dx;
			if(pew.dy == 0){
				pew.dy = Math.abs(pew.dx)*1.5;
			}
			
			if(pew.dx<0 && pew.dy<0){
				pew.dy = Math.abs(pew.dy);
				if(pew.arg>-0.5){
					pew.arg = -0.5;
				}
				if(pew.arg<-10){
					pew.x = doodler.x+20;
				}
			}
			if(pew.dx<0 && pew.dy>0){
				if(pew.arg>-0.5){
					pew.arg = -0.5;
				}
				if(pew.arg<-10){
					pew.x = doodler.x+20;
				}
			}
			
			if(pew.dx>0 && pew.dy<0){
				pew.dy = Math.abs(pew.dy);
				if(pew.arg<0.5){
					pew.arg = 0.5;
				}
				if(pew.arg>10){
					pew.x = doodler.x+20;
				}
			}
			if(pew.dx>0 && pew.dy>0){
				if(pew.arg<0.5){
					pew.arg = 0.5;
				}
				if(pew.arg>10){
					pew.x = doodler.x+20;
				}
			}
			pew.angle = Math.atan(pew.arg);	
			bullets.push(pew);
		}
	}
	
	canvas.onmouseup = function(e) {
		if (pause) {
			pause = false;
			setupPlat();
			for (const plat of platList) {
				plat.draw();
			}
			doodler.draw();
		} else {
			shoot(e);
		}
	}
	
	function control(){
		physics();
		draw();
	}
	
	setInterval(control, 1000/30);	
	
}

