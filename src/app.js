var Game_Layer = cc.LayerColor.extend({

    bg:null,
    tank_1:null,
    ball:null,

    ctor:function() {
        this._super(cc.color(255, 255, 255));
        this.init();
    },

    init:function(){
        var size = cc.director.getWinSize();
        //Reset Global
        TB.CONTAINER.TANKS = [];
        TB.CONTAINER.BULLETS = [];
        TB.CONTAINER.TOOLS = [];
        TB.SIZE = size;

        //draw maze map
        this.bg = new MapNode();
        this.addChild(this.bg);
        this.bg.DrawMap();

        this.tank_1 = new Tank();
        this.addChild(this.tank_1);


        //Keyboard listener
        if (cc.sys.capabilities.hasOwnProperty('keyboard')) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function (key, event) {
                    TB.KEYS[key] = true;
                },
                onKeyReleased: function (key, event) {
                    TB.KEYS[key] = false;
                }
            }, this);
        }

        this.scheduleUpdate();
    },

    update:function(dt){
        for(var i in this.children){
            this.children[i].update(dt);
        }
    }

});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        TB.sharedGameLayer = new Game_Layer();

        this.addChild(TB.sharedGameLayer);

    }
});
