const canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')
canvas.width = 1380
canvas.height = 630
ctx.font = '32px Gothic';
ctx.fillStyle = "white";
ctx.textAlign = "center";


const bgImage = new Image()
bgImage.src = './src/img/bg_forest.png'

const charaImage = new Image()
charaImage.src = './src/img/chara/hero_right.png'

const charaImageLeft = new Image()
charaImageLeft.src = './src/img/chara/hero_left.png'

const charaImageRed = new Image()
charaImageRed.src = './src/img/chara/red_hero_right.png'

const charaImageLeftRed = new Image()
charaImageLeftRed.src = './src/img/chara/red_hero_left.png'

const vilainImage = new Image()
vilainImage.src = './src/img/vilains/big_demon_idle_anim_f0.png'


//Items images
const hpImage = new Image()
hpImage.src = './src/img/items/hpIcon.png'

const xpImage = new Image()
xpImage.src = './src/img/items/xpPointYellow.png'

const damagesBuffImage = new Image()
damagesBuffImage.src = './src/img/items/buff1.png'

const rangeBuffImage = new Image()
rangeBuffImage.src = './src/img/items/buff2.png'

const coolDownBuffImage = new Image()
coolDownBuffImage.src = './src/img/items/buff3.png'

const armorBuffImage = new Image()
armorBuffImage.src = './src/img/items/buff4.png'

const speedBuffImage = new Image()
speedBuffImage.src = './src/img/items/buff5.png'

//Objects
const background = new Sprite(
    7000,6860,bgImage,{x:-2560,y:-2026}
)

const character = new Player(
    32,56,charaImage,
    {right:charaImage,
    left:charaImageLeft,
    touchedLeft: charaImageLeftRed,
    touchedRight: charaImageRed}
)

const swordAttach = new Sword(
    152,38,charaImage,{charaImage},5)

character.weapons.push(swordAttach)

const damageBuff = new DamagesBuff('Lyre',damagesBuffImage)    

const rangeBuff = new RangeBuff('Violin',rangeBuffImage)

const cooldownBuff = new CoolDownBuff('Ocarina',coolDownBuffImage)

const armorBuff = new ArmorBuff('Flute',armorBuffImage)

const speedBuff = new SpeedBuff('Horn',speedBuffImage)

//Lists, objects
let enemies = {}
let loots = {}
let game = {
    active : false,
    over : false,
}
const keys = {
    up : false,
    right : false,
    down : false,
    left : false, 
}
const skills = [damageBuff,rangeBuff,cooldownBuff,armorBuff,speedBuff]

//Functions
function toggleScreen(id,toggle){
    let element = document.getElementById(id)
    let display = (toggle) ? 'flex' : 'none'
    element.style.display = display
}

function startGame(){
    toggleScreen('start',false)
    toggleScreen('canvas',true)
    ctx = canvas.getContext('2d')
    game.active = true
    animate()
    generateVilain()
}

function endGame(){
    let bodyElem = document.querySelector('body')
    bodyElem.style.backgroundColor = 'red'
    enemies = {}
    loots = {}
    ctx = null
    game.active = false
    background.position = {x:-2560,y:-2026}
    toggleScreen('game-over',true)
    toggleScreen('canvas',false)
}

function reStart(){
    let bodyElem = document.querySelector('body')
    bodyElem.style.backgroundColor = 'white'
    ctx = canvas.getContext('2d')
    toggleScreen('game-over',false)
    toggleScreen('canvas',true)
    character.reset()
    game.active = true
    animate()
    generateVilain()
}

