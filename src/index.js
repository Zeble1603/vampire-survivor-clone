const canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')
canvas.width = 1380
canvas.height = 630
let enemies = {}
let loots = {}
const game = {
    active : false,
    over : false,
}

const bgImage = new Image()
bgImage.src = '/src/img/bg_forest.png'

const charaImage = new Image()
charaImage.src = '/src/img/chara/hero_right.png'

const charaImageLeft = new Image()
charaImageLeft.src = '/src/img/chara/hero_left.png'

const vilainImage = new Image()
vilainImage.src = '/src/img/vilains/big_demon_idle_anim_f0.png'

const hpImage = new Image()
hpImage.src = '/src/img/items/hpIcon.png'

const xpImage = new Image()
xpImage.src = '/src/img/items/xpPoint.png'

const background = new Sprite(
    7000,6860,bgImage,{x:-2560,y:-2026}
)

const character = new Player(
    32,56,charaImage,
    {right:charaImage,
    left:charaImageLeft}
)

const swordAttach = new sword(
    142,28,charaImage,{charaImage},5)

const keys = {
    up : false,
    right : false,
    down : false,
    left : false, 
}

function toggleScreen(id,toggle){
    let element = document.getElementById(id)
    let display = (toggle) ? 'flex' : 'none'
    element.style.display = display
}

function startGame(){
    toggleScreen('start',false)
    ctx = canvas.getContext('2d')
    game.active = true
    animate()
    generateVilain()
}

function endGame(){
    enemies = {}
    loots = {}
    game.active = false
    background.position = {x:-2560,y:-2026}
    character.reset()
    toggleScreen('game-over',true)
    toggleScreen('canvas',false)
    canvas.style.display = 'none'
}

function reStart(){
    toggleScreen('game-over',false)
    toggleScreen('canvas',true)
    ctx = canvas.getContext('2d')
    character.reset()
    game.active = true
    animate()
}

function generateVilain() {
    let counter = 1
    const intervalId = setInterval(() => {
        let scenario = Math.floor(Math.random() * 4);
        let randomPositionX = Math.floor(Math.random() * canvas.width);
        let randomPositionY = Math.floor(Math.random() * canvas.height);
        switch (scenario) {
            case 2:
                enemies[`red${counter}`] = new Enemy(32,36,vilainImage,{x:canvas.width, y:randomPositionY},5,1)   
                break;
            case 3:
                enemies[`red${counter}`] = new Enemy(32,36,vilainImage,{x:randomPositionX, y:canvas.height},5,1)
                break;   
            case 4:
                enemies[`red${counter}`] = new Enemy(32,36,vilainImage,{x:0, y:randomPositionY},5,1) 
                break;  
            default:
                enemies[`red${counter}`] = new Enemy(32,36,vilainImage,{x:randomPositionX, y:0},5,1)       
                break;
        }
        counter ++
    }, 1500);
    if(!game.active){
        clearInterval(intervalId)
    }
}

function generateItems(deadBody){
    let idGenerator = Math.floor(Math.random() * 1000);
    let scenario = Math.floor(Math.random() * 11);
    switch (scenario){
        case 1:
        loots[`hp${idGenerator}`] = new Item(32,32,hpImage,
            {x:deadBody.position.x,
                y:deadBody.position.y},'heal')
        break  

        default:
        loots[`xp${idGenerator}`] = new Item(32,32,xpImage,
                {x:deadBody.position.x,
                    y:deadBody.position.y})

    }
}

function checkCollisionOnPlayer(enemy,player){
    //TODO: refactoriser ce charabiat 
    if(enemy.position.x >= player.position.x &&
        enemy.position.x <= player.position.x + player.width){
        if(enemy.position.y + enemy.height >= player.position.y
            && enemy.position.y <= player.position.y){
                player.stats.pv -= enemy.strenght
                if (player.stats.pv <= 0){
                    endGame()  
                } 
        }else if(enemy.position.y <= player.position.y + player.height
            && enemy.position.y >= player.position.y){
                player.stats.pv -= enemy.strenght
                if (player.stats.pv <= 0){
                    endGame()  
                } 
            }
    }
}

