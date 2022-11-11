// Il faut enlever les console.log :)
"use strict";

let canvas;
let game;
let anim;

//Paddles dimensions / Dimensions des raquettes
const player_height = 100;
const player_width = 5;

function draw() {
    let context = canvas.getContext("2d");

    //Draw field / Création du "terrain"
    context.fillStyle = "Black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    //Draw middle line / Création de la ligne médiane
    context.strokeStyle = "White";
    context.beginPath();
    context.moveTo(canvas.width/2, 0);
    context.lineTo(canvas.width/2, canvas.height);
    context.stroke();

    //Draw players / Création des joueurs ou raquettes
    context.fillStyle = "white";
    context.fillRect(0, game.player.y, player_width, player_height);
    context.fillRect(canvas.width - player_width, game.computer.y, player_width, player_height);

    //Draw ball / Création de la balle
    context.beginPath();
    context.fillStyle = "white";
    context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI*2, false);
    context.fill();
}

function play() {
    //Ball speed / Vitesse de la balle
    game.ball.x += game.ball.speed.x;

    draw();
    computerMove();
    ballMove();

    anim = requestAnimationFrame(play);
}

function ballMove() {
    //Bounces on top and bottom / Rebonds sur les bords supérieur et inférieur
    if (game.ball.y > canvas.height || game.ball.y < 0) {
        game.ball.speed.y = -game.ball.speed.y;
    }

    //Bounces on paddles / Rebonds sur les raquettes
    if (game.ball.x > canvas.width - player_width) {
        collide_computer(game.computer);
    } else if (game.ball.x < player_width) {
        collide_player(game.player);
    }

    function changeDirection(playerPosition) {
        let impact = game.ball.y - playerPosition - player_height/2;
        let ratio = 100 / (player_height/2);

        //Get a value between 0 and 10 / Obtenir une valeur entre 0 et 10
        game.ball.speed.y = Math.round(impact * ratio /10);
    }

    function collide_player() {
        if (game.ball.x < player_width && game.ball.y > game.player.y && game.ball.y < game.player.y + player_height) {
            console.log("Pong");
            game.ball.speed.x = -game.ball.speed.x;
            //Increases speed and changes ball's direction / Augmenter la vitesse de la balle et changer sa direction
            game.ball.speed.x *= 1.05;
            changeDirection(game.player.y);
        } else {
            //Set ball and players to the center / Remettre la balle et les joueurs au centre
            game.ball.x = canvas.width/2;
            game.ball.y = canvas.height/2;
            game.player.y = canvas.height/2 - player_height/2;
            game.computer.y = canvas.height/2 - player_height/2;

            //Reset ball's speed / Réinitialiser la vitesse de la balle
            game.ball.speed.x = 2;

            //Update score / Mettre le score à jour
            game.computer.score++;

            // Si tu utilises des id dans ton HTML, utilises getElementById ça améliore la performance
            document.querySelector("#computer-score").textContent = game.computer.score;
            console.log("Computer scores");
        }
    }

    function collide_computer() {
        if (game.ball.x > canvas.width - player_width && game.ball.y > game.computer.y && game.ball.y < game.computer.y + player_height) {
            console.log("Ping");
            game.ball.speed.x = -game.ball.speed.x;
            //Increases speed and changes ball's direction / Augmenter la vitesse de la balle et changer sa direction
            game.ball.speed.x *= 1.05;
            changeDirection(game.computer.y);
        } else {
            //Set ball and players to the center / Remettre la balle et les joueurs au centre
            game.ball.x = canvas.width/2;
            game.ball.y = canvas.height/2;
            game.player.y = canvas.height/2 - player_height/2;
            game.computer.y = canvas.height/2 - player_height/2;

            //Reset ball's speed / Réinitialiser la vitesse de la balle
            game.ball.speed.x = 2;

            //Update score / Mettre le score à jour
            game.player.score++;
            document.querySelector("#player-score").textContent = game.player.score;
            console.log("Player scores");
        }
    }

    //Win / Lose conditions and events / Conditions de victoire / défaite et évènements
    // Prend l'habitude de vérifier une égalité stricte en utilisant === au lieu de ==
    // En effet == vérifie juste le contenu. En gros 5 == "5" => return true, alors que 5 === "5" => return false.
    // car avec === il vérifie la valeur mais aussi le type de la valeur et c'est une bonne pratique
    // Dans ce code ce n'est pas très dérangeant mais ça peut vite créer des effets de bord indésirable.
    if (game.computer.score == 5) {
        console.log("Game Over, computer wins.");
        // ATTENTION !!!!! innerHTML ne doit jamais être utilisé !! ceci crée une faille de sécurité XSS !
        // Utilise plutôt textContent. Voilà pourquoi => https://medium.com/@izadzandi/javascript-innerhtml-quand-lutiliser-915846ab0056
        document.getElementById("win_message").innerHTML = "Game Over, computer wins.";
        window.location.reload();
    } else if (game.player.score == 5) {
        console.log("Game Over, Player 1 wins.");
        document.getElementById("win_message").innerHTML = "Game Over! You Win!";
        window.location.reload();
    }
    
    game.ball.x += game.ball.speed.x;
    game.ball.y += game.ball.speed.y;
}

function playerMove(event) {
    //Get the mouse location in the canvas / Récupérer la position de la souris dans le canevas
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

//AI speed / Vitesse de l'IA
function computerMove() {
    game.computer.y += game.ball.speed.y * 0.80;
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

    //Mouse move event / Evènement de mouvement de la souris
    canvas.addEventListener("mousemove", playerMove);

    draw();
    
    document.querySelector("#start-game").addEventListener("click", play);
    document.querySelector("#stop-game").addEventListener("click", stop);

    //Stop the game / Arrêter le jeu
    function stop() {
        cancelAnimationFrame(anim);

        //Set ball and players to the center / Remettre la balle et les joueurs au centre
        game.ball.x = canvas.width/2;
        game.ball.y = canvas.height/2;
        game.player.y = canvas.height/2 - player_height/2;
        game.computer.y = canvas.height/2 - player_height/2;

        //Reset ball's speed / Réinitialiser la vitesse de la balle
        game.ball.speed.x = 2;
        game.ball.speed.y = 2;

        //Reset score / Réinitialiser le score
        game.computer.score = 0;
        game.player.score = 0;

        document.querySelector("#computer-score").textContent = game.computer.score;
        document.querySelector("#player-score").textContent = game.player.score;

        draw();
    }

});

//Thanks for reading / Merci d'avoir lu mon code!




























//COUCOU BEN