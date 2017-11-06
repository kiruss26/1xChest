  $( function() {
	  $(".spinn").spinner({
        min: 0,
        max: 9999 
    });
	});
	window.onload = function(){
		var gameContainer = document.getElementById("gameCont");
		var sellInput = document.getElementById("sellQuantity");
		var sellButton = sellInput.parentNode;
		var rub = document.getElementById("rub");
		var buyButton = document.getElementById("buy_button");
		var tockens = document.getElementById("tokens");
		var balance = document.getElementById("balance");
		
		var startButton = document.getElementById("startGame");
		
		var chestArray = [0,0,0,
		                  0,0,0,
						  0,0,0];
		var chestsOpened = [];	
		
		var slotsBlink = $(".slot .blink");
		
		randomiseChestsArray();
		
		
		slotsBlink.next().on('click', function() {
			var data = gameContainer.dataset;
			if(data.game == "0"){
				$(this).prev().animate({ opacity: "1"}, 200).animate({ opacity: "0"}, 200).animate({opacity: "1"}, 200).animate({opacity: "0"}, 200);
			}
		});
		
		sellInput.oninput = function(){
			rub.innerHTML = this.value * 50;
		};
		sellButton.onclick = function(){
			rub.innerHTML = sellInput.value * 50;
		};
		buyButton.onclick = function(){
			if (Number(balance.innerHTML) > Number(rub.innerHTML)){
				balance.innerHTML = balance.innerHTML - rub.innerHTML;
				tockens.innerHTML = Number(tockens.innerHTML) + Number(sellInput.value);
				rub.innerHTML = 0;
				sellInput.value = 0;
				startButtonChangeState();
			} else{
				$( "#no-money-message" ).dialog({
									  modal: true,
									  draggable: false,
									  resizable: false,
									  buttons: {
										ok: function() {
										  $( this ).dialog( "close" );
										}
									  }
									});
			}	
		};
		startButton.onclick = function(){
			if (startButton.classList.contains("active")){
				tockens.innerHTML = tockens.innerHTML - 1;
				startButton.classList.remove("active");
				gameStart();
			}
		};
	
		
	function startButtonChangeState(){
		var data = gameContainer.dataset;
		if (Number(tockens.innerHTML) > 0){
			if (!startButton.classList.contains("active")){
				if(data.game == "0"){
				startButton.classList.add("active");
				}
			}
		} else{
			startButton.classList.remove("active");
		}
	}
	
	function gameStart(){
		var data = gameContainer.dataset;
		data.game = "1";
		animateAllChests();
	}
	
	function refreshGame(){
		var data = gameContainer.dataset;
		data.game = "0";
		for (i=0; i < chestArray.length; i++ ){
			var chest = document.getElementsByClassName("chest")[i];
			chest.style.removeProperty('animation');
		}
	chestsOpened = [];
		startButtonChangeState();
		randomiseChestsArray();
	}
	
	
	function animateAllChests(){
		var timing = 150;
		$(".slot .blink").animate({ opacity: "1"}, timing).animate({ opacity: "0"}, timing);
	}

	function randomiseChestsArray(){

		for (i=0; i < chestArray.length; i++ ){
			chestArray[i] = 0;
		}


		var limit = 3,
		    amount = 3,
		    lower_bound = 0,
		    upper_bound = 8,
		    unique_random_numbers = [];

		if (amount > limit) limit = amount; 
		
		while (unique_random_numbers.length < limit) {
		    var random_number = Math.round(Math.random() * (upper_bound - lower_bound) + lower_bound);
		    if (unique_random_numbers.indexOf(random_number) == -1) {
		        unique_random_numbers.push(random_number);
		    }
		}
		for (var i = 0; i<unique_random_numbers.length; i++) {
			chestArray[unique_random_numbers[i]] = 1;	
		}
				for (i=0; i < chestArray.length; i++ ){
			var chest = document.getElementsByClassName("chest")[i];
			var state = chestArray[i];
			var chestData = chest.dataset;
				if (state){
					chest.style.background = "url(./img/anim-gold.png) no-repeat";
				} else{
					chest.style.background = "url(./img/anim-empty.png) no-repeat";
				}
			chestData.treusure = chestArray[i];
			chestData.id = i;
			chest.onclick = function(){
				var data = gameContainer.dataset;
				if(data.game == "1"){
					this.style.animation = "chest 0.2s steps(2) forwards";
					var treusure = this.getAttribute('data-treusure');
					var id = this.getAttribute('data-id');
					if(treusure == 1){
						if (chestsOpened.indexOf(id) == -1){
						chestsOpened.push(id);
						}
						if (chestsOpened.length == 3){ 
							for (i=0; i < chestArray.length; i++ ){
								var timing = 140;
								$(".slot .blink").eq(chestsOpened[i]).animate({ opacity: "1"}, timing).animate({ opacity: "0"}, timing).animate({ opacity: "1"}, timing).animate({ opacity: "0"}, timing).animate({ opacity: "1"}, timing).animate({ opacity: "0"}, timing);
							}
						setTimeout(function(){ $( function() {
									$( "#win-message" ).dialog({
									  modal: true,
									  draggable: false,
									  resizable: false,
									  buttons: {
										ok: function() {
										  $( this ).dialog( "close" );
										}
									  }
									});
								  } );
							var newBalance = Number(balance.innerHTML) + 1000;
							balance.innerHTML = newBalance;
							refreshGame();
						}, 800); } 
					} else {
						setTimeout(function(){ $( function() {
									$( "#lose-message" ).dialog({
									  modal: true,
									  draggable: false,
									  resizable: false,
									  buttons: {
										ok: function() {
										  $( this ).dialog( "close" );
										}
									  }
									});
								  } ); refreshGame(); }, 500);
					}	
				}
			};
		}
		console.log(chestArray);
	}
		
		/* Canvas */
			var canvas;
			var stage;
			var width = 650;
			var height = 400;
			var particles = [];
			var max = 60;
			var mouseX=0;
			var mouseY=0;

			var speed=3;
			var size=20;

			//The class we will use to store particles. It includes x and y
			//coordinates, horizontal and vertical speed, and how long it's
			//been "alive" for.
			function Particle(x, y, xs, ys) {
			  this.x=x;
			  this.y=y;
			  this.xs=xs;
			  this.ys=ys;
			  this.life=0;
			}

			function resizeCanvas() {
			  setTimeout(function() {
				width = window.innerWidth;
				height = window.innerHeight;
				canvas.width = 200;
				canvas.height = 400;
				canvas.style.width = 450 + "px";
				canvas.style.height = 520 + "px";
				mouseX=canvas.width/2;
				mouseY=canvas.height*0.8;
			   stage.globalCompositeOperation="lighter"
			  }, 0);
			}

			function init() {
			  
			  //Reference to the HTML element
			  canvas=document.getElementById("flame");
			  
			  resizeCanvas();
			  
			  //See if the browser supports canvas
			  if (canvas.getContext) {
				
				//Get the canvas context to draw onto
				stage = canvas.getContext("2d");
				
				//Makes the colors add onto each other, producing
				//that nice white in the middle of the fire
				stage.globalCompositeOperation="xor";
				

				
				//Update the particles every frame
				var timer=setInterval(update,40);
				
			  } else {
				alert("Canvas not supported.");
			  }
			}

			function getMousePos (evt) {
			  var rect = canvas.getBoundingClientRect();
			  var root = document.documentElement;
			  
			  // return mouse position relative to the canvas
			  mouseX = evt.clientX - rect.left - root.scrollLeft;
			  mouseY = evt.clientY - rect.top - root.scrollTop;
			}

			function update() {

			  //Adds ten new particles every frame
			  for (var i=0; i<10; i++) {
				
				//Adds a particle at the mouse position, with random horizontal and vertical speeds
				var p = new Particle(mouseX, mouseY, (Math.random()*2*speed-speed)/2, 0-Math.random()*2*speed);
				particles.push(p);
			  }
			  
			  //Clear the stage so we can draw the new frame
			  stage.clearRect(0, 0, width, height);
			  
			  //Cycle through all the particles to draw them
			  for (i=0; i<particles.length; i++) {
				
				//Set the file colour to an RGBA value where it starts off red-orange, but progressively gets more grey and transparent the longer the particle has been alive for
				stage.fillStyle = "rgba("+(260-(particles[i].life*2))+","+((particles[i].life*2)+50)+","+(particles[i].life*2)+","+(((max-particles[i].life)/max)*0.4)+")";
				
				stage.beginPath();
				//Draw the particle as a circle, which gets slightly smaller the longer it's been alive for
				stage.arc(particles[i].x,particles[i].y,(max-particles[i].life)/max*(size/2)+(size/2),0,2*Math.PI);
				stage.fill();
				
				//Move the particle based on its horizontal and vertical speeds
				particles[i].x+=particles[i].xs;
				particles[i].y+=particles[i].ys;
				
				particles[i].life++;
				//If the particle has lived longer than we are allowing, remove it from the array.
				if (particles[i].life >= max) {
				  particles.splice(i, 1);
				  i--;
				}
			  }
			}
			init();

};

	