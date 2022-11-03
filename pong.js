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
        collide_computer(game.computer);
    } else if (game.ball.x < player_width) {
        collide_player(game.player);
    }

    function changeDirection(playerPosition) {
        let impact = game.ball.y - playerPosition - player_height/2;
        let ratio = 100 / (player_height/2);

        //Get a value between 0 and 10
        game.ball.speed.y = Math.round(impact * ratio /10);
    }

    /*function collide(player) {
        //The player does not hit the ball
        if (game.ball.y < game.player.y && game.ball.x < player_width || game.ball.y < game.player.y && game.ball.x > canvas.width - player_width || game.ball.y > game.player.y + player_height && game.ball.x < 0 || game.ball.y > game.player.y + player_height && game.ball.x > canvas.width) {
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
    }*/

    function collide_player() {
        if (game.ball.x < player_width && game.ball.y > game.player.y && game.ball.y < game.player.y + player_height) {
            console.log("Pong");
            game.ball.speed.x = -game.ball.speed.x;
            //Increases speed and changes direction
            game.ball.speed.x *= 1.05;
            changeDirection(game.player.y);
        } else {
            //Set ball and players to the center
            game.ball.x = canvas.width/2;
            game.ball.y = canvas.height/2;
            game.player.y = canvas.height/2 - player_height/2;
            game.computer.y = canvas.height/2 - player_height/2;

            //Reset speed
            game.ball.speed.x = 2;

            //Update score
            game.computer.score++;
            document.querySelector("#computer-score").textContent = game.computer.score;
            console.log("Computer scores");
        }
    }

    function collide_computer() {
        if (game.ball.x > canvas.width - player_width && game.ball.y > game.computer.y && game.ball.y < game.computer.y + player_height) {
            console.log("Ping");
            game.ball.speed.x = -game.ball.speed.x;
            //Increases speed and changes direction
            game.ball.speed.x *= 1.05;
            changeDirection(game.computer.y);
        } else {
            //Set ball and players to the center
            game.ball.x = canvas.width/2;
            game.ball.y = canvas.height/2;
            game.player.y = canvas.height/2 - player_height/2;
            game.computer.y = canvas.height/2 - player_height/2;

            //Reset speed
            game.ball.speed.x = 2;

            //Update score
            game.player.score++;
            document.querySelector("#player-score").textContent = game.player.score;
            console.log("Player scores");
        }
    }

    if (game.computer.score == 5) {
        console.log("Game Over, computer wins.");
        document.getElementById("win_message").innerHTML = "Game Over, computer wins.";
        stop();
    } else if (game.player.score == 5) {
        console.log("Game Over, Player 1 wins.");
        document.getElementById("win_message").innerHTML = "Game Over! You Win!";
        stop();
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
    game.computer.y += game.ball.speed.y * 0.75;
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