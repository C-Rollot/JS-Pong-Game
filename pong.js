/*//BOUTON DE LANCEMENT DU JEU
let launchBtn = document.getElementById("launch");

function game() {
    //VARIABLES
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    let ballRadius = 10;

    var x = canvas.width /2;
    var y = canvas.height /2;

    var dx = 4;
    var dy = -4;

    var paddleHeight = 75;
    var paddleWidth = 10;

    //FONCTIONS
    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI*2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
    }
    setInterval(draw, 10);
}*/

//Set paddle position
var paddle1_y = 40;
var paddle2_y = 40;

//Set paddle size
var paddle_thickness = 10;
var paddle_height = 100;

//Set ball position
var ball_x = 50;
var ball_y = 50;

//Set ball size
var ball_dimension = 15;

//Set speed variables
var x_velocity = 5;
var y_velocity = x_velocity;
var computer_speed = 5;

//Create variables to hold player scores
var player1_score = 0;
var player2_score = 0;

//Set the winning score
var winning_score = 5;
var reset_game = false;

window.onload = function () {
    //Retrieve and load the canvas
    let canvas = document.getElementById("gc");
    let context = canvas.getContext("2d");

    //Set frame rate to 60 frames per second
    let run_game = setInterval(run, 1000/60);

    /*Control user paddle:
    clientY read-only property returns the vertical coordinate within the application's cleint area at which the event occurred (as opposed to the coordinates within the page)*/
    /*canvas.addEventListener("mousemove", function(e) {
        paddle1_y = e.clientY - paddle_height/2;
    });*/

    function reset_ball() {
        //Reset the ball's placement and direction after scoring
        ball_x = canvas.width/2;
        ball_y = canvas.height/2;
        x_velocity = -x_velocity;
    }

    function move_ball() {
        //Get the ball moving
        ball_x += x_velocity;
        ball_y += y_velocity;
    }

    function computer_paddle() {
        //Move the AI's paddle up or down based on the y position of the ball
        if (paddle2_y + paddle_height/2 < ball_y) {
            paddle2_y += computer_speed;
        } else {
            paddle2_y -= computer_speed;
        }
    }

    function bounce_off() {
        //Bounce the ball off the bottom of the screen
        if (ball_y - (ball_dimension/2) < 0) {
            y_velocity = -y_velocity;
        }

        //Bounce the ball off the top of the screen
        if (ball_y + (ball_dimension/2) > canvas.height) {
            y_velocity = -y_velocity; 
        }

        //Bounce the ball off the left side, if it touches the paddle. Otherwise give a point to the other player and reset the ball
        if (ball_x < 0) {
            if (ball_y > paddle1_y && ball_y < paddle1_y + paddle_height) {
                delta_y = ball_y - (paddle1_y + paddle_height/2);
                y_velocity = delta_y * 0.2;
                x_velocity = -x_velocity;
            } else {
                player2_score++;
                reset_ball();
            }
        }

        //Same on the right side
        if (ball_x > canvas.width) {
            if (ball_y > paddle2_y && ball_y < paddle2_y + paddle_height) {
                delta_y = ball_y - (paddle2_y + paddle_height/2);
                y_velocity = delta_y * 0.2;
                x_velocity = -x_velocity;
            } else {
                player1_score++;
                reset_ball();
            }
        }
    }

    function setup_canvas() {
        //Fill in the canvas with objects
        context.fillStyle = "black";
        context.fillRect(0, 0, canvas.width, canvas.height);

        //Add the paddles color
        context.fillStyle = "white";

        //Add paddle 1
        context.fillRect(0, paddle1_y, paddle_thickness, paddle_height);

        //Add paddle 2
        context.fillRect(canvas.width - paddle_thickness, paddle2_y, paddle_thickness, paddle_height);

        //Draw the ball
        context.fillStyle = "red";
        context.fillRect(ball_x - ball_dimension/2, ball_y - ball_dimension/2, ball_dimension, ball_dimension);

        //Add the score text
        context.fillStyle = "white";
        context.font = "48px Impact";
        context.fillText(player1_score, 300, 75);
        context.fillText(player2_score, 500, 75);

        //Add central line
        context.fillRect(canvas.width/2, 0, 5, canvas.height);
    }

    function did_player_win() {
        if (player1_score === winning_score || player2_score === winning_score) {
            reset_game = true;
            //Stop the game from running
            clearTimeout(run_game);
            context.fillStyle = "white";
            context.font = "48px Impact";
            context.fillText("GAME OVER", canvas.width/2 - canvas.width/6, canvas.height/2);

            if (player1_score === winning_score) {
                context.font = "24px Impact";
                context.fillText("You won!", canvas.width/2 - canvas.width/14, canvas.height/2 + 25);
            }
            if (player2_score === winning_score) {
                context.font = "24px Impact";
                context.fillText("The IA won!", canvas.width/2 - canvas.width/14, canvas.height/2 + 25);
            }
        }
    }

    //Keyboard controls
    let upPressed = false;
    let downPressed = false;

    function keyDownHandler(e) {
        if(e.key == "Right" || e.key == "ArrowRight") {
            upPressed = true;
        } else if(e.key == "Left" || e.key == "ArrowLeft") {
            downPressed = true;
        }
    }

    function keyUpHandler(e) {
        if(e.key == "Right" || e.key == "ArrowRight") {
            upPressed = false;
        } else if(e.key == "Left" || e.key == "ArrowLeft") {
            downPressed = false;
        }
    }

    if(upPressed)  {
        paddle1_y += 5;
    }

    if(downPressed) {
        paddle1_y -= 5;
    }

    //Event listeners
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    function run() {
        move_ball();
        bounce_off();
        computer_paddle();
        setup_canvas();
        did_player_win();
    }
}