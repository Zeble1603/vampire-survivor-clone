const canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')
canvas.width = 1380
canvas.height = 630
ctx.font = '32px Gothic';
ctx.fillStyle = "white";
ctx.textAlign = "center";

const selectorImage = new Image()
selectorImage.src = './src/img/items/selector.png'

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


const attackRightImage = new Image()
attackRightImage.src = './src/img/attack/right/attackRight.png'

const attackLeftImage = new Image()
attackLeftImage.src = './src/img/attack/left/attackLeft.png'

//Vilains images
const vilainImage = new Image()
vilainImage.src = './src/img/vilains/miniOrc.png'

const miniRedImage = new Image()
miniRedImage.src = './src/img/vilains/miniRed.png'

const orcImage = new Image()
orcImage.src = './src/img/vilains/orc.png'

const frankImage = new Image()
frankImage.src = './src/img/vilains/frank.png'

const redImage = new Image()
redImage.src = './src/img/vilains/red.png'


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

const healthBuffImage = new Image()
healthBuffImage.src = './src/img/items/heart.png'

//Objects
const background = new Sprite(
    7000,6860,bgImage,{x:-2560,y:-2026}
)

const selector = new Sprite(42,35,selectorImage,{
    x:canvas.width/2 - 200,
    y:canvas.height/2 - 90,
})

const character = new Player(
    32,56,charaImage,
    {right:charaImage,
    left:charaImageLeft,
    touchedLeft: charaImageLeftRed,
    touchedRight: charaImageRed}
)

attackRightImage
attackLeftImage
const swordAttach = new Sword(
    70,54,attackRightImage,
    {right:attackRightImage,
        left:attackLeftImage
    },5)

character.weapons.push(swordAttach)

const damageBuff = new DamagesBuff('Lyre',damagesBuffImage)    

const rangeBuff = new RangeBuff('Violin',rangeBuffImage)

const cooldownBuff = new CoolDownBuff('Ocarina',coolDownBuffImage)

const armorBuff = new ArmorBuff('Flute',armorBuffImage)

const speedBuff = new SpeedBuff('Horn',speedBuffImage)

const healthBuff = new HealthBuff('Heart', healthBuffImage)

//Lists, variables
let seconds = 0
let minutes = 0
let secondsToWrite
let minutesToWrite
let intervalTimer

let skillSelection = ""
let choiceList = []
const skills = [healthBuff,damageBuff,rangeBuff,cooldownBuff,armorBuff,speedBuff]

let enemies = {}
let loots = {}
let game = {
    active : false,
    over : false,
    lvlUpScreen : false,
    victory:false,
}

const keys = {
    up : false,
    right : false,
    down : false,
    left : false, 
}

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
    game.over = false
    game.lvlUpScreen = false
    addToChrono()
    animate()
    generateVilain()
}

function endGame(){
    let bodyElem = document.querySelector('body')
    if(game.victory){
        bodyElem.style.backgroundColor = '#48C2F9'
        toggleScreen('victory',true)
    }else{
        bodyElem.style.backgroundColor = 'red'
        toggleScreen('game-over',true)
    }
    enemies = {}
    loots = {}
    ctx = null
    game.active = false
    background.position = {x:-2560,y:-2026}
    toggleScreen('canvas',false)
}

function reStart(){
    let bodyElem = document.querySelector('body')
    bodyElem.style.backgroundColor = 'white'
    ctx = canvas.getContext('2d')
    toggleScreen('victory',false)
    toggleScreen('game-over',false)
    toggleScreen('canvas',true)
    character.reset()
    game.victory = false
    game.active = true
    clearTimeout(intervalTimer)
    seconds = 0
    minutes = 0
    animate()
    addToChrono()
    generateVilain()
}

function tick(){
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
    }
    if(minutes === 5){
        game.victory = true
        endGame()
    }
}

function addToChrono() {
    tick();
    secondsToWrite = (seconds<10) ? `0${seconds}` : `${seconds}`
    minutesToWrite = (minutes<10) ? `0${minutes}` : `${minutes}`
    timer();
}