function generateVilain() {
    let counter = 1

    let intervalVilainId = setInterval(() => {
        console.log(`TEST GENERATE VILAIN GAME IS ACTIVE ??? ${game.active}`)
        let scenario = Math.floor(Math.random() * 4);
        let randomPositionX = Math.floor(Math.random() * canvas.width);
        let randomPositionY = Math.floor(Math.random() * canvas.height);
        switch (scenario) {
            case 2:
                enemies[`red${counter}`] = new Enemy(32,36,vilainImage,{x:canvas.width, y:randomPositionY},10,1)   
                break;
            case 3:
                enemies[`red${counter}`] = new Enemy(32,36,vilainImage,{x:randomPositionX, y:canvas.height},10,1)
                break;   
            case 4:
                enemies[`red${counter}`] = new Enemy(32,36,vilainImage,{x:0, y:randomPositionY},10,1) 
                break;  
            default:
                enemies[`red${counter}`] = new Enemy(32,36,vilainImage,{x:randomPositionX, y:0},10,1)       
                break;
        }
        counter ++
        if(!game.active){
            clearInterval(intervalVilainId)
        }
    }, 1500);
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
                player.touched = true
                player.stats.pv -= enemy.strenght
                if (player.stats.pv <= 0){
                    endGame()  
                } 
        }else if(enemy.position.y <= player.position.y + player.height
            && enemy.position.y >= player.position.y){
                player.touched = true
                player.stats.pv -= enemy.strenght
                if (player.stats.pv <= 0){
                    endGame()  
                } 
            }
    }else{
        player.touched = false
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
                if(items[item].type === 'heal'){
                    items[item].heal(player)
                    delete items[item]
                }else{
                    items[item].pex(player)
                    delete items[item]
                }
        }else if(player.position.y <= items[item].position.y + items[item].height
            && player.position.y >= items[item].position.y){
                if(items[item].type === 'heal'){
                    items[item].heal(player)
                }else{
                    items[item].pex(player)
                } 
            }
        }
    }
}

function lvlUp() {
    let choiceList = []
    character.stats.pv += character.stats.pvMax * 25/100
    if(character.stats.pv > character.stats.pvMax){
        character.stats.pv = character.stats.pvMax
    }
    if(character.skills.length <= 3){
        let randomIndex1 = Math.floor(Math.random()*skills.length)
        let randomIndex2 = Math.floor(Math.random()*skills.length)
        choiceList.push(skills[randomIndex1],skills[randomIndex2])
    }else{
        let randomIndex1 = Math.floor(Math.random()*character.skills.length)
        let randomIndex2 = Math.floor(Math.random()*character.skills.length)
        choiceList.push(character.skills[randomIndex1],character.skills[randomIndex2])
    }
    
    /*Définir la fonction drawLvlUpScreen qui nous permet de générer l'écran de sélection
    La fonction renvoie le choix du joueur --> un skill, qui possède donc une methode 
    applyBuff(player) que l'on invoquera plus bas pour appliquer les effets du buff
    */
    let result = drawLvlUpScreen(choiceList)
    result.applyBuff(character)


}

function drawLvlUpScreen(skillsOptions){

}

function drawStats(){
    ctx.fillText(`${character.stats.pv} / ${character.stats.pvMax}`, 1200, 50);
    ctx.fillText(`${character.stats.xp} / ${character.stats.xpMax}`, 1200, 100);
    ctx.fillText(`Lv : ${character.stats.lvl}`, 1200, 150);

}

function animate() {
    if(!game.active) return
    
    let currentFrame = window.requestAnimationFrame(animate)
    background.draw()
    drawStats()

    //Character
    character.move()
    character.moving = false
    if(keys.up){
        background.position.y += (2 * character.speed)
        character.moving = true
    }
    if(keys.right){
        background.position.x -= (2 * character.speed)
        character.moving = true
        character.direction = 'right'
    }   
    if(keys.down){
        background.position.y -= (2 * character.speed)
        character.moving = true
    }
    if(keys.left){
        background.position.x += (2 * character.speed)
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
            enemies[enemy].position.y += (2 * character.speed)
        }
        if(keys.right){
            enemies[enemy].position.x -= (2 * character.speed)
        }
        if(keys.down){
            enemies[enemy].position.y -= (2 * character.speed)
        }
        if(keys.left){
            enemies[enemy].position.x += (2 * character.speed)
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