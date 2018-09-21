var ball = document.getElementById("ball");
var ballHeight = null;
ball.style.top = (innerHeight / 2) - ballHeight / 2 + "px";
ball.style.left = (innerWidth / 2) - ballHeight / 2 + "px";
var playerOneBar = document.getElementById("playerOneBar");
var playerTwoBar = document.getElementById("playerTwoBar");
playerOneBar.style.top = (innerHeight / 2) - 63 + "px";
playerTwoBar.style.top = (innerHeight / 2) - 63 + "px";
var playerOneLocation = [playerOneBar.offsetTop, playerOneBar.offsetTop + 125];
var playerTwoLocation = [playerTwoBar.offsetTop, playerTwoBar.offsetTop + 125];
var yVelocity = 0;
var xVelocity = 0;
var playerOneScore = 0;
var playerTwoScore = 0;
var gameNotStarted = false;
var inPlayerMenu = true;
var playerSelectionChanged = false;
var bouncer = null;
var xPosition = 0;
var yPosition = 0;
var scorer = null;
var countdownNum = 3;
const winningScore = 11;
var endingStage = 0;
var hit = null;

var keyState = {};
window.addEventListener("keydown", function (e) {
    keyState[e.keyCode || e.which] = true;
}, true);
window.addEventListener("keyup", function (e) {
    keyState[e.keyCode || e.which] = false;
}, true);

window.addEventListener("keyup", function() {
    playerSelectionChanged = false;
}, true);

function gameControls(evt) {
    if (inPlayerMenu) {
        var onePlayerSelection = document.getElementById("onePlayerGame");
        var twoPlayerSelection = document.getElementById("twoPlayerGame");
        if (keyState[37] || keyState[39]) {
            if (!playerSelectionChanged) {
                onePlayerSelection.classList.toggle("selected");
                twoPlayerSelection.classList.toggle("selected");
                playerSelectionChanged = true;
            }
        }
        if (keyState[13]) {
            if (onePlayerSelection.classList.contains("selected")) {
                launchOnePlayerMenu();
            } else {
                document.getElementById("inGame").style.display = "block";
                setTimeout(gameWaiting, 900);
                setTimeout(function() {
                    gameNotStarted = true;
                }, 500);
            }
            document.getElementById("playerSelect").style.display = "none";
            inPlayerMenu = false;
        }
    } else if (gameNotStarted) {
        if (keyState[13]) {
            startGame();
        }
    } else {
        if (keyState[87]) {
            movePlayerOneUp();
        }
        if (keyState[83]) {
            movePlayerOneDown();
        }
        if (keyState[38]) {
            movePlayerTwoUp();
        }
        if (keyState[40]) {
            movePlayerTwoDown();
        }
    }
    setTimeout(gameControls, 10);
}

function startGame() {
    gameNotStarted = false;
    document.getElementById("gameStatus").innerHTML = "";
    document.getElementById("gameStatus").style.display = "none";
    document.querySelector("#playerOneScore p").innerHTML = playerOneScore;
    document.querySelector("#playerTwoScore p").innerHTML = playerTwoScore;
    xVelocity = randomVelocity(5, 6);
    yVelocity = randomVelocity(4, 5);
    // xVelocity = 15;
    // yVelocity = 6;
    setTimeout(countDown, 100);
    setTimeout(function () {
        ball.style.display = "block";
        ballHeight = ball.offsetHeight;
        yPosition = parseInt(ball.style.top);
        xPosition = parseInt(ball.style.left);
        bouncer = setInterval(bounce, 10);
    }, 3850);
}

function movePlayerOneUp() {
    if (playerOneBar.offsetTop >= 0) {
        playerOneBar.style.top = playerOneBar.offsetTop - 5 + "px";
        updatePlayerLocation();
    }
}

function movePlayerOneDown() {
    if (playerOneBar.offsetTop <= innerHeight - 125) {
        playerOneBar.style.top = playerOneBar.offsetTop + 5 + "px";
        updatePlayerLocation();
    }
}