function timer() {
    intervalTimer = setTimeout(addToChrono, 1000);
}

function drawTimer(){
    ctx.font = '32px Gothic';
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(`${minutesToWrite}:${secondsToWrite}`, 1200, 200);
}

function generateVilain() {
    let counter = 1

    let intervalVilainId = setInterval(() => {
        let scenario = Math.floor(Math.random() * 5);
        let randomPositionX = Math.floor(Math.random() * canvas.width);
        let randomPositionY = Math.floor(Math.random() * canvas.height);
        switch (scenario) {
            case 2:
                if(minutes<1){
                    enemies[`red${counter}`] = new Enemy(32,56,vilainImage,{x:canvas.width, y:randomPositionY},10,1)   
                }
                if(minutes>=1){
                    randomPositionY = Math.floor(Math.random() * canvas.height);
                    enemies[`miniRed${counter}`] = new Enemy(32,56,miniRedImage,{x:canvas.width, y:randomPositionY},15,2)
                    if(minutes>=2){
                        randomPositionY = Math.floor(Math.random() * canvas.height);
                        enemies[`orc${counter}`] = new Enemy(39,67,orcImage,{x:canvas.width, y:randomPositionY},20,3)
                        if(minutes>=3){
                            randomPositionY = Math.floor(Math.random() * canvas.height);
                            enemies[`frank${counter}`] = new Enemy(39,67,frankImage,{x:canvas.width, y:randomPositionY},25,3)
                            if(minutes>=4){
                                randomPositionY = Math.floor(Math.random() * canvas.height);
                                enemies[`red${counter}`] = new Enemy(48,84,redImage,{x:canvas.width, y:randomPositionY},30,4)
                            }
                        }
                    }
                }
                break;
            case 3:
                if(minutes<1){
                    enemies[`red${counter}`] = new Enemy(32,56,vilainImage,{x:randomPositionX, y:canvas.height},10,1)
                }
                if(minutes>=1){
                    randomPositionX = Math.floor(Math.random() * canvas.width);
                    enemies[`miniRed${counter}`] = new Enemy(32,56,miniRedImage,{x:randomPositionX, y:canvas.height},15,2)
                    if(minutes>=2){
                        randomPositionX = Math.floor(Math.random() * canvas.width);
                        enemies[`orc${counter}`] = new Enemy(39,67,orcImage,{x:randomPositionX, y:canvas.height},20,3)
                        if(minutes>=3){
                            randomPositionX = Math.floor(Math.random() * canvas.width);
                            enemies[`frank${counter}`] = new Enemy(39,67,frankImage,{x:randomPositionX, y:canvas.height},25,3)
                            if(minutes>=4){
                                randomPositionX = Math.floor(Math.random() * canvas.width);
                                enemies[`red${counter}`] = new Enemy(48,84,redImage,{x:randomPositionX, y:canvas.height},30,4)
                            }
                        }
                    }
                }
                break;   
            case 4:
                if(minutes<1){
                    enemies[`red${counter}`] = new Enemy(32,56,vilainImage,{x:0, y:randomPositionY},10,1) 
                }
                if(minutes>=1){
                    randomPositionY = Math.floor(Math.random() * canvas.height);
                    enemies[`miniRed${counter}`] = new Enemy(32,56,miniRedImage,{x:0, y:randomPositionY},15,2)
                    if(minutes>=2){
                        randomPositionY = Math.floor(Math.random() * canvas.height);
                        enemies[`orc${counter}`] = new Enemy(39,67,orcImage,{x:0, y:randomPositionY},20,3)
                        if(minutes>=3){
                            randomPositionY = Math.floor(Math.random() * canvas.height);
                            enemies[`frank${counter}`] = new Enemy(39,67,frankImage,{x:0, y:randomPositionY},25,3)
                            if(minutes>=4){
                                randomPositionY = Math.floor(Math.random() * canvas.height);
                                enemies[`red${counter}`] = new Enemy(48,84,redImage,{x:0, y:randomPositionY},30,4)
                            }
                        }
                    }
                }
                break;  
            default:
                if(minutes<1){
                    enemies[`red${counter}`] = new Enemy(32,56,vilainImage,{x:randomPositionX, y:0},10,1)    
                }
                if(minutes>=1){
                    randomPositionX = Math.floor(Math.random() * canvas.width);
                    enemies[`miniRed${counter}`] = new Enemy(32,56,miniRedImage,{x:randomPositionX, y:0},15,2)
                    if(minutes>2){
                        randomPositionX = Math.floor(Math.random() * canvas.width);
                        enemies[`orc${counter}`] = new Enemy(39,67,orcImage,{x:randomPositionX, y:0},20,3)
                        if(minutes>=3){
                            randomPositionX = Math.floor(Math.random() * canvas.width);
                            enemies[`frank${counter}`] = new Enemy(39,67,frankImage,{x:randomPositionX, y:0},25,3)
                            if(minutes>=4){
                                randomPositionX = Math.floor(Math.random() * canvas.width);
                                enemies[`red${counter}`] = new Enemy(48,84,redImage,{x:randomPositionX, y:0},30,4)
                            }
                        }
                    }
                }   
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
                player.stats.pv -= enemy.strenght - (enemy.strenght * player.stats.armor / 100)
                if (player.stats.pv <= 0){
                    endGame()  
                } 
        }else if(enemy.position.y <= player.position.y + player.height
            && enemy.position.y >= player.position.y){
                player.touched = true
                player.stats.pv -= enemy.strenght - (enemy.strenght * player.stats.armor / 100)
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
    if(attack.animation){
        for (enemy in enemies){
            if(enemies[enemy].position.x >= attack.position.x &&
                enemies[enemy].position.x <= attack.position.x + attack.width){
                if(enemies[enemy].position.y + enemies[enemy].height >= attack.position.y
                    && enemies[enemy].position.y <= attack.position.y){    
                    enemies[enemy].pv -= attack.damage
                    if (enemies[enemy].pv <= 0 ){
                        generateItems(enemies[enemy])
                        delete enemies[enemy]
                    }else{
                        enemies[enemy].getPushed(character.direction,'up')
                    }
                }else if(enemies[enemy].position.y <= attack.position.y + attack.height
                    && enemies[enemy].position.y >= attack.position.y){
                        enemies[enemy].pv -= attack.damage
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
                    let isLvlUp = items[item].pex(player)
                    if(isLvlUp){
                        skillSelection = ""
                        lvlUp()
                    }
                    delete items[item]
                }
        }else if(player.position.y <= items[item].position.y + items[item].height
            && player.position.y >= items[item].position.y){
                if(items[item].type === 'heal'){
                    items[item].heal(player)
                    delete items[item]
                }else{
                    let isLvlUp = items[item].pex(player)
                    if(isLvlUp){
                        skillSelection = ""
                        lvlUp()
                    }
                    delete items[item]
                } 
            }
        }
    }
}

function lvlUp() {
    if(skillSelection){
        game.lvlUpScreen = false
        game.active = true
        skillSelection.applyBuff(character)
        choiceList = []
        skillSelection = ""
        addToChrono()
        generateVilain()
        animate()
    }else{
        clearInterval(intervalTimer)
        character.stats.pv += character.stats.pvMax * 25/100
        if(character.stats.pv > character.stats.pvMax){
            character.stats.pv = character.stats.pvMax
        }
        if(character.skills.length <= 3){
            let randomIndex1 = Math.floor(Math.random()*skills.length)
            let randomIndex2 = Math.floor(Math.random()*skills.length)
            if (randomIndex1 === randomIndex2){
                randomIndex2 = (randomIndex2 === skills.length -1) ? randomIndex2-1 : randomIndex2+1
            }
            choiceList.push(skills[randomIndex1],skills[randomIndex2])
        }else{
            let randomIndex1 = Math.floor(Math.random()*character.skills.length)
            let randomIndex2 = Math.floor(Math.random()*character.skills.length)
            if (randomIndex1 === randomIndex2){
                randomIndex2 = (randomIndex2 === character.skills.length -1) ? randomIndex2-1 : randomIndex2+1
            }
            choiceList.push(character.skills[randomIndex1],character.skills[randomIndex2])
        }
        game.active = false
        game.lvlUpScreen = true
        drawLvlUpScreen()
    }
    
    //result.applyBuff(character)
}

function drawLvlUpScreen(){
    if(!game.lvlUpScreen) return
    window.requestAnimationFrame(drawLvlUpScreen)
    const firstOption = choiceList[0]
    const secondOption = choiceList[1]
    ctx.fillStyle = "#48C2F9";
    ctx.fillRect((canvas.width/2 - 200), (canvas.height/2 - 225), 400, 450);
    ctx.beginPath();
    ctx.lineWidth = "3";
    ctx.strokeStyle = "#FFCE00";
    ctx.rect((canvas.width/2 - 200), (canvas.height/2 - 225), 400, 450);
    ctx.stroke();

    ctx.font = '32px Gothic';
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(`Level up !!`, canvas.width/2, (canvas.height/2 - 190));

    ctx.beginPath();
    ctx.lineWidth = "3";
    ctx.strokeStyle = "#FFCE00";
    ctx.rect((canvas.width/2 - 175), (canvas.height/2 - 155), 350, 150);
    ctx.stroke();
    ctx.rect((canvas.width/2 - 175), (canvas.height/2 + 5 ), 350, 150);
    ctx.stroke();

    selector.draw()
    
    //First skill of the list
    ctx.drawImage(firstOption.image,
        (canvas.width/2 - 162),
        (canvas.height/2 - 142),
        32,35)
    ctx.font = '20px Gothic';
    ctx.fillStyle = "#FFCE00";
    ctx.textAlign = "start";
    ctx.fillText(`${firstOption.name}`, (canvas.width/2 - 120), (canvas.height/2 - 116));    
    ctx.font = '18px Gothic';
    ctx.fillStyle = "white";
    ctx.textAlign = "start";
    ctx.fillText(`${firstOption.description}`, (canvas.width/2 - 162), (canvas.height/2 - 80)); 

    //Second skill of the list
    ctx.drawImage(secondOption.image,
        (canvas.width/2 - 162),
        (canvas.height/2 + 18),
        32,35)
    ctx.font = '20px Gothic';
    ctx.fillStyle = "#FFCE00";
    ctx.textAlign = "start";
    ctx.fillText(`${secondOption.name}`, (canvas.width/2 - 120), (canvas.height/2 + 44));     
    ctx.font = '18px Gothic';
    ctx.fillStyle = "white";
    ctx.textAlign = "start";
    ctx.fillText(`${secondOption.description}`, (canvas.width/2 - 162), (canvas.height/2 + 80)); 
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
    drawTimer()
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
    
    if (currentFrame === swordAttach.animationStart + 15){
        swordAttach.animation = false
    }

    swordAttach.attack()
    checkAttackOnEnemy(enemies,swordAttach)
    
    
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
            loots[item].position.y += (2 * character.speed)
        }
        if(keys.right){
            loots[item].position.x -= (2 * character.speed)
        }
        if(keys.down){
            loots[item].position.y -= (2 * character.speed)
        }
        if(keys.left){
            loots[item].position.x += (2 * character.speed)
        }
    }
    checkCollisionWithitems(loots,character)
}


window.addEventListener('keydown', (e)=>{
    switch (e.key) {
        case "w":
            keys.up = true
            if(game.lvlUpScreen){
                skillSelection = choiceList[0],
                selector.position.y = canvas.height/2 - 90
            } 
            break;
        case "a":
            keys.left = true
            break;   
        case "d":
            keys.right = true
            break;   
        case "s":
            keys.down = true
            
            if(game.lvlUpScreen){
                skillSelection = choiceList[1],
                selector.position.y = canvas.height/2 + 70
            } 
            break;   
        case 'p':
            game.active = false     
            break
        case "Enter":
            if(game.lvlUpScreen){
                lvlUp()
            }      
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
        case 'p':
            game.active = true   
            generateVilain()  
            animate()
            break     
                 
    }
})