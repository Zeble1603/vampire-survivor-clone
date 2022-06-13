const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576

const enemies = []

const bgImage = new Image()
bgImage.src = '/src/img/bg_forest.png'

const charaImage = new Image()
charaImage.src = '/src/img/chara/hero_right.png'

const charaImageLeft = new Image()
charaImageLeft.src = '/src/img/chara/hero_left.png'

const vilainImage = new Image()
vilainImage.src = '/src/img/vilains/big_demon_idle_anim_f0.png'


const background = new Sprite(
    7000,6860,bgImage,{x:-2560,y:-2026}
)

const character = new Player(
    32,56,charaImage,
    {right:charaImage,
    left:charaImageLeft}
)

const swordAttach = new sword(
    142,28,charaImage,{charaImage},
)

const keys = {
    up : false,
    right : false,
    down : false,
    left : false, 
}

function generateVilain() {
    const intervalId = setInterval(() => {
        let enemy = new Enemy(32,36,vilainImage,{x:0, y:0})
        let scenario = Math.floor(Math.random() * 4);
        let randomPositionX = Math.floor(Math.random() * canvas.width);
        let randomPositionY = Math.floor(Math.random() * canvas.height);
        switch (scenario) {
            case 2:
                enemy.position = {x:canvas.width, y:randomPositionY}
                enemies.push(enemy)    
                break;
            case 3:
                enemy.position = {x:randomPositionX, y:canvas.height}
                enemies.push(enemy) 
                break;   
            case 4:
                enemy.position = {x:0, y:randomPositionY}
                enemies.push(enemy)  
                break;  
            default:
                enemy.position = {x:randomPositionX, y:0}
                enemies.push(enemy)      
                break;
        }
    }, 1500);
}

function checkCollisionOnPlayer(enemy,player){
    //TODO: refactoriser ce charabiat 
    if(enemy.position.x >= player.position.x &&
        enemy.position.x <= player.position.x + player.width){
        if(enemy.position.y + enemy.height >= player.position.y
            && enemy.position.y <= player.position.y){
            console.log('PLAYER TOUCHED')        
        }else if(enemy.position.y <= player.position.y + player.height
            && enemy.position.y >= player.position.y){
            console.log('PLAYER TOUCHED')  
            }
    }
}

function checkAttackOnEnemy(enemy,attack){
    //TODO: refactoriser ce charabiat 
    if(enemy.position.x >= attack.position.x &&
        enemy.position.x <= attack.position.x + attack.width){
        if(enemy.position.y + enemy.height >= attack.position.y
            && enemy.position.y <= attack.position.y){
            console.log('ATTACK HITS')
        }else if(enemy.position.y <= attack.position.y + attack.height
            && enemy.position.y >= attack.position.y){
            console.log('ATTACK HITS')  
            }
    }
}



function animate() {

    let currentFrame = window.requestAnimationFrame(animate)
    background.draw()
    //Character
    character.move()
    character.moving = false
    if(keys.up){
        background.position.y += 2
        character.moving = true
    }
    if(keys.right){
        background.position.x -= 2
        character.moving = true
        character.direction = 'right'
    }   
    if(keys.down){
        background.position.y -= 2
        character.moving = true
    }
    if(keys.left){
        background.position.x += 2
        character.moving = true
        character.direction = 'left'
    }  
    //Attacks
    if(currentFrame % swordAttach.frame === 0){
        swordAttach.animation = true
        swordAttach.animationStart = currentFrame
    }
    if (currentFrame === swordAttach.animationStart + 10){
        swordAttach.animation = false
    }
    if(swordAttach.animation){
        swordAttach.attack()
        for(enemy of enemies){
            checkAttackOnEnemy(enemy,swordAttach)

        }
        
    }
    //Enemies
    for (let enemy of enemies){
        enemy.draw()
        enemy.move()
        if(keys.up){
            enemy.position.y += 2
        }
        if(keys.right){
            enemy.position.x -= 2
        }
        if(keys.down){
            enemy.position.y -= 2
        }
        if(keys.left){
            enemy.position.x += 2
        }
        checkCollisionOnPlayer(enemy,character)

    }
}
animate()

generateVilain()

window.addEventListener('keydown', (e)=>{
    switch (e.key) {
        case "w":
            keys.up = true
            break;
        case "a":
            keys.left = true
            break;   
        case "d":
            keys.right = true
            break;   
        case "s":
            keys.down = true
            break;     
    }
})
window.addEventListener('keyup', (e)=>{
    switch (e.key) {
        case "w":
            keys.up = false
            break;
        case "a":
            keys.left = false
            break;   
        case "d":
            keys.right = false
            break;   
        case "s":
            keys.down = false
            break;     
    }
})