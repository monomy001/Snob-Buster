(function(window){
	
	//public variables (accessible from outside)
	Game.prototype.type="single"; //single | multi player (not yet implemented)
	Game.prototype.anim=0; //enable animation
	Game.prototype.kind=""; //kind of game
	
	function Game(){
		this.score = 0;
		this.questions = 10; //total questions
		this.choices = 4; //how many choices
		this.complexity = 1000; //how many different city names
		this.timeout = 10; //how long in second to answer
		this.timer = {};
		
		this.db = {};
		this.db.city=[];
		this.db.state=[];
		this.db.country=[];
		this.db.flag=[];
		
		//private (only used internally)
		var _idxq = 0; //idx counter of current question
		this.nxt_q = function(){ _idxq++; return _idxq;	}
		this.reset_q = function(){ _idxq=0;}
		//animation
		var _animIn = "bounceIn,bounceInDown,bounceInLeft,bounceInRight,bounceInUp,fadeIn,fadeInDown,fadeInDownBig,fadeInLeft,fadeInLeftBig,fadeInRight,fadeInRightBig,fadeInUp,fadeInUpBig,flipInX,flipInY,lightSpeedIn,rotateIn,rotateInDownLeft,rotateInDownRight,rotateInUpLeft,rotateInUpRight,rollIn,zoomIn,zoomInDown,zoomInLeft,zoomInRight,zoomInUp,slideInDown,slideInLeft,slideInRight,slideInUp".split(",");
		var _animOut = "bounceOut,bounceOutDown,bounceOutLeft,bounceOutRight,bounceOutUp,fadeOut,fadeOutDown,fadeOutDownBig,fadeOutLeft,fadeOutLeftBig,fadeOutRight,fadeOutRightBig,fadeOutUp,fadeOutUpBig,flipOutX,flipOutY,lightSpeedOut,rotateOut,rotateOutDownLeft,rotateOutDownRight,rotateOutUpLeft,rotateOutUpRight,rollOut,zoomOut,zoomOutDown,zoomOutLeft,zoomOutRight,zoomOutUp,slideOutDown,slideOutLeft,slideOutRight,slideOutUp".split(",");
		this.animIn=function(){ return _animIn[Math.floor((Math.random() * _animIn.length))]}
		this.animOut=function(){ return _animOut[Math.floor((Math.random() * _animIn.length))]}
	}
	
	Game.prototype.start = function(kind){
		this.kind = kind;
		this.reset_q();
		this.score=0;
		$("#tot_q").html(this.questions);
		$(".progress").asPieProgress({
			namespace: 'pieProgress', size:100, speed: this.timeout * 10, easing:'linear'
		});
		this.next();
	}
	
	Game.prototype.update = function(act){
		var form=$("form#settings");
		var setin=["questions","choices","complexity","timeout","anim"];
		if (act=="save"){ //save settings
			for (i in this){
				if (setin.indexOf(i) > -1){
					this[i]=parseInt(form.find("[name="+i+"]").val());
				}
			}
			alert("Settings saved")
		} else { //load settings
			for (i in this){
				if (setin.indexOf(i) > -1){
					form.find("[name="+i+"]").val(this[i]);
				}
			}
		}
	}
	
	Game.prototype.next_city = function(){
		var used=[-1,undefined,""];
		var tmp=-1; var idx=-1;
		
		while(used.indexOf(this.db.state[idx])>-1 || idx==-1)
			var idx=Math.floor((Math.random() * this.db.state.length)); //set question & correct answer
		used.push(this.db.state[idx]);
		
		$("#question").html(this.db.city[idx]);		
		var anspos = Math.floor((Math.random() * this.choices) + 1); //set correct answer idx
		
		for (ctr=1;ctr<=this.choices;ctr++){
			if (ctr==anspos) tmp=idx;
			else {
				while(used.indexOf(this.db.state[tmp])>-1 || tmp==-1){
					tmp=Math.floor((Math.random() * this.db.state.length)); //choose wrong answers
				} 
				used.push(this.db.state[tmp]); //answer must not be repeated
			}
			$('<a class="pure-button answer" href="#" tmp="'+tmp+'" value="'+((ctr==anspos)?1:0)+'">'+this.db.state[tmp]+'</a>').appendTo("#city-ans-container");
		}
	}
	
	Game.prototype.next_flag = function(){
		var used=[-1,undefined,""];
		var usedcountry=[-1,undefined,""];
		var tmp=-1; var idx=-1;
		
		while(used.indexOf(this.db.country[idx])>-1 || idx==-1)
			var idx=Math.floor((Math.random() * this.db.country.length)); //set question & correct answer
		used.push(this.db.city[idx]);
		usedcountry.push(this.db.country[idx]);
		
		$("#question").attr("src","./img/flag/"+this.db.country[idx]+".png");		
		var anspos = Math.floor((Math.random() * this.choices) + 1); //set correct answer idx
		
		for (ctr=1;ctr<=this.choices;ctr++){
			if (ctr==anspos) tmp=idx;
			else {
				while(used.indexOf(this.db.city[tmp])>-1 || tmp==-1 || usedcountry.indexOf(this.db.country[tmp])>-1){
					tmp=Math.floor((Math.random() * this.db.city.length)); //choose wrong answers
				} 
				used.push(this.db.city[tmp]);usedcountry.push(this.db.country[tmp]); //answer must not be repeated
			}
			$('<a class="pure-button answer" href="#" tmp="'+tmp+'" value="'+((ctr==anspos)?1:0)+'">'+this.db.city[tmp]+'</a>').appendTo("#city-ans-container");
		}
	}
	
	Game.prototype.next_state = function(){
		var selected="", cities=[];
		
		var idx=Math.floor((Math.random() * this.db.country.length)); //set question & correct answer
		selected=this.db.country[idx];
		$("#question").html(selected);		
		
		var anspos = Math.floor((Math.random() * this.choices) + 1); //set correct answer idx
		
		for (ctr=0;ctr<this.db.city.length;ctr++){
			if (this.db.country[ctr]==selected) cities.push(this.db.city[ctr]);
		}
		
		var used=[-1,undefined,""];
		for (ctr=1;ctr<=this.choices;ctr++){
			var tmp=-1; var loopctr=0;
			if (ctr==anspos) {
				while( (tmp==-1 || this.db.country[tmp]==selected ) && loopctr<99){
					loopctr++;
					tmp=Math.floor((Math.random() * this.db.country.length)); //choose right answers (which is different)
				}
				$('<a class="pure-button answer" href="#" value="'+((ctr==anspos)?1:0)+'">'+this.db.city[tmp]+'</a>').appendTo("#city-ans-container");
				used.push(tmp);
			} else {
				while( used.indexOf(tmp)>-1 && loopctr<99){
					loopctr++;
					tmp=Math.floor((Math.random() * cities.length)); //choose wrong answers (which is same country)
				} 
				used.push(tmp);
				$('<a class="pure-button answer" href="#" value="'+((ctr==anspos)?1:0)+'">'+cities[tmp]+'</a>').appendTo("#city-ans-container");
			}
		}
	}
	
	Game.prototype.next = function(){
		$(".refresh").html(""); //reset interface
		var cur_q=this.nxt_q();
		$("#cur_q").html(cur_q); 
		if ( cur_q > this.questions ) this.gameover();
		else {
			switch(this.kind){
				case "city": this.next_city(); break;
				case "state": this.next_state();break;
				case "flag": this.next_flag();break;
			}
		}
		var game=this; var tmpanim=game.animIn();
		
		function afterinanim(){
			$('.progress').asPieProgress('reset').asPieProgress('start');//timer indicator
			game.timer=setTimeout(function(){ game.check(0); }, game.timeout * 1000);
		}
		
		if (!this.anim) afterinanim();
		else $("#question").addClass("animated "+tmpanim).off().on('webkitAnimationEnd webkitTransitionEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', 
			function(){ //execute after finishing animation in
				$("#question").unbind().removeClass("animated "+tmpanim);
				afterinanim();
			}
		);
	}
	
	Game.prototype.check = function(val){ //check if answer is correct
		var game=this; var tmpanim=game.animOut();
		$('.progress').asPieProgress('stop')
		clearTimeout(game.timer); //reset timer
		
		//execute after finishing animation in
		function afteroutanim(){
			game.score += parseInt(val);
			if (game.score==0) {} //play oh no
			else {} //play clap hand
			game.next();
		}
		
		if (!this.anim) afteroutanim();
		else $("#question").addClass("animated "+tmpanim).off().on('webkitAnimationEnd webkitTransitionEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', 
			function(){ 
				$("#question").removeClass("animated "+tmpanim);
				afteroutanim();
			}
		);
	}
		
	Game.prototype.gameover = function(context){
		$("#gameover").click();
	}
	
	window.Game = Game; 
	
}(window));

