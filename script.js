const yourShip = document.querySelector(".player-shooter");
const playArea = document.querySelector("#main-play-area");
const enemyImg = [
    "img/enemy-1.png", 
    "img/enemy-2.png", 
    "img/enemy-3.png", 
    "img/enemy-4.png"];
const instructionsText = document.querySelector(".game-instructions");
const startButton = document.querySelector(".start-button");
let enemyInterval;

// movimento e ataque do personagem
function flyShip(event) {
    if (event.key === "ArrowUp") {
        event.preventDefault();
        moveUp();
    } else if (event.key === "ArrowDown") {
        event.preventDefault();
        moveDown();
    } else if (event.key === " ") {
        event.preventDefault();
        fireLaser();
    }
}

// função de subir
function moveUp() {
    let topPosition = getComputedStyle(yourShip).getPropertyValue("top");
    if (topPosition === "0px") {
        return;
    }else {
        let position = parseInt(topPosition);
        position -= 50;
        yourShip.style.top = `${position}px`; 
    }
}

// função para descer
function moveDown() {
    let topPosition = getComputedStyle(yourShip).getPropertyValue("top");
    if (topPosition === "550px") {
        return;
    }else {
        let position = parseInt(topPosition);
        position += 50;
        yourShip.style.top = `${position}px`; 
    } 
}

// função para tiro do laser
function fireLaser() {
    let laser = createLaserElement();
    playArea.appendChild(laser);
    moveLaser(laser);
}

function createLaserElement() {
    let xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue("left"));
    let yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue("top"));
    let newLaser = document.createElement("img");
    newLaser.src = "img/shoot.png";
    newLaser.classList.add("laser");
    newLaser.style.left = `${xPosition}px`;
    newLaser.style.top = `${yPosition - 10}px`;
    return newLaser;
}

function moveLaser(laser) {
    let laserInterval = setInterval(() => {
        let xPosition = parseInt(laser.style.left);
        let enemies = document.querySelectorAll(".enemy");

        enemies.forEach((enemy) => { // checa se todos os inimigos foram atingidos, se sim, troca o src da imagem
            if(checkLaserCollision(laser, enemy)) {
                enemy.src = "img/explosion.png";
                enemy.classList.remove("enemy");       
                enemy.classList.add("dead-enemy");       
            }
        })

        if (xPosition === 340) {
            laser.remove();
        } else {
            laser.style.left = `${xPosition + 8}px`;
        }
    }, 10);
}

// função para criar inimigos aleatorios
function createEnemy() {
    let newEnemy = document.createElement("img");
    let enemySprite = enemyImg[Math.floor(Math.random() * enemyImg.length)]; // sorteio do tipo de inimigo
    newEnemy.src = enemySprite;
    newEnemy.classList.add("enemy");
    newEnemy.classList.add("enemy-transition");
    newEnemy.style.left = "600px";
    newEnemy.style.top = `${Math.floor(Math.random() * 330) + 30}px`;
    playArea.appendChild(newEnemy);
    moveEnemy(newEnemy);
}

function moveEnemy(enemy) {
    let moveEnemyInterval = setInterval(() => {
        let xPosition = parseInt(window.getComputedStyle(enemy).getPropertyValue("left"));
        if (xPosition <= 50) {
            if (Array.from(enemy.classList).includes("dead-enemy")) {
                enemy.remove();
            } else {
                gameOver();
            } 
        } else {
            enemy.style.left = `${xPosition - 4}px`;
        }
    }, 30)
}

// função para colisão
function checkLaserCollision(laser, enemy) {
    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let laserBottom = laserTop - 20;

    let enemyTop = parseInt(enemy.style.top);
    let enemyLeft = parseInt(enemy.style.left);
    let enemyBottom = enemyTop - 30;

    if (laserLeft != 340 &&  laserLeft + 40 >= enemyLeft) {
        if (laserTop <= enemyTop && laserTop >= enemyBottom) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

// inicio do jogo
startButton.addEventListener("click", (event) => {
    playGame();
})

function playGame() {
    startButton.style.display = "none";
    instructionsText.style.display = "none";
    window.addEventListener("keydown", flyShip);
    enemyInterval = setInterval(() => {
        createEnemy();
    }, 2000);
}

// função de game over
function gameOver() {
    window.removeEventListener("keydown", flyShip);
    clearInterval(enemyInterval);
    let enemies = document.querySelectorAll(".enemy");
    enemies.forEach((enemy) => enemy.remove());
    let lasers = document.querySelectorAll(".laser");
    lasers.forEach((laser) => laser.remove());
    setTimeout(() => {
        alert("game over!");
        yourShip.style.top ="250px";
        startButton.style.display = "block";
        instructionsText.style.display = "block";
    })
}