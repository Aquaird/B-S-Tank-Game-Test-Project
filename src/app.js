var I_I_Layer = cc.LayerColor.extend({

    bg:null,

    ctor:function(){
        this._super(cc.color(255,255,255));
        var size = cc.director.getWinSize();

        var map_size = [Math.floor(Math.random()*5+4), Math.floor(Math.random()*5+3)];
        var map = maze(map_size[0],map_size[1]);
        var unit_x = size.width/map_size[0];
        var unit_y = size.height/map_size[1];

        this.bg = new cc.DrawNode();
        this.addChild(this.bg);

        for(var i=0; i<map.x+1; i++){
            for(var j=0; j<map.y+1; j++){
                if(map.wall_row[i][j]){
                    ;
                }
                else{
                    this.bg.drawSegment(cc.p(i*unit_x,j*unit_y),cc.p((i+1)*unit_x,j*unit_y),2,cc.color(0,0,0));
                }
                if(map.wall_col[i][j]){
                    ;
                }
                else{
                    this.bg.drawSegment(cc.p(i*unit_x,j*unit_y),cc.p(i*unit_x,(j+1)*unit_y),2,cc.color(0,0,0));
                }
            }
        }
        //
        //setTimeout(function(){
        //    cc.director.runScene(new SecondScene());
        //},  3000);

    }
});

var I_II_Layer = cc.LayerColor.extend({
    frame:0,
    deltaX:1,
    ball:null,
    bg:null,

    ctor:function(){
        this._super(cc.color(255,255,255));
        var size = cc.director.getWinSize();
        //
        //var ball = new cc.Sprite(res.ball_png);
        //ball.setScale(0.1,0.1);
        //ball.x = 0;
        //ball.y = size.height/2;
        //this.addChild(ball,1);
        //this.ball = ball;

        this.bg = new cc.DrawNode();
        this.addChild(this.bg);
        this.bg.drawSegment(cc.p(0,0),cc.p(size.width,size.height),2,cc.color(255,0,0));

        //this.scheduleUpdate();
        return true;
    },
    //
    //update: function(){
    //    var size = cc.director.getWinSize();
    //    this.ball.x += this.deltaX;
    //    if(this.ball.x>= size.width || this.ball.x <= 0){
    //        this.deltaX *= -1;
    //    }
    //
    //    this.ball.y = Math.sin(this.frame/20)*50 + size.height/2;
    //
    //    this.bg.drawDot(new cc.Point(this.ball.x, this.ball.y),2,cc.color(255,0,0));
    //    this.frame++;
    //}
});

var FirstScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new I_I_Layer();
        this.addChild(layer);

        //setTimeout(function(){
        //    cc.director.runScene(new cc.TransitionSlideInL(2, new SecondScene()))
        //},1000);
    }
});


var SecondScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new I_II_Layer();
        this.addChild(layer);
    }
});