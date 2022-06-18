let enemies = [];
let gameLevel = 0;
let xOffset = 30;
let yOffset = 50;
let shields = [];
let shieldTop;
let cannon;
let cannonVisible =  true;
let gamePlay;
let enemyMovement = 
{
    rythm: 0,
    moveStep: 1,
    turn: false,
    way: 1
}
let cannonReady = true;
let bullets = [];


function initGame()
{
    shieldTop = parseInt($('.board').height() - 170);
    cannonVisible = true;
    cannon = {
        x:120,
        y: $('.board').height() - 68,
        img: document.getElementById("cannon")
    };
    createEnemies();
    createShields();
    
}

function startGame()
{
    initCanvases();
    initGame();
    drawCannon();
    drawEnemies();
    drawShields();
    gamePlay = setInterval(renderGame, 20);
}

function createShields() 
{
    let repartition = parseInt($('.board').width() / 13);
    position = repartition;
    for(let t=0; t < 4; t++)
    {
        let shieldWall = String(1).repeat(600).split('').map((e, i) => {
            return {
                value: 1,
                index: i,
                coords: {
                            line: parseInt(i / 40),
                            column: i % 40
                        }
            };
        });
        shieldWall[0].value = 0;
        shieldWall[1].value = 0;
        shieldWall[2].value = 0;
        shieldWall[3].value = 0;
        shieldWall[40].value = 0;
        shieldWall[41].value = 0;
        shieldWall[42].value = 0;
        shieldWall[80].value = 0;
        shieldWall[81].value = 0;
        shieldWall[120].value = 0;
        shieldWall[36].value = 0;
        shieldWall[37].value = 0;
        shieldWall[38].value = 0;
        shieldWall[39].value = 0;
        shieldWall[77].value = 0;
        shieldWall[78].value = 0;
        shieldWall[79].value = 0;
        shieldWall[118].value = 0;
        shieldWall[119].value = 0;
        shieldWall[159].value = 0;
        for (let t = 491; t < 509; t++) {
            shieldWall[t].value = 0;
            
        }
        for (let t = 531; t < 549; t++) {
            shieldWall[t].value = 0;
            
        }
        for (let t = 571; t < 589; t++) {
            shieldWall[t].value = 0;
        }
        shields.push({
            x: position,
            walls: shieldWall
        });
        position += repartition * 3;
    }

}

function createEnemies(){
    enemies = [];
    for(let line = 0; line < 5; line++){
        for (let column = 0; column < 11; column++) {
            enemies.push(
                {
                    x: xOffset + (column * 60),
                    y: yOffset + (line * 55) + (10 * gameLevel),
                    phase: 1,
                    score: line == 0 ? 30 : line < 3 ? 20 : 10,
                    line: (line == 0 ? 3: line < 3 ? 2 : 1),
                    realLine: line,
                    realColumn: column,
                    img: document.getElementById("imgEnemy" + (line == 0 ? 3 : line < 3 ? 2 : 1) + "-1")
                }
            );
            
        }
    }
}


function updateEnemies() {
    let speed = Math.max(4, enemies.length * 2);
    
    if(++enemyMovement.rythm % speed == 0)
    {
        enemyMovement.moveStep = enemyMovement.moveStep > 4 ? 1 : enemyMovement.moveStep;
        let xLeftLimit = Math.max(...enemies.map(e => e.x)) + 60;
        let xRightLimit = Math.min(...enemies.map(e => e.x)) - 60;
        let maxLeft = $('.board').width();
        if(enemyMovement.turn)
        {
            enemyMovement.turn = false;
        }
        else if (xLeftLimit > maxLeft)
        {
            enemyMovement.way = -1;
            enemiesGoDown();
            enemyMovement.turn = true;
        }
        else if (xRightLimit < 25)
        {
            enemyMovement.way = 1;
            enemiesGoDown();
            enemyMovement.turn =true;
        }
        enemies.forEach((e, i) => {
            e.x += enemyMovement.turn ? 0 : 25 * enemyMovement.way;
            e.phase = e.phase == 1 ? 2 : 1;
            e.img = document.querySelector("#imgEnemy" + e.line + "-" + e.phase);
            e.shoot = false;
        });

    }     

    enemiesContext.clearRect(0, 0, enemiesCanvas.width, enemiesCanvas.height);
    drawEnemies();  

    if (enemies.length == 0) {
        gameLevel++;
    }        
    

}

function enemiesGoDown()
{
    enemies.forEach(e => { e.y += 15; });
}

function cannonShoot()
{
    console.log("boom");
    if (cannonReady){
        cannonReady = false;
        bullets.push({
            type: 1,
            x: cannon.x + 30 ,
            y: cannon.y
        });
    }
}

function updateBullets() 
{
   
    bullets.forEach(
        
        (e, i) => { 
                    e.y += e.type == 1 ? -10 : 10;

                       if (e.type == 1)
                        {
                            if(!checkCannonBullet(e, i))
                            {
                                return;
                            }
                        }

                  }

    );

}

function checkCannonBullet(bullet, bulletIndex) {
    let shield = shields.filter(f=>bullet.x>f.x && bullet.x < f.x +160)[0];

    if (bullet.y < 0) 
    {
        cannonReady = true;
        bullets.splice(bulletIndex, 1);
        drawBulletExplosion(bullet);
        return false;
    }
    
    if (shield)
    {
        let column = parseInt((bullet.x - shield.x) / 4);
        let collision = shield.walls.filter(f => f.coords.column == column && f.value == 1 && bullet.y < (f.coords.line * 4) + shieldTop).sort((a, b) => a.coords.line > b.coords.line ? -1 : 1)[0];
        if (collision) 
        {
            destroyShieldPart(shield, collision);
            drawShield(shield);
            cannonReady = true;
            bullets.splice(bulletIndex, 1);
            return false;
        }
       
    }
    let target = enemies.filter(f => bullet.x >= f.x && bullet.x < f.x + 48 && bullet.y >= f.y && bullet.y <= f.y + 12).sort((a,b) => a.y > b.y ? -1 : 1)[0];

    if(target)
        {
            if (bullet.y < target.y + 48)
            {
                cannonReady = true;
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemies.indexOf(target), 1);
                destroyEnemy(target);
            }
        }
     
        return true;
}

