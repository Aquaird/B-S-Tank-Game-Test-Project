/**
 * Created by aquaird on 6/15/15.
 */

var Bullet = cc.Sprite.extend({
    AttackType: 0,
    timeCount: 5000,
    angle:  0,
    tank_tag:   -1,
    active: true,

    ctor:   function(x,y,angle,tank_tag){
        //add types her
        this._super(res.bullet);
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.tank_tag = tank_tag;
    },

    update: function(dt){

        this.timeCount -= dt;
        if(this.timeCount <= 0){
            this.destroy();
        }

        this.y += (dt * TB.SPEED.BULLET)*Math.sin(2*Math.PI/360*-this.rotation);
        this.x += (dt * TB.SPEED.BULLET)*Math.cos(2*Math.PI/360*-this.rotation);

        this.updatepoint();

        //反射
        if(this.block()[0]){
            switch (this.block()[1]){
                case 1 || 2:
                    this.y -= 2*(dt * TB.SPEED.BULLET)*Math.sin(2*Math.PI/360*-this.rotation);
                case 3 || 4:
                    this.x -= 2*(dt * TB.SPEED.BULLET)*Math.cos(2*Math.PI/360*-this.rotation);
                default :
                    this.destroy();
            }
        }

    },

    getOrCreateBullet:  function(x,y,angle,tank_tag){
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

        return selChild = Bullet.create(x,y,angle,tank_tag);
    },

    destroy:    function(){
        this.visible = false;
    },

    create: function(x,y,angle,tank_tag){
        var bullet = Bullet(x,y,angle,tank_tag);
        TB.sharedGameLayer.addChild(bullet,1);
        TB.CONTAINER.BULLETS.push(TB.sharedGameLayer);
        return bullet;
    }
});