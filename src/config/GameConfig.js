/**
 * Created by aquaird on 5/28/15.
 */

var TB = TB || {};


//players
TB.PLAYER = [0];
TB.TANK_CONTROL = 0;

//Game Layer
TB.sharedGameLayer = null;

//Game state
TB.GAME_STATE = {
};

//Map
TB.MAP = {
    map_size:   null,
    map:    null,
    unit_x: 0,
    unit_y: 0
};

//Key
TB.KEYS = [][4];

//Sound
TB.SOUND = true;

//Unit Tag
TB.UNIT_TAG = {
    TANK:   900,
    MAP:    999
};

//Game Container
TB.CONTAINER = {
    TANKS:  [],
    BULLETS:    [],
    TOOLS:  []
};

//Speed
TB.SPEED = {
    TANK: 100,
    BULLET: 300,
    GUN: 30
};

TB.SIZE = {
};

TB.toolRemains = 3;




