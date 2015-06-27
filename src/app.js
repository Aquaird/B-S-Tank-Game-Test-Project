/**
 * Created by aquaird on 6/2/15.
 */

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
        this.schedule(tool.getOrCreateRandomTool, 5);
    },

    update:function(dt){
        for(var i in this.children){
            this.children[i].update(dt);
        }
        this.checkIsCollide();
    },

    collide:function(a,b){
        //usual bullets
        var dist = cc.pDistance(a.getPosition(), b.getPosition());
        if(dist < (a.radius+ b.radius)){
            return true;
        }

        //special tools
        //laser

        return false;
    },

    checkIsCollide:function () {
        var selChild, bulletChild;
        // check collide
        var i, locShip = this._ship;
        for (i = 0; i < TB.CONTAINER.TANKS.length; i++) {
            selChild = TB.CONTAINER.TANKS[i];
            if (!selChild.active)
                continue;

            for (var j = 0; j < TB.CONTAINER.BULLETS.length; j++) {
                bulletChild = TB.CONTAINER.BULLETS[j];
                if (bulletChild.active && this.collide(selChild, bulletChild)) {
                    bulletChild.destroy();
                    //add scores
                    selChild.destroy();
                }
            }

            for (var j = 0; j < TB.CONTAINER.TOOLS.length; j++) {
                bulletChild = TB.CONTAINER.TOOLS[j];
                if (bulletChild.active && this.collide(selChild, bulletChild)) {
                    bulletChild.destroy(selChild);
                }
            }

        }
    },

});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        TB.sharedGameLayer = new Game_Layer();
        this.addChild(TB.sharedGameLayer);

    }
});
