Asteroids Library

Receives 2 props:

gameStyle:Object = {
    width:Number
    height:Number
}

gameVariables:Object = {
    fps:Number,
    friction:Number,
    game_lives:Number,
    laser:Object = {
        distance:Number,
        explosion_duration:Number,
        max:Number,
        speed:Number
    },
    roids:Object = {
        points:Object = {
            jagedness:Number,
            large:Number,
            medium:Number,
            small:Number,
        },
        num:Number,
        size:Number,
        speed:Number,
        vert:Number
    },
    save_key:String,
    ship:Object = {
        blink_duration:Number,
        explosion_duration:Number,
        invencibility_duration:Number,
        size:Number
        thrust:Number,
        turn_speed:Number,
        show_bounding:Boolean,
        show_centre:Boolean
    },
    music:Boolean,
    sound:Boolean,
    text:Object = {
        fade_time:Number,
        size:Number
    }
}

