/**
 * Created by aquaird on 6/2/15.
 */

var Tank = cc.Sprite.extend({
    weaponType: 0,
    size:   null,
    point_1:    [],
    point_2:    [],
    point_3:    [],
    point_4:    [],
    bulletRemain: 5,
    tank_tag: -1,
    radius: 0,
    active: false,
    move: [],


ctor:   function(){
        this._super(res.tank_body);
        this.init();
    },

    init:   function(){

        this.setAnchorPoint(0.5,0.5)
        this.tank_tag = TB.CONTAINER.TANKS.length;
        this.setTag(this.tank_tag);
        TB.CONTAINER.TANKS.push(this);
        this.size = this.getContentSize();
        this.radius = Math.min(this.size.height, this.size.width) * Math.sqrt(2)/2;
        this.active = true;

        this.x = Math.floor(Math.random()*TB.SIZE.width);
        this.y = Math.floor(Math.random()*TB.SIZE.height);
        this.updatepoint();
        while(this.block()){
            this.x = Math.floor(Math.random()*TB.SIZE.width);
            this.y = Math.floor(Math.random()*TB.SIZE.height);
            this.updatepoint();
        }
        this.move = [false,false,false,false,false];

    },

    updatepoint:function(){
        this.point_1 = [this.x+(this.size.width/2)*Math.cos(2*Math.PI/360*-this.rotation)-(this.size.height/2)*Math.sin(2*Math.PI/360*-this.rotation),
            this.y+this.size.height/2*Math.cos(2*Math.PI/360*-this.rotation)+Math.sin(2*Math.PI/360*-this.rotation)*(this.size.width/2)];
        this.point_2 = [this.x+(-this.size.width/2)*Math.cos(2*Math.PI/360*-this.rotation)-(this.size.height/2)*Math.sin(2*Math.PI/360*-this.rotation),
            this.y+this.size.height/2*Math.cos(2*Math.PI/360*-this.rotation)+Math.sin(2*Math.PI/360*-this.rotation)*(-this.size.width/2)];
        this.point_3 = [this.x+(this.size.width/2)*Math.cos(2*Math.PI/360*-this.rotation)-(-this.size.height/2)*Math.sin(2*Math.PI/360*-this.rotation),
            this.y+(-this.size.height/2)*Math.cos(2*Math.PI/360*-this.rotation)+Math.sin(2*Math.PI/360*-this.rotation)*(this.size.width/2)];
        this.point_4 = [this.x+(-this.size.width/2)*Math.cos(2*Math.PI/360*-this.rotation)-(-this.size.height/2)*Math.sin(2*Math.PI/360*-this.rotation),
            this.y+(-this.size.height)/2*Math.cos(2*Math.PI/360*-this.rotation)+Math.sin(2*Math.PI/360*-this.rotation)*(-this.size.width/2)];
    },

    update:function (dt) {

        if (this.move[0]) {
            this.y += (dt * TB.SPEED.TANK)*Math.sin(2*Math.PI/360*-this.rotation);
            this.x += (dt * TB.SPEED.TANK)*Math.cos(2*Math.PI/360*-this.rotation);
            this.updatepoint();

            if(this.block()[0]){
                this.y -= 3*(dt * TB.SPEED.TANK)*Math.sin(2*Math.PI/360*-this.rotation);
                this.x -= 3*(dt * TB.SPEED.TANK)*Math.cos(2*Math.PI/360*-this.rotation);
                this.updatepoint();
            }
        }
        if (this.move[1]) {
            this.y -= (dt * TB.SPEED.TANK)*Math.sin(2*Math.PI/360*-this.rotation);
            this.x -= (dt * TB.SPEED.TANK)*Math.cos(2*Math.PI/360*-this.rotation);
            this.updatepoint();

            if(this.block()[0]){
                this.y += 3*(dt * TB.SPEED.TANK)*Math.sin(2*Math.PI/360*-this.rotation);
                this.x += 3*(dt * TB.SPEED.TANK)*Math.cos(2*Math.PI/360*-this.rotation);
                this.updatepoint();
            }
        }
        if (this.move[3]) {
            this.rotation += TB.SPEED.GUN * dt;
            this.updatepoint();

            if(this.block()[0]){
                this.rotation -= 3*TB.SPEED.GUN * dt;
                this.updatepoint();
            }
        }
        if (this.move[2]) {
            this.rotation -= TB.SPEED.GUN * dt;
            this.updatepoint();

            if(this.block()[0]){
                this.rotation += 3*TB.SPEED.GUN * dt;
                this.updatepoint();
            }
        }


        if(this.move[4]){

            if(this.bulletRemain > 0) {
                this.bulletRemain -= 1;
                this.move[4] = false;
                this.shoot();
            }

        }






        //cc.log("point1:" + this.point_1);
        //cc.log("point2:" + this.point_2);
        //cc.log("point3:" + this.point_3);
        //cc.log("point4:" + this.point_4);

    },

    block: function(){
        var i = parseInt(this.x/TB.MAP.unit_x);
        var j = parseInt(this.y/TB.MAP.unit_y);

        //var walls = [TB.MAP.map.wall_col[i][j], TB.MAP.map.wall_row[i][j], TB.MAP.map.wall_col[i+1][j], TB.MAP.map.wall_row[i][j+1]];
        var ymax = Math.max(this.point_1[1],this.point_2[1],this.point_3[1],this.point_4[1]);
        var ymin = Math.min(this.point_1[1],this.point_2[1],this.point_3[1],this.point_4[1]);
        var xmax = Math.max(this.point_1[0],this.point_2[0],this.point_3[0],this.point_4[0]);
        var xmin = Math.min(this.point_1[0],this.point_2[0],this.point_3[0],this.point_4[0]);

        if(ymax>=TB.SIZE.height || ymin<=0 || xmin<=0 || xmax>=TB.SIZE.width){
            return [true,-1];//出边线
        }

        if(!TB.MAP.map.wall_row[i][j]){
            if(j*TB.MAP.unit_y >= ymin-3 && j*TB.MAP.unit_y<=ymax+3){

                //cc.log(i,j+" under");
                return [true,1];
            }
        }

        if(!TB.MAP.map.wall_row[i][j+1]){
            if((j+1)*TB.MAP.unit_y >= ymin-3 && (j+1)*TB.MAP.unit_y<=ymax+3){

                //cc.log(i,j+" up");
                return [true,2];
            }
        }

        if(!TB.MAP.map.wall_col[i][j]){
            if(i*TB.MAP.unit_x >= xmin-3 && i*TB.MAP.unit_x<=xmax+3){

                //cc.log(i,j+" left");
                return [true,3];
            }
        }

        if(!TB.MAP.map.wall_col[i+1][j]){
            if((i+1)*TB.MAP.unit_x >= xmin-3 && (i+1)*TB.MAP.unit_x<=xmax+3){

                //cc.log(i,j+" right");
                return [true,4];
            }
        }

        return false
    },

    shoot: function(){
        if(this.weaponType == 0) {
            var shoot_y = this.y + (1.5 * this.radius) * Math.sin(2 * Math.PI / 360 * -this.rotation);
            var shoot_x = this.x + (1.5 * this.radius) * Math.cos(2 * Math.PI / 360 * -this.rotation);
            Bullet.getOrCreateBullet(shoot_x, shoot_y, this.rotation, this.tank_tag);
        }

    },

    destroy: function(){
        this.removeFromParent();
        this.active = false;
    }

});
