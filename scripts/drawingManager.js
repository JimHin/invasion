let cannonCanvas, bulletsCanvas, enemiesCanvas, shieldsCanvas, spaceCanvas, cannonContext, bulletsContext, enemiesContext, shieldsContext, spaceContext;

function initCanvases(){
    spaceCanvas = document.getElementById("space");
    cannonCanvas = document.getElementById("cannon");
    bulletsCanvas = document.getElementById("bullets");
    enemiesCanvas = document.getElementById("enemies");
    shieldsCanvas = document.getElementById("shields");
    spaceContext = spaceCanvas.getContext("2d");
    cannonContext = cannonCanvas.getContext("2d");
    bulletsContext = bulletsCanvas.getContext("2d");
    enemiesContext = enemiesCanvas.getContext("2d");
    shieldsContext = enemiesCanvas.getContext("2d");
    spaceCanvas.width = $('.board').width();
    spaceCanvas.height = $('.board').height();
    cannonCanvas.width = $('.board').width();
    cannonCanvas.height = $('.board').height();
    bulletsCanvas.width = $('.board').width();
    bulletsCanvas.height = $('.board').height();
    enemiesCanvas.width = $('.board').width();
    enemiesCanvas.height = $('.board').height();
    shieldsCanvas.width = $('.board').width();
    shieldsCanvas.height = $('.board').height();
}

function drawCannon()
{
    cannonContext.clearRect(0, 0, cannonCanvas.width, cannonCanvas.height);
    if (cannonVisible) 
    {
        cannonContext.drawImage(imgCannon, cannon.x, cannon.y);
    }
}

function drawShields() 
{
    shields.forEach(e => drawShield(e));
}

function drawShield(shield) 
{
    shieldsContext.clearRect(shield.x, shieldTop, 160, 60);
    shieldsContext.fillStyle = 'red';
    shield.walls.forEach(
        (e, i) => {
            let line = parseInt(i/40);
            let column = i%40;
            if(e.value == 1)
            { 
                shieldsContext.fillRect(shield.x + (column * 4), shieldTop + (line * 4), 4, 4);
            
            }
        }
    );


}

function drawEnemies()
{
    enemiesContext.clearRect(0, 0, enemiesCanvas.width, enemiesCanvas.height);
    enemies.forEach(e => drawEnemy(e));
}

function drawEnemy(enemy)
{
    enemiesContext.drawImage(enemy.img, enemy.x, enemy.y);
}

function drawBullets(){
    bulletsContext.clearRect(0, 0, bulletsCanvas.width, bulletsCanvas.height);
    bullets.forEach(e => drawBullet(e));
}

function drawBullet(bullet){
    bulletsContext.fillStyle = bullet.type == 1 ? "rgb(200, 200, 0)" : "rgb(200, 100, 0)";
    bulletsContext.fillRect(bullet.x, bullet.y, 4, 12);
}

function drawBulletExplosion(bullet)
{
    enemiesContext.drawImage(explosion1, bullet.x - 16, 0);
    setTimeout(e => enemiesContext.clearRect(bullet.x - 16, 0, 32, 32), 1000);
}

function destroyShieldPart(shield, collision)
{
    let sLine = collision.coords.line;
    let mLine = Math.max(collision.coords.line - 4, 0);
    let sColumn = Math.max(collision.coords.column - 3, 0);
    let mColumn = Math.min(collision.coords.column + 3, 39);
    for (let line = sLine; line >= mLine; line--)
    {
        for(let column = sColumn; column <= mColumn; column++)
        {
            let wallPart = shield.walls.find(e => e.coords.line == line && e.coords.column == column);
            if (wallPart)
            {
                wallPart.value = 0;
            }
        }
    }
}

function destroyEnemy(enemy)
{
    enemiesContext.clearRect(enemy.x, enemy.y, 48, 48);
    enemiesContext.drawImage(explosion3, enemy.x, enemy.y);
    setTimeout(e => enemiesContext.clearRect(enemy.x, enemy.y, 48, 48), 100);

}


function renderGame()
{
    updateEnemies();
    drawShields();
    drawBullets();
    updateBullets();
}