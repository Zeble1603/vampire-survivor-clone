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

function animate() {

    window.requestAnimationFrame(animate)
    background.draw()
    character.move()
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
    }
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
}

animate()
//generateVilain()

window.addEventListener('keydown', (e)=>{
    switch (e.key) {
        case "w":
            keys.up = true
            console.log("ok")
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