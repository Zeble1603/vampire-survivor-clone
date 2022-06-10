const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576
ctx.fillstyle = 'white'


const bgImage = new Image()
bgImage.src = '/src/img/bg_forest.png'

const charaImage = new Image()
charaImage.src = '/src/img/chara/knight_f_idle_anim_f1.png'

const background = new Sprite(
    7000,6860,bgImage,{x:-2560,y:-2026}
)

const chara = new Sprite(
    24,42,charaImage,{x:(canvas.width/2 - charaImage.width/2) ,y:(canvas.height/2-charaImage.height /2)}
)

const keys = {
    up : false,
    right : false,
    down : false,
    left : false, 
}

function animate() {
    window.requestAnimationFrame(animate)
    background.draw()
    chara.draw()

    if(keys.up){
        background.position.y += 2
    }
    if(keys.right){
        background.position.x -= 2
    }
    if(keys.down){
        background.position.y -= 2
    }
    if(keys.left){
        background.position.x += 2
    }


}
animate()

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