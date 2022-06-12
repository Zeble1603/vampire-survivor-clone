class Sprite{
    constructor(width,height,shape,position){
        this.width = width
        this.height = height
        this.shape = shape
        this.position = position
    }
    draw(){
        ctx.drawImage(this.shape,this.position.x,this.position.y,this.width,this.height)
    }
    
}

class Player extends Sprite{
    constructor(height,width,shape,position,
        stats,pv,level,xp,xpToNextLvl,attack,skills){
        super(height,width,shape,position)
        
        this.shapeRight = shapeRight
        this.shapeDown = shapeDown
        this.shapeUp = shapeUp
        this.stats = stats
        this.pv = pv
        this.level = level
        this.xp = xp
        this.xpToNextLvl = xpToNextLvl
        this.attack = attack
        this.skills = skills
    }
    /* METHODS
    1/Move, different from mother
    --> just flip the image from left to right
    2/Erase
    3/Draw
    */
    drawRight(){
        ctx.drawImage(this.shapeRight,this.position.x,this.position.y,this.width,this.height)
    }


    move(key){
        switch (key) {
            case "ArrowLeft":
                this.erase()
                this.draw()
                break;
            case "ArrowRight":
                this.erase()
                this.drawRight()
                break;
            case "ArrowUp":
                this.erase()
                this.drawUp()
                break;
            case "ArrowDown":
                this.erase()
                this.drawDown()
                break;
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
        if (this.position.x > (canvas.width/2 - charaImage.width/2)){
            this.position.x -= 1
        }else if(this.position.x < (canvas.width/2 - charaImage.width/2)){
            this.position.x += 1}
        if (this.position.y > (canvas.height/2 - charaImage.height/2)){
            this.position.y -= 1
        }else if(this.position.y < (canvas.height/2 - charaImage.height/2)){
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