function checkAttackOnEnemy(enemies,attack){
    //TODO: refactoriser ce charabiat 
    for (enemy in enemies){
        if(enemies[enemy].position.x >= attack.position.x &&
            enemies[enemy].position.x <= attack.position.x + attack.width){
            if(enemies[enemy].position.y + enemies[enemy].height >= attack.position.y
                && enemies[enemy].position.y <= attack.position.y){    
                enemies[enemy].pv -= attack.damage
                console.log(enemies[enemy].pv)
                if (enemies[enemy].pv <= 0 ){
                    generateItems(enemies[enemy])
                    delete enemies[enemy]
                }else{
                    enemies[enemy].getPushed(character.direction,'up')
                }
            }else if(enemies[enemy].position.y <= attack.position.y + attack.height
                && enemies[enemy].position.y >= attack.position.y){
                    enemies[enemy].pv -= attack.damage
                    console.log(enemies[enemy].pv)
                    if (enemies[enemy].pv <= 0 ){
                    generateItems(enemies[enemy])
                    delete enemies[enemy]
                }else{
                    enemies[enemy].getPushed(character.direction,'down')
                }
            }
        }
    }
}

function checkCollisionWithitems(items,player){
    //TODO: refactoriser ce charabiat 
    for (let item in items){
        if(player.position.x >= items[item].position.x &&
        player.position.x <= items[item].position.x + items[item].width){
            if(player.position.y + player.height >= items[item].position.y
            && player.position.y <= items[item].position.y){
                console.log('item touched 1')
                if(items[item].type === 'heal'){
                    items[item].heal(player)
                    delete items[item]
                }else{
                    items[item].pex(player)
                    delete items[item]
                }
        }else if(player.position.y <= items[item].position.y + items[item].height
            && player.position.y >= items[item].position.y){
                console.log('item touched 2')
                if(items[item].type === 'heal'){
                    items[item].heal(player)
                }else{
                    items[item].pex(player)
                } 
            }
        }
    }
        
        /*if(items[item].position.x >= player.position.x &&
            items[item].position.x <= player.position.x + player.width){
            if(items[item].position.y + items[item].height >= player.position.y
                && items[item].position.y <= player.position.y){
                    console.log('item touched 1')
                if(items[item].type === 'heal'){
                    items[item].heal(player)
                    delete items[item]
                }else{
                    items[item].pex(player)
                    delete items[item]
                }
                }
            }else if(items[item].position.y <= player.position.y + player.height
                && items[item].position.y >= player.position.y){
                    console.log('item touched 2')
                if(items[item].type === 'heal'){
                    items[item].heal(player)
                }else{
                    items[item].pex(player)
                }
            }
        }*/
}

function animate() {
    if(!game.active) return

    let currentFrame = window.requestAnimationFrame(animate)
    console.log(currentFrame)
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
        checkAttackOnEnemy(enemies,swordAttach)
    }
    
    //Enemies
    for (const enemy in enemies){
        if(!game.active){break}
        enemies[enemy].draw()
        enemies[enemy].move()
        if(keys.up){
            enemies[enemy].position.y += 2
        }
        if(keys.right){
            enemies[enemy].position.x -= 2
        }
        if(keys.down){
            enemies[enemy].position.y -= 2
        }
        if(keys.left){
            enemies[enemy].position.x += 2
        }
        checkCollisionOnPlayer(enemies[enemy],character)
    }


    //Items
    for (const item in loots){
        loots[item].draw()
        if(keys.up){
            loots[item].position.y += 2
        }
        if(keys.right){
            loots[item].position.x -= 2
        }
        if(keys.down){
            loots[item].position.y -= 2
        }
        if(keys.left){
            loots[item].position.x += 2
        }
    }
    checkCollisionWithitems(loots,character)
}

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