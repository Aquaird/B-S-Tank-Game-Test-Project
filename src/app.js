/**
 * Created by aquaird on 6/2/15.
 */

var Game_Layer = cc.LayerColor.extend({

    bg:null,
    tank_1:null,
    tank_control: 0,


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


        var tank;

        //循环TB.PLAYERS,画出坦克
        for(var i=0; i<TB.PLAYER.length; i++){
            tank =  new Tank();
            this.addChild(tank,i+1);
        };

        //这里的 0 指的是本地客户端需要控制的坦克是第几号坦克
        //这个也是SOCKET传过来的
        TB.tank_control = 0;
        this.tank_1 = TB.CONTAINER.TANKS[0];

        //本地键盘监听
        if (cc.sys.capabilities.hasOwnProperty('keyboard')) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function (key, event) {

                    switch(key){
                        case (cc.KEY.w || cc.KEY.up):
                            TB.CONTAINER.TANKS[TB.TANK_CONTROL].move[0] = true;
                            break;
                        case (cc.KEY.s || cc.KEY.down):
                            TB.CONTAINER.TANKS[TB.TANK_CONTROL].move[1] = true;
                            break;

                        case (cc.KEY.a || cc.KEY.left):
                            TB.CONTAINER.TANKS[TB.TANK_CONTROL].move[2] = true;
                            break;

                        case (cc.KEY.d || cc.KEY.right):
                            TB.CONTAINER.TANKS[TB.TANK_CONTROL].move[3] = true;
                            break;
                        case (cc.KEY.j):
                            TB.CONTAINER.TANKS[TB.TANK_CONTROL].move[4] = true;
                            break;
                    }

                    //SOCKET传指令到服务器,按的是哪个键,是哪个坦克(客户端坦克)按的
                    //data tank_tag:? do
                    //do 是一个动作, 0上1下2左3右4开炮
                },
                onKeyReleased: function (key, event) {
                    switch(key){
                        case (cc.KEY.w || cc.KEY.up):
                            TB.CONTAINER.TANKS[TB.TANK_CONTROL].move[0] = false;
                            break;
                        case (cc.KEY.s || cc.KEY.down):
                            TB.CONTAINER.TANKS[TB.TANK_CONTROL].move[1] = false;
                            break;

                        case (cc.KEY.a || cc.KEY.left):
                            TB.CONTAINER.TANKS[TB.TANK_CONTROL].move[2] = false;
                            break;

                        case (cc.KEY.d || cc.KEY.right):
                            TB.CONTAINER.TANKS[TB.TANK_CONTROL].move[3] = false;
                            break;
                        case (cc.KEY.j):
                            TB.CONTAINER.TANKS[TB.TANK_CONTROL].move[4] = false;
                            break;
                    }

                    //SOCKET传指令到服务器,按的是哪个键,是哪个坦克(客户端坦克)按的
                    //data tank_tag:? move:?

                }
            }, this);
        }

        this.scheduleUpdate();
        this.schedule(tool.getOrCreateRandomTool, 5);
    },

    update:function(dt){
        //SOCKET循环接受坦克的最新动向
        for(var i=0; i<TB.PLAYER.length; i++){
            if(i != TB.TANK_CONTROL) {
                //TB.CONTAINER.TANK[i].move = SOCKET获得的data.move
            }
        };

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
