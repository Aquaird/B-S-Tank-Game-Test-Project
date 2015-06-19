//this is the function to make a maze(relax) by width(x) and height(y)
function maze(x,y){
    var i,j;
    var next;
    var n = x*y-1; //the point that is not visited
    if(n<0){
        cc.log("Maze dimension error");
        return;
    }

    var wall_row = [];for(i=0;i<x+1;i++) wall_row[i] = [];//no wall of row
    var wall_col = [];for(i=0;i<x+1;i++) wall_col[i] = [];//no wall of col
    var now_loc = [Math.floor(Math.random()*x), Math.floor(Math.random()*y)];//now location
    var path = [now_loc];//the path to build the maze, push to remember the road & pop to get back
    var unvisited = [];//the points unvisited, padded 1(i don't know why)

    //make all the point except now_loc to be unvisited
    for (i=0;i<x+2;i++){
        unvisited[i] = [];
        for(j=0;j<y+1;j++){
            unvisited[i].push(i>0 && i<x+1 && j>0 && (i!=now_loc[0]+1 || j!=now_loc[1]+1));
        }
    }

    //began to build
    while(0<n){
        //the four points waited to be judged
        var wait = [[now_loc[0]+1,now_loc[1]],[now_loc[0]-1,now_loc[1]],[now_loc[0],now_loc[1]-1],
            [now_loc[0],now_loc[1]+1]];

        //unvisited 'wait'
        var neighbor = [];
        for(i=0;i<4;i++){
            if(unvisited[wait[i][0]+1][wait[i][1]+1]){
                neighbor.push(wait[i]);
            }
        }

        //make 'neighbor' visited & wall open
        if(neighbor.length){
            //number of unvisited -1
            n = n-1;
            //random select a  neighbor
            next = neighbor[Math.floor(Math.random()*neighbor.length)];
            unvisited[next[0]+1][next[1]+1] = false;
            //break the wall
            if(next[0] == now_loc[0]){
                wall_row[next[0]][(next[1]+now_loc[1]+1)/2] = true;
            }
            else{
                wall_col[(next[0]+now_loc[0]+1)/2][next[1]] = true;
            }

            path.push(now_loc = next);
        }
        else {
            now_loc = path.pop();
        }
    }

    return {
        x:x,
        y:y,
        wall_col:wall_col,
        wall_row:wall_row
    }
};

var MapNode = cc.DrawNode.extend({
    ctor:function(){
        this._super();
    },
});

MapNode.prototype.DrawMap = function(){
    TB.MAP.map_size = [Math.floor(Math.random()*5+4), Math.floor(Math.random()*5+3)];
    TB.MAP.map = maze(TB.MAP.map_size[0],TB.MAP.map_size[1]);
    TB.MAP.unit_x = TB.SIZE.width/TB.MAP.map_size[0];
    TB.MAP.unit_y = TB.SIZE.height/TB.MAP.map_size[1];

    for(var i=0; i<TB.MAP.map.x+1; i++){
        for(var j=0; j<TB.MAP.map.y+1; j++){
            if(TB.MAP.map.wall_row[i][j]){
                ;
            }
            else{
                this.drawSegment(cc.p(i*TB.MAP.unit_x,j*TB.MAP.unit_y),cc.p((i+1)*TB.MAP.unit_x,j*TB.MAP.unit_y),5,cc.color(0,0,0));
            }
            if(TB.MAP.map.wall_col[i][j]){
                ;
            }
            else{
                this.drawSegment(cc.p(i*TB.MAP.unit_x,j*TB.MAP.unit_y),cc.p(i*TB.MAP.unit_x,(j+1)*TB.MAP.unit_y),5,cc.color(0,0,0));
            }
        }
    }
};
