/**
 * Created by aquaird on 6/15/15.
 */

var Bullet = cc.Sprite.extend({
    AttackType: 0,
    timeCount: 5,
    angle: 0,
    tank_tag: -1,
    active: true,
    angle: 0,

    ctor: function (x, y, angle, tank_tag) {
        //add types her
        this._super(res.bullet);
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.tank_tag = tank_tag;
        //this.scheduleUpdate();
        this.size = this.getContentSize();

        return this;
    },

    update:function (dt) {

        this.timeCount -= dt;
        if (this.timeCount <= 0) {
            this.destroy();
        }

        this.y += (dt * TB.SPEED.BULLET) * Math.sin(2 * Math.PI / 360 * -this.angle);
        this.x += (dt * TB.SPEED.BULLET) * Math.cos(2 * Math.PI / 360 * -this.angle);

        //反射
        if (this.block()[0]) {
            switch (this.block()[1]) {
                case 1 || 2:
                    this.angle = this.angle - 180;
                case 3 || 4:
                    this.angle = 180 - this.angle;
                //case -1:
                    //this.destroy();
            }
        }

    },

    block: function(){
        var i = parseInt(this.x/TB.MAP.unit_x);
        var j = parseInt(this.y/TB.MAP.unit_y);

        //var walls = [TB.MAP.map.wall_col[i][j], TB.MAP.map.wall_row[i][j], TB.MAP.map.wall_col[i+1][j], TB.MAP.map.wall_row[i][j+1]];
        var ymax = this.y + this.size.height/2;
        var ymin = this.y - this.size.height/2;
        var xmax = this.x + this.size.width/2;
        var xmin = this.x - this.size.width/2;

        if(ymax>=TB.SIZE.height || ymin<=0 || xmin<=0 || xmax>=TB.SIZE.width){
            return [true,-1];//出边线
        }

        if(!TB.MAP.map.wall_row[i][j]){
            if(j*TB.MAP.unit_y >= ymin-3 && j*TB.MAP.unit_y<=ymax+3){

                cc.log(i,j+" under");
                return [true,1];
            }
        }

        if(!TB.MAP.map.wall_row[i][j+1]){
            if((j+1)*TB.MAP.unit_y >= ymin-3 && (j+1)*TB.MAP.unit_y<=ymax+3){

                cc.log(i,j+" up");
                return [true,2];
            }
        }

        if(!TB.MAP.map.wall_col[i][j]){
            if(i*TB.MAP.unit_x >= xmin-3 && i*TB.MAP.unit_x<=xmax+3){

                cc.log(i,j+" left");
                return [true,3];
            }
        }

        if(!TB.MAP.map.wall_col[i+1][j]){
            if((i+1)*TB.MAP.unit_x >= xmin-3 && (i+1)*TB.MAP.unit_x<=xmax+3){

                cc.log(i,j+" right");
                return [true,4];
            }
        }

        return false
    },


    destroy: function() {
        TB.sharedGameLayer.getChildByTag(this.tank_tag).bulletRemain += 1;
        this.removeFromParent();
    }

});

Bullet.getOrCreateBullet = function(x,y,angle,tank_tag){
        var selChild = null;
        for(var i=0;i<TB.CONTAINER.BULLETS.length;i++){
            selChild = TB.CONTAINER.BULLETS[i];
            if(selChild.tank_tag == tank_tag) {
                if (selChild.active == false) {
                    selChild.active = true;
                    selChild.visible = true;
                    return selChild;
                }
            }
        }
        selChild = Bullet.create(x,y,angle,tank_tag);
        return selChild;
};


Bullet.create = function(x,y,angle,tank_tag){
        var bullet = new Bullet(x,y,angle,tank_tag);
        TB.sharedGameLayer.addChild(bullet,1);
        TB.CONTAINER.BULLETS.push(bullet);
        return bullet;
};