class Sprite{
    constructor(width,height,shape,position){
        this.width = width
        this.height = height
        this.shape = shape
        this.position = position
    }
    draw(){
        ctx.drawImage(
            this.shape,
            this.position.x,
            this.position.y,
            this.width,
            this.height)
    }
    
}

class Player extends Sprite{
    constructor(width,height,shape,sprites){
        super(width,height,shape)
        this.position = {x:(canvas.width/2 - this.shape.width/9),
        y:(canvas.height/2-this.shape.height /2)},
        this.sprites = sprites
        this.direction = 'right'
        this.moving = false
        this.frame = {
            max :0,
            val:3,
            elapsed:0
        }
        this.weapon = []
        this.skills = []
        this.stats = {
            pv:50,
            lvl:1,
            xp:0,
            xpToNextLvl:50,
        }
    }
    move(){
        if (this.direction === 'right'){
            this.shape = this.sprites.right
            ctx.drawImage(
                this.shape,
                this.shape.width / 9 * this.frame.val,
                0,
                this.shape.width / 9,
                this.shape.height,
                this.position.x,
                this.position.y,
                this.width,
                this.height,)
            this.frame.elapsed ++
            if (!this.moving){
                this.frame.val = 3
            }else{
                if (this.frame.elapsed % 10 === 0){
                    if(this.frame.val < 7){
                        this.frame.val ++
                    }else{
                        this.frame.val = 4
                    }
                }
            }
        }else{
            this.shape = this.sprites.left
            ctx.drawImage(
                this.shape,
                this.shape.width / 9 * this.frame.val,
                0,
                this.shape.width / 9,
                this.shape.height,
                this.position.x,
                this.position.y,
                this.width,
                this.height,)
            this.frame.elapsed ++
            if (!this.moving){
                this.frame.val = 5
            }else{
                if (this.frame.elapsed % 10 === 0){
                    if(this.frame.val > 1){
                        this.frame.val --
                    }else{
                        this.frame.val = 4
                    }
                }
            }
        }
    }

}

class Enemy extends Sprite{
    constructor(height,width,shape,position,pv,strenght){
        super(height,width,shape,position)
        this.pv = pv
        this.strenght = strenght
    }
    draw(){
        ctx.drawImage(this.shape,this.position.x,this.position.y,this.width,this.height)

    }

    move(){
        if (this.position.x > character.position.x){
            this.position.x -= 1
        }else if(this.position.x < character.position.x){
            this.position.x += 1}
        if (this.position.y > character.position.y){
            this.position.y -= 1
        }else if(this.position.y < character.position.y){
            this.position.y += 1}
    }
    /* METHODS
    1/Move
    2/Erase 
    3/Draw    
    */
}

class Object extends Sprite{
    constructor(height,width,shape,x,y,effect){
        super(height,width,shape,x,y)
        this.effect = effect
    }
    /* METHODS
    1/Erase 
    2/Draw
    3/Apply effect (heal & XP)
    */
}

class skills{
    constructor(name,description,image,lvl,effect){
        this.name = name
        this.description = description
        this.image = image
        this.lvl = lvl
        this.effect = effect
    }  
    /* METHODS
    1/Apply effect (buff) 
    2/Add to skills 
    3/Lvl up 
    */

}

class Weapon extends Sprite{
    constructor(width,height,shape,sprites,position,name,description){
    super(width,height,shape,position)
    this.sprites = sprites
    this.name = name
    this.description = description
    this.lvl = 1
    this.damage = 0
    }
    /* METHODS
    1/Attack
    --> draw / erase / move 
    2/Add to skills 
    3/Lvl up 
    */
}

class sword extends Weapon{
    constructor(width,height,shape,sprites){
        super(width,height,shape,sprites)
        this.position = {x:(canvas.width/2 - this.shape.width/9),
        y:(character.position.y + character.height / 2)-character.height / 4}
        this.frame = 200
        this.animation = false
        this.animationStart = 0
        this.animationEnd = this.animationStart + 50

    }
    attack(){
        if (character.direction === 'left'){
            this.position.x = (character.position.x - this.width)
            console.log('chara left')
             
        }else{
            this.position.x = (character.position.x + character.width)
            console.log('chara right')
        }
        ctx.drawImage(
            this.shape,
            0,
            0,
            this.shape.width,
            this.shape.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height,) 
        
    }                    
}