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
        this.weapons = []
        this.skills = []
        this.stats = {
            pvMax:50,
            pv:50,
            xpMax:50,
            xp:0,
            lvl:1,  
            strenght:1
        }
        this.speed = 1
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
    reset(){
        this.direction = 'right'
        this.moving = false
        this.frame = {
            max :0,
            val:3,
            elapsed:0
        }
        this.weapons = []
        this.skills = []
        this.stats = {
            pvMax:50,
            pv:50,
            xpMax:50,
            xp:0,
            lvl:1,  
            strenght:1
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
        if (this.position.y > (character.position.y + character.height / 2)-character.height / 4){
            this.position.y -= 1
        }else if(this.position.y < (character.position.y + character.height / 2)-character.height / 4){
            this.position.y += 1}
    }

    getPushed(directionX,directionY){
        if(directionX === 'right'){
            this.position.x += 40
        }else{
            this.position.x -= 40
        }
        if(directionY==='up'){
            this.position.y -= 40
        }else{
            this.position.y += 40
        }
    }
}

class Item extends Sprite{
    constructor(height,width,shape,position,type='xp'){
        super(height,width,shape,position)
        this.type = type
    }

    heal(player){
        player.stats.pv += 30
        if (player.stats.pv > player.stats.pvMax){
            player.stats.pv = player.stats.pvMax
        }
    }

    pex(player){
        player.stats.xp += 10
        if (player.stats.xp >= player.stats.xpMax){
            player.stats.lvl +=1
            player.stats.strenght += 0.1
            player.stats.xp -= player.stats.xpMax

        }
    }
    
}

class Skills{
    constructor(name,image){
        this.name = name
        this.image = image
        this.maxLvl = 9
    }  
}

class DamagesBuff extends Skills{
    constructor(name,image){
        super(name,image)
        this.lvl = 1
        this.value = 1.5
        this.description = `Increases weapon damages by ${this.value} per rank`
    }
    applyBuff(attack){
        attack.damage *= this.value
    }
}

class RangeBuff extends Skills{
    constructor(name,image){
        super(name,image)
        this.lvl = 1
        this.value = 1
        this.description = `Increases weapon range by ${this.value} per rank`
    }
    applyBuff(attack){
        attack.width += this.value
        attack.height += this.height
    }
}

class CoolDownBuff extends Skills{
    constructor(name,image){
        super(name,image)
        this.lvl = 1
        this.value = 2
        this.description = `Reduces weapon range by ${this.value} frame per rank`
    }
    applyBuff(attack){
        attack.frame -= this.value
    }
}

class ArmorBuff extends Skills{
    constructor(name,image){
        super(name,image)
        this.lvl = 1
        this.value = 1
        this.description = `Reduces enemies damages by ${this.value} per rank`
    }
    applyBuff(enemies){
        enemies.strenght -= this.value
        this.value += 2
    }
}

class SpeedBuff extends Skills{
    constructor(name,image){
        super(name,image)
        this.lvl = 1
        this.value = 0.1
        this.description = `Increase character speed by ${this.value} per rank`
    }
    applyBuff(player){
        player.speed += this.value
    }
}


class Weapon extends Sprite{
    constructor(width,height,shape,sprites,position,name,description){
    super(width,height,shape,position)
    this.sprites = sprites
    this.name = name
    this.description = description
    this.lvl = 1
    }
}

class Sword extends Weapon{
    constructor(width,height,shape,sprites,damage){
        super(width,height,shape,sprites)
        this.position = {x:(character.position.x),
        y:(character.position.y + character.height / 2)-character.height / 4}
        this.damage = damage
        this.frame = 100
        this.animation = false
        this.animationStart = 0
        this.animationEnd = this.animationStart + 20

    }
    attack(){
        if (character.direction === 'left'){
            this.position.x = (character.position.x - this.width)
        }else{
            this.position.x = (character.position.x)
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

