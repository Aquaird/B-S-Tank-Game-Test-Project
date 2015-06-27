/**
 * Created by aquaird on 6/27/15.
 */

var tool = cc.Sprite.extend({
    type: 0,
    radius: 0,
    active: true,

    ctor: function(){
        this.type = Math.floor(Math.random()*2);
        this._super("res/tool_"+this.type+".JPEG");
        this.size = this.getContentSize();
        this.radius = this.size.width * Math.sqrt(2)/2;
        this.active = true;
        this.resetPosition();
        return this;
    },

    resetPosition:function(){
        this.x = Math.floor(Math.random()*TB.SIZE.width);
        this.y = Math.floor(Math.random()*TB.SIZE.height);
        while(this.block()){
            this.x = Math.floor(Math.random()*TB.SIZE.width);
            this.y = Math.floor(Math.random()*TB.SIZE.height);
        }
    },

    destroy: function(tank){
        tank.weaponType = this.type;
        this.active = false;
        this.removeFromParent();
        TB.toolRemains += 1;
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
    }




});

tool.getOrCreateRandomTool = function(){
    if(TB.toolRemains <= 0)
        return null;

    var selChild = null;
    var type = Math.floor(Math.random()*2);
    for(var i=0;i<TB.CONTAINER.TOOLS.length;i++){
        selChild = TB.CONTAINER.TOOLS[i];
        if(selChild.type == type) {
            if (selChild.active == false) {
                selChild.active = true;
                selChild.resetPosition();
                TB.sharedGameLayer.addChild(selChild,1);
                TB.toolRemains -= 1;
                return selChild;
            }
        }
    }
    selChild = tool.create();
    return selChild;
};


tool.create = function(){
    var selfchild = new tool();
    TB.sharedGameLayer.addChild(selfchild,1);
    TB.toolRemains -= 1;
    TB.CONTAINER.TOOLS.push(selfchild);
    return selfchild;
};