function movePlayerTwoUp() {
    if (playerTwoBar.offsetTop >= 0) {
        playerTwoBar.style.top = playerTwoBar.offsetTop - 5 + "px";
        updatePlayerLocation();
    }
}

function movePlayerTwoDown() {
    if (playerTwoBar.offsetTop <= innerHeight - 125) {
        playerTwoBar.style.top = playerTwoBar.offsetTop + 5 + "px";
        updatePlayerLocation();
    }
}

function updatePlayerLocation() {
    playerOneLocation = [playerOneBar.offsetTop, playerOneBar.offsetTop + 125];
    playerTwoLocation = [playerTwoBar.offsetTop, playerTwoBar.offsetTop + 125];
}

function randomVelocity(start, end) {
    var posOrNeg = Math.floor(Math.random() * 9) - 5;
    while (posOrNeg === 0) {
        posOrNeg = Math.floor(Math.random() * 9) - 5;
    }
    posOrNeg /= Math.abs(posOrNeg);
    return (Math.floor(Math.random() * (end - start + 1) + start)) * posOrNeg;
}

function gameWaiting() {
    if (gameNotStarted) {
        var gameStatus = document.getElementById("gameStatus");
        if (gameStatus.style.display === "none") {
            gameStatus.style.display = "block";
            setTimeout(gameWaiting, 900);
        } else {
            gameStatus.style.display = "none";
            setTimeout(gameWaiting, 300);
        }
    } else {
        clearTimeout(gameWaiting);
    }
}

function resetBall() {
    document.getElementById("scored").style.display = "none";
    document.getElementById("scored").innerHTML = "";
    if (scorer === 1) {
        xVelocity = Math.abs(randomVelocity(5, 6)) * -1;
    } else {
        xVelocity = Math.abs(randomVelocity(5, 6));
    }
    yVelocity = randomVelocity(4, 5);
    countdownNum = 3;
    setTimeout(countDown, 100);
    setTimeout(function () {
        ball.style.top = (innerHeight / 2) - ballHeight / 2 + "px";
        ball.style.left = (innerWidth / 2) - ballHeight / 2 + "px";
        ball.style.display = "block";
        yPosition = parseInt(ball.style.top);
        xPosition = parseInt(ball.style.left);
        bouncer = setInterval(bounce, 10);
    }, 3850);
}

function bounce() {
    //Math.abs(xVelocity) <= 8.5 && 
    if (xVelocity < 0) {
        xVelocity -= .002;
    } else {
        xVelocity += .002;
    }
    var newXPosition = xPosition + xVelocity;
    if (xVelocity < 0) {
        var xDir = -1;
    } else {
        var xDir = 1;
    }
    if (xDir === -1) {
        while (xPosition > newXPosition) {
            xPosition += xDir;
            yPosition -= yVelocity / Math.abs(xVelocity);
            if (xPosition <= 18 &&
                xPosition >= 10 &&
                yPosition >= playerOneLocation[0] - ballHeight &&
                yPosition <= playerOneLocation[1]) {
                xPosition = 18;
                xVelocity *= -1;
                break;
            }
            if (xPosition >= innerWidth) {
                playerOneScore++;
                scorer = 1;
                playerScored();
                break;
            }
            if (xPosition <= 0) {
                playerTwoScore++;
                scorer = 2;
                playerScored();
                break;
            }
            if (yPosition <= 0) {
                yPosition = 0;
                yVelocity *= -1;
            }
            if (yPosition >= innerHeight - ballHeight) {
                yPosition = innerHeight - ballHeight;
                yVelocity *= -1;
            }
            ball.style.top = yPosition + "px";
            ball.style.left = xPosition + "px";
        }
    } else {
        while (xPosition < newXPosition) {
            xPosition += xDir;
            yPosition -= yVelocity / Math.abs(xVelocity);
            if (xPosition >= (innerWidth - ballHeight - 18) &&
                xPosition <= (innerWidth - 10) &&
                yPosition >= playerTwoLocation[0] - ballHeight &&
                yPosition <= playerTwoLocation[1]) {
                xPosition = innerWidth - ballHeight - 18;
                xVelocity *= -1;
                break;
            }
            if (xPosition >= innerWidth) {
                playerOneScore++;
                scorer = 1;
                playerScored();
                break;
            }
            if (xPosition <= 0) {
                playerTwoScore++;
                scorer = 2;
                playerScored();
                break;
            }
            if (yPosition <= 0) {
                yPosition = 0;
                yVelocity *= -1;
            }
            if (yPosition >= innerHeight - ballHeight) {
                yPosition = innerHeight - ballHeight;
                yVelocity *= -1;
            }

            ball.style.top = yPosition + "px";
            ball.style.left = xPosition + "px";
        }
    }

    // yPosition -= yVelocity;
    // xPosition += xVelocity;

}

