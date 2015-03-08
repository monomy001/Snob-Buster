$(document).ready(function(){
	$.ajaxSetup({ cache: false });
	var game = new Game(); 
	
	function loading(){
		$.ajax({
		  xhr: function(){
			var xhr = new window.XMLHttpRequest();
			xhr.addEventListener("progress", function(evt){
			  if (evt.lengthComputable) {
				var percentComplete = evt.loaded / evt.total * 100;
				$('.progress').asPieProgress('go',percentComplete);
			  }}, false);
			return xhr;
		  },
		  url:"asset/IP2LOCATION-LITE-DB3.CSV",
		  success:function(res){
			res=res.split('Republic of","').join('Republic of ');
			var lines=res.split("\r\n");
			for (i in lines){
				if (i>=game.complexity) break;
				var tmp=lines[i].split('"').join('');
				var line=tmp.split(',');
				if (line[5]!="-" && game.db.city.indexOf(line[5])==-1){
					game.db.city.push(line[5]);
					game.db.state.push(line[4]);
					game.db.country.push(line[3]);
					game.db.flag.push(line[2]);
				}
			}
			/*console.log(game.db.city);
			console.log(game.db.state);
			console.log(game.db.country);*/
			
			nextpage("pages/option.html");
		  }
		});
	}
	function pagestart(url){
		if (url=="pages/intro.html"){
			$(".progress").asPieProgress({
				namespace: 'pieProgress', size:355
			});
			$('.progress').asPieProgress('start');
			loading();
		} else if (url=="pages/gameover.html"){
			var mark=Math.floor(game.score/game.questions*100);
			if (mark<60){
				$("#thispage #title").html("Whining Wimp");
				$("#thispage #img").attr("src","img/wimp.png");
				$("#thispage #intro").html("What ?? You want to call yourself snob?<br>Go back to your class room and do your geography homework..<br>Shame on you !!");
			} else if (mark<90){
				$("#thispage #title").html("Naughty Nerd");
				$("#thispage #img").attr("src","img/nerd.png");
				$("#thispage #intro").html("Not bad..<br>But you have not yet deserved the title snob!<br>Give it another try!");
			} else {
				$("#thispage #title").html("Super Snob");
				$("#thispage #img").attr("src","img/snob.png");
				$("#thispage #intro").html("Congratulation, you earned the title snob.<br>It's not a surprise that people look you up for info.<br>Make sure you have the word 'almanac' on your cover.");
			}
			
			$("#thispage #score").html(game.score);
			$("#thispage #total").html(game.questions); 
		} else if (url=="pages/settings.html"){
			game.update();
		} else {
			var tmp=url.split("pages/").join("").split(".html").join("");
			game.start(tmp);
		}
		$(".loading").toggle();
	}
	function nextpage(url){
		$("#nextpage").load(url+'?_=' + (new Date()).getTime(),function(){
			function afterload(){
				$("#thispage").html($("#nextpage").html());
				$("#nextpage").html("");
				pagestart(url);
			}
			if (!game.anim) afterload();
			else $("#thispage").addClass("animated hinge").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
				$("#thispage").removeClass("animated hinge");
				afterload();
			});
		});
	}
	setTimeout(function(){ nextpage("pages/intro.html") }, 2000);
	$("#thispage").delegate("a[href!=#]","click",function(e){
		nextpage($(this).attr("href"));
		e.preventDefault();
	});
	$("#thispage").delegate("a.answer","click",function(e){
		game.check($(this).attr("value"));
		e.preventDefault();
	});
	$("#thispage").delegate("a#save","click",function(e){ //updating settings
		game.update("save");
		e.preventDefault();
	});
	$("#thispage").delegate("a#msg","click",function(e){ //send msg
		alert("We appreciate your feedback.\nAlthough I cant promise to write back, but your message will be noted.");
		nextpage("pages/option.html");
		e.preventDefault();
	});
	$("#nextpage").delegate("a","click",function(e){ e.preventDefault(); }); //avoid bug with clicking a link before finished hinge animation
});

