/**
* Escape the Zombies
**/

$(document).ready(function(){
	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	var char_size = 50;
	var game_tick = 60;

        // Create the character images
	var hero = {};
	var zombie = {};

        // Init Directions
	var DIR_UP = 1;
	var DIR_DOWN = 2;
	var DIR_LEFT = 3;
	var DIR_RIGHT = 4;

        // Create Game state vars
	var score;
	var game_speed;
	var score_interval;
	var speed_interval;

        // Init Game Objects
	function init() {
		// Load the character images
		hero.img = new Image();
		hero.img.src = 'images/hero.png';
		
		zombie.img = new Image();
		zombie.img.src = 'images/zombie.gif';

                // Define the character starting positions
		hero.pos = {};
		hero.pos.x = 0;
		hero.pos.y  = 0;

                zombie.pos = {};
		zombie.pos.x = w - char_size
		zombie.pos.y  = h - char_size;

                // Set Initial Player Directions
		hero.direction = DIR_RIGHT;
		zombie.direction = DIR_LEFT;

                // Init Game State Vars
		score = 0;
		game_speed = 1;
		score_interval = new Date();
		speed_interval = new Date();

               	// Set game loop interval to 60ms
		if(typeof game_loop != "undefined") {
			clearInterval(game_loop);
		}
		game_loop = setInterval(draw, game_tick);
	}

        init();// Lets get this party started

               
	// Method to draw the full convas on every game tick
        function draw() {
		// Define Background and Wall
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);
	       
		var score_text = "Score: " + score;
		ctx.strokeStyle = "#f00";
		ctx.font = '20px san-serif';
		ctx.textBaseline = 'bottom';
		ctx.strokeText(score_text, 5, h-5);

		if (is_captured()) {
			clearInterval(game_loop); // Stop the game
	
			// Display Game over msg
			ctx.font = '40px san-serif';
			ctx.strokeText('Game Over', 130, 250);       

			return;
		}

	       

		// Draw the two characters
		ctx.drawImage(hero.img, hero.pos.x, hero.pos.y);
		ctx.drawImage(zombie.img, zombie.pos.x, zombie.pos.y);

		// Update Zombie Position
		zombie_hunt();

		if (new Date() - score_interval > 20000) {
		        score_interval = new Date();
		        score++;
		}

		if (new Date() - speed_interval > 45000) {
	                speed_interval = new Date();
	                game_speed++;
		}
        }

	// Check if the zombie has captured the hero
        function is_captured() {
		if (Math.abs(hero.pos.x - zombie.pos.x) < char_size) {
		        if (Math.abs(hero.pos.y - zombie.pos.y) < char_size) {
                        	return true;
		        }
		}
		return false;
        }

       
	// Update the zombie direction based on the position of
	// the hero
        function zombie_hunt() {                            
		if (hero.pos.x === zombie.pos.x) {
		        if(hero.pos.y < zombie.pos.y) {
                        	zombie.direction = DIR_UP;
		        } else if (hero.pos.y > zombie.pos.y) {
		                zombie.direction = DIR_DOWN;
		        }
		} else if (hero.pos.x < zombie.pos.x) {
	                zombie.direction = DIR_LEFT;
		} else {
	                zombie.direction = DIR_RIGHT;
		}                             

		update_pos(zombie, game_speed);
        }

       
	// Update the position of the character
	// Increment the position by the mulitplier in 
 	// the characters current direction
        function update_pos(character, multp) {
		if (typeof(multp) === 'undefined') multp = 1 // Default val

		var newx = character.pos.x;
		var newy = character.pos.y;

		switch(character.direction) {
	                case DIR_UP:
	                                newy -= multp;
	                                break;
	                case DIR_DOWN:
	                                newy += multp;
	                                break;
	                case DIR_LEFT:
	                                newx -= multp;
	                                break;
	                case DIR_RIGHT:
	                                newx += multp;
	                                break;
		}

		if (is_valid_move(newx, newy)) {
		                character.pos.x = newx;
		                character.pos.y = newy;
		}
        }

       
	// Handle collision with game boundaries
        function is_valid_move(newx, newy) {
		if ((newx < 0 || newx > w - char_size)
	                || (newy < 0 || newy > h - char_size)) {
	                return false;
		} else {
	                return true;
		}
        }

       

        // Attach listeners to control keys
        $(document).keydown(function(e){
                var key = e.which;
                if(key == "37") {
                                hero.direction = DIR_LEFT;
                } else if(key == "38") {
                                hero.direction = DIR_UP;
                } else if(key == "39") {
                                hero.direction = DIR_RIGHT;
                } else if(key == "40") {
                                hero.direction = DIR_DOWN;
                }

                update_pos(hero);
        })
})