function countDown() {
    var countdownElement = document.getElementById("countdown");
    countdownElement.style.left = "48.5%";
    if (countdownNum === 3) {
        countdownElement.style.display = "block";
        countdownElement.innerHTML = "3";
        setTimeout(countDown, 1000);
    } else if (countdownNum === 2) {
        countdownElement.innerHTML = "2";
        setTimeout(countDown, 1000);
    } else if (countdownNum === 1) {
        countdownElement.innerHTML = "1";
        setTimeout(countDown, 1000);
    } else if (countdownNum === 0) {
        countdownElement.style.left = "41%";
        countdownElement.innerHTML = "Start!";
        setTimeout(countDown, 750);
    } else {
        countdownElement.style.display = "none";
        countdownElement.innerHTML = "";
    }
    countdownNum--;
}

function playerScored() {
    clearInterval(bouncer);
    ball.style.display = "none";
    var scoredElement = document.getElementById("scored");
    scoredElement.style.display = "block";
    if (scorer === 1) {
        document.querySelector("#playerOneScore p").innerHTML = playerOneScore;
        scoredElement.innerHTML = "Player 1 scored!";
    } else {
        document.querySelector("#playerTwoScore p").innerHTML = playerTwoScore;
        scoredElement.innerHTML = "Player 2 scored!";
    }
    if (playerOneScore === winningScore || playerTwoScore === winningScore) {
        setTimeout(endGame, 1500);
    } else {
        setTimeout(resetBall, 1500);
    }
}

function endGame() {
    endingStage++;
    if (endingStage === 1) {
        var scoredElement = document.getElementById("scored");
        if (scorer === 1) {
            scoredElement.innerHTML = "Player 1 wins!";
        } else {
            scoredElement.innerHTML = "Player 2 wins!";
        }
        setTimeout(endGame, 1500);
    } else {
        document.getElementById("scored").style.display = "none";
        document.getElementById("scored").innerHTML = "";
        ball.style.top = (innerHeight / 2) - ballHeight / 2 + "px";
        ball.style.left = (innerWidth / 2) - ballHeight / 2 + "px";
        playerOneBar.style.top = (innerHeight / 2) - 63 + "px";
        playerTwoBar.style.top = (innerHeight / 2) - 63 + "px";
        playerOneLocation = [playerOneBar.offsetTop, playerOneBar.offsetTop + 125];
        playerTwoLocation = [playerTwoBar.offsetTop, playerTwoBar.offsetTop + 125];
        yVelocity = 0;
        xVelocity = 0;
        playerOneScore = 0;
        playerTwoScore = 0;
        gameNotStarted = true;
        countdownNum = 3;
        endingStage = 0;
        document.getElementById("gameStatus").style.display = "block";
        document.getElementById("gameStatus").innerHTML = "Enter to Play Again!";
        setTimeout(gameWaiting, 900);
    }
}

gameControls();