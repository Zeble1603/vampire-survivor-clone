class motherShape{
    constructor(height,width,shape,x,y){
        this.height = height
        this.width = width
        this.shape = shape
        this.x = x
        this.y = y
    }
}

class player extends motherShape{
    constructor(height,width,shape,x,y,stats,pv,level,xp,xpToNextLvl,attack,skills){
        super(height,width,shape,x,y)
        this.stats = stats
        this.pv = pv
        this.level = level
        this.xp = xp
        this.xpToNextLvl = xpToNextLvl
        this.attack = attack
        this.skills = skills
    }
}

class enemy extends motherShape{
    constructor(height,width,shape,x,y,pv,attack){
        super(height,width,shape,x,y)
        this.pv = pv
        this.attack = attack
    }
}

class object extends motherShape{
    constructor(height,width,shape,x,y,effect){
        super(height,width,shape,x,y)
        this.effect = effect
    }
}

class skills{
    constructor(name,description,image,lvl,effect){
        this.name = name
        this.description = description
        this.image = image
        this.lvl = lvl
        this.effect = effect
    }
}

class weapon extends skills{
    constructor(name,description,image,lvl,effect,hitbox,speed){
    super(name,description,image,lvl,effect)
    this.hitbox = hitbox
    this.speed = speed
    }
}