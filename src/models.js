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
    constructor(width,height,shape,position){
        super(width,height,shape,position)
        this.direction = 'right'
        this.moving = false
        this.frame = {
            max :0,
            val:3,
            elapsed:0
        }
        /*this.stats = stats
        this.pv = pv
        this.level = level
        this.xp = xp
        this.xpToNextLvl = xpToNextLvl
        this.attack = attack
        this.skills = skills*/
    }
    /* METHODS
    1/Move, different from mother
    --> just flip the image from left to right
    2/Erase
    3/Draw
    */
    drawRight(){
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
    }
}

class Enemy extends Sprite{
    constructor(height,width,shape,position,pv,attack){
        super(height,width,shape,position)
        this.pv = pv
        this.attack = attack
    }
    draw(){
        ctx.drawImage(this.shape,this.position.x,this.position.y,this.width,this.height)
        console.log('draw')
    }

    move(){
        if (this.position.x > (canvas.width/2 - character.width/2)){
            this.position.x -= 1
        }else if(this.position.x < (canvas.width/2 - character.width/2)){
            this.position.x += 1}
        if (this.position.y > (canvas.height/2 - character.height/2)){
            this.position.y -= 1
        }else if(this.position.y < (canvas.height/2 - character.height/2)){
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

class weapon extends skills{
    constructor(height,width,shape,x,y,name,description,image,lvl,effect,speed){
    super(name,description,image,lvl,effect)
    this.height = height
    this.width = width
    this.shape = shape
    this.x = x
    this.y = y
    this.speed = speed
    }
    /* METHODS
    1/Attack
    --> draw / erase / move 
    2/Add to skills 
    3/Lvl up 
    */
}