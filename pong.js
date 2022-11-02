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
}

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

    Control user paddle:
    clientY read-only property returns the vertical coordinate within the application's cleint area at which the event occurred (as opposed to the coordinates within the page)
    canvas.addEventListener("mousemove", function(e) {
        paddle1_y = e.clientY - paddle_height/2;
    });
    
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
        if(e.key == "Up" || e.key == "ArrowUp") {
            upPressed = true;
        } else if(e.key == "Down" || e.key == "ArrowDown") {
            downPressed = true;
        }
    }

    function keyUpHandler(e) {
        if(e.key == "Up" || e.key == "ArrowUp") {
            upPressed = false;
        } else if(e.key == "Down" || e.key == "ArrowDown") {
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
}*/

"use strict";

let canvas;
let game;
let anim;

const player_height = 100;
const player_width = 5;

function draw() {
    let context = canvas.getContext("2d");

    //Draw field
    context.fillStyle = "Black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    //Draw middle line
    context.strokeStyle = "White";
    context.beginPath();
    context.moveTo(canvas.width/2, 0);
    context.lineTo(canvas.width/2, canvas.height);
    context.stroke();

    //Draw players
    context.fillStyle = "white";
    context.fillRect(0, game.player.y, player_width, player_height);
    context.fillRect(canvas.width - player_width, game.computer.y, player_width, player_height);

    //Draw ball
    context.beginPath();
    context.fillStyle = "white";
    context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI*2, false);
    context.fill();
}

function play() {
    game.ball.x += game.ball.speed.x;
    draw();
    computerMove();
    ballMove();

    anim = requestAnimationFrame(play);
}

function ballMove() {
    //Bounces on top and bottom
    if (game.ball.y > canvas.height || game.ball.y < 0) {
        game.ball.speed.y = -game.ball.speed.y;
    }

    //Bounces on paddles
    if (game.ball.x > canvas.width - player_width) {
        collide(game.computer);
    } else if (game.ball.x < player_width) {
        collide(game.player);
    }

    function changeDirection(playerPosition) {
        let impact = game.ball.y - playerPosition - player_height/2;
        let ratio = 100 / (player_height/2);

        //Get a value between 0 and 10
        game.ball.speed.y = Math.round(impact * ratio /10);
    }

    function collide(player) {
        //The player does not hit the ball
        if (game.ball.y < player.y && game.ball.x < player_width || game.ball.y < player.y && game.ball.x > canvas.width - player_width || game.ball.y > player.y + player_height && game.ball.x < player_width || game.ball.y < player.y && game.ball.x > canvas.width - player_width) {
            //Set ball and players to the center
            game.ball.x = canvas.width/2;
            game.ball.y = canvas.height/2;
            game.player.y = canvas.height/2 - player_height/2;
            game.computer.y = canvas.height/2 - player_height/2;

            //Reset speed
            game.ball.speed.x = 2;
        } else {
            //Increases speed and changes direction
            game.ball.speed.x *= -1.2;
            changeDirection(player.y);
        }

        //MS Gothic

        //Update score
        if (player == game.player) {
            game.computer.score++;
            document.querySelector("#computer-score").textContent = game.computer.score;
            console.log("Computer scores");
        } else {
            game.player.score++;
            document.querySelector("#player-score").textContent = game.player.score;
            console.log("Player 1 scores");
        }

        if (game.player.score == 5) {
            alert("Game Over, Player 1 wins.");
            location.reload();
        } else if (game.computer.score == 5) {
            alert("Game Over, Computer wins.");
            location.reload();
        }
    }

    game.ball.x += game.ball.speed.x;
    game.ball.y += game.ball.speed.y;
}

function playerMove(event) {
    //Get the mouse location in the canvas
    let canvasLocation = canvas.getBoundingClientRect();
    let mouseLocation = event.clientY - canvasLocation.y;

    game.player.y = mouseLocation - player_height/2;

    if (mouseLocation < player_height/2) {
        game.player.y = 0;
    } else if (mouseLocation > canvas.height - player_height/2) {
        game.player.y = canvas.height - player_height;
    } else {
        game.player.y = mouseLocation - player_height/2;
    }
}

function computerMove() {
    game.computer.y += game.ball.speed.y * 0.98;
}

document.addEventListener("DOMContentLoaded", function() {
    canvas = document.getElementById("canvas");

    game = {
        player: {
            y: canvas.height/2 - player_height/2,
            score: 0
        },
        computer: {
            y: canvas.height/2 - player_height/2,
            score: 0
        },
        ball: {
            x: canvas.width/2,
            y: canvas.height/2,
            r: 5,
            speed: {
                x: 2,
                y: 2
            }
        }
    }

    //Mouse move event
    canvas.addEventListener("mousemove", playerMove);

    draw();
    document.querySelector("#start-game").addEventListener("click", play);
    document.querySelector("#stop-game").addEventListener("click", stop);

    function stop() {
        cancelAnimationFrame(anim);

        //Set ball and players to the center
        game.ball.x = canvas.width/2;
        game.ball.y = canvas.height/2;
        game.player.y = canvas.height/2 - player_height/2;
        game.computer.y = canvas.height/2 - player_height/2;

        //Reset speed
        game.ball.speed.x = 2;
        game.ball.speed.y = 2;

        //Init score
        game.computer.score = 0;
        game.player.score = 0;

        document.querySelector("#computer-score").textContent = game.computer.score;
        document.querySelector("#player-score").textContent = game.player.score;

        draw();
    }
});