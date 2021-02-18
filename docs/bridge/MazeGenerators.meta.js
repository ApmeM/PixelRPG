Bridge.assembly("MazeGenerators", function ($asm, globals) {
    "use strict";


    var $m = Bridge.setMetadata,
        $n = ["MazeGenerators","MazeGenerators.Utils","System","System.Collections.Generic"];
    $m("MazeGenerators.Directions", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"CardinalDirs","is":true,"t":4,"rt":System.Array.type(MazeGenerators.Utils.Vector2),"sn":"CardinalDirs","ro":true},{"a":2,"n":"CompassDirs","is":true,"t":4,"rt":System.Array.type(MazeGenerators.Utils.Vector2),"sn":"CompassDirs","ro":true}]}; }, $n);
    $m("MazeGenerators.RoomMazeGenerator", function () { return {"nested":[$n[0].RoomMazeGenerator.Result,$n[0].RoomMazeGenerator.Settings],"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"CanCarve","t":8,"pi":[{"n":"result","pt":$n[0].RoomMazeGenerator.Result,"ps":0},{"n":"pos","pt":$n[1].Vector2,"ps":1},{"n":"direction","pt":$n[1].Vector2,"ps":2}],"sn":"CanCarve","rt":$n[2].Boolean,"p":[$n[0].RoomMazeGenerator.Result,$n[1].Vector2,$n[1].Vector2],"box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"ConnectRegions","t":8,"pi":[{"n":"result","pt":$n[0].RoomMazeGenerator.Result,"ps":0},{"n":"settings","pt":$n[0].RoomMazeGenerator.Settings,"ps":1},{"n":"connectorId","pt":$n[2].Int32,"ps":2}],"sn":"ConnectRegions","rt":$n[2].Void,"p":[$n[0].RoomMazeGenerator.Result,$n[0].RoomMazeGenerator.Settings,$n[2].Int32]},{"a":2,"n":"Generate","t":8,"pi":[{"n":"settings","pt":$n[0].RoomMazeGenerator.Settings,"ps":0}],"sn":"Generate","rt":$n[0].RoomMazeGenerator.Result,"p":[$n[0].RoomMazeGenerator.Settings]},{"a":1,"n":"GrowMaze","t":8,"pi":[{"n":"result","pt":$n[0].RoomMazeGenerator.Result,"ps":0},{"n":"settings","pt":$n[0].RoomMazeGenerator.Settings,"ps":1},{"n":"start","pt":$n[1].Vector2,"ps":2},{"n":"regionId","pt":$n[2].Int32,"ps":3}],"sn":"GrowMaze","rt":$n[2].Void,"p":[$n[0].RoomMazeGenerator.Result,$n[0].RoomMazeGenerator.Settings,$n[1].Vector2,$n[2].Int32]},{"a":1,"n":"RemoveDeadEnds","t":8,"pi":[{"n":"result","pt":$n[0].RoomMazeGenerator.Result,"ps":0},{"n":"settings","pt":$n[0].RoomMazeGenerator.Settings,"ps":1}],"sn":"RemoveDeadEnds","rt":$n[2].Void,"p":[$n[0].RoomMazeGenerator.Result,$n[0].RoomMazeGenerator.Settings]},{"a":1,"n":"TryAddRooms","t":8,"pi":[{"n":"result","pt":$n[0].RoomMazeGenerator.Result,"ps":0},{"n":"settings","pt":$n[0].RoomMazeGenerator.Settings,"ps":1},{"n":"regionId","pt":$n[2].Int32,"ps":2}],"sn":"TryAddRooms","rt":$n[2].Boolean,"p":[$n[0].RoomMazeGenerator.Result,$n[0].RoomMazeGenerator.Settings,$n[2].Int32],"box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}}]}; }, $n);
    $m("MazeGenerators.RoomMazeGenerator.Result", function () { return {"td":$n[0].RoomMazeGenerator,"att":1048578,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"GetTile","t":8,"pi":[{"n":"pos","pt":$n[1].Vector2,"ps":0}],"sn":"GetTile","rt":$n[2].Nullable$1(System.Int32),"p":[$n[1].Vector2],"box":function ($v) { return Bridge.box($v, System.Int32, System.Nullable.toString, System.Nullable.getHashCode);}},{"a":2,"n":"IsInRegion","t":8,"pi":[{"n":"loc","pt":$n[1].Vector2,"ps":0}],"sn":"IsInRegion","rt":$n[2].Boolean,"p":[$n[1].Vector2],"box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"RemoveTile","t":8,"pi":[{"n":"pos","pt":$n[1].Vector2,"ps":0}],"sn":"RemoveTile","rt":$n[2].Void,"p":[$n[1].Vector2]},{"a":2,"n":"SetTile","t":8,"pi":[{"n":"pos","pt":$n[1].Vector2,"ps":0},{"n":"regionId","pt":$n[2].Int32,"ps":1}],"sn":"SetTile","rt":$n[2].Void,"p":[$n[1].Vector2,$n[2].Int32]},{"a":2,"n":"Junctions","t":4,"rt":$n[3].List$1(MazeGenerators.Utils.Vector2),"sn":"Junctions"},{"a":2,"n":"Regions","t":4,"rt":$n[2].Array.type(System.Nullable$1(System.Int32), 2),"sn":"Regions"},{"a":2,"n":"Rooms","t":4,"rt":$n[3].List$1(MazeGenerators.Utils.Rectangle),"sn":"Rooms"}]}; }, $n);
    $m("MazeGenerators.RoomMazeGenerator.Settings", function () { return {"td":$n[0].RoomMazeGenerator,"att":1048578,"a":2,"m":[{"a":2,"n":".ctor","t":1,"p":[$n[2].Int32,$n[2].Int32],"pi":[{"n":"width","pt":$n[2].Int32,"ps":0},{"n":"height","pt":$n[2].Int32,"ps":1}],"sn":"ctor"},{"a":2,"n":"Directions","t":4,"rt":System.Array.type(MazeGenerators.Utils.Vector2),"sn":"Directions"},{"a":2,"n":"ExtraConnectorChance","t":4,"rt":$n[2].Int32,"sn":"ExtraConnectorChance","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"Height","t":4,"rt":$n[2].Int32,"sn":"Height","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"NumRoomTries","t":4,"rt":$n[2].Int32,"sn":"NumRoomTries","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"Random","t":4,"rt":$n[2].Random,"sn":"Random"},{"a":2,"n":"RoomExtraSize","t":4,"rt":$n[2].Int32,"sn":"RoomExtraSize","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"Width","t":4,"rt":$n[2].Int32,"sn":"Width","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"WindingPercent","t":4,"rt":$n[2].Int32,"sn":"WindingPercent","box":function ($v) { return Bridge.box($v, System.Int32);}}]}; }, $n);
    $m("MazeGenerators.TreeMazeGenerator", function () { return {"nested":[$n[0].TreeMazeGenerator.Result,$n[0].TreeMazeGenerator.Settings],"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"CanCarve","t":8,"pi":[{"n":"result","pt":$n[0].TreeMazeGenerator.Result,"ps":0},{"n":"pos","pt":$n[1].Vector2,"ps":1},{"n":"direction","pt":$n[1].Vector2,"ps":2}],"sn":"CanCarve","rt":$n[2].Boolean,"p":[$n[0].TreeMazeGenerator.Result,$n[1].Vector2,$n[1].Vector2],"box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"Generate","t":8,"pi":[{"n":"settings","pt":$n[0].TreeMazeGenerator.Settings,"ps":0}],"sn":"Generate","rt":$n[0].TreeMazeGenerator.Result,"p":[$n[0].TreeMazeGenerator.Settings]},{"a":1,"n":"GrowMaze","t":8,"pi":[{"n":"result","pt":$n[0].TreeMazeGenerator.Result,"ps":0},{"n":"settings","pt":$n[0].TreeMazeGenerator.Settings,"ps":1},{"n":"start","pt":$n[1].Vector2,"ps":2},{"n":"regionId","pt":$n[2].Int32,"ps":3}],"sn":"GrowMaze","rt":$n[2].Void,"p":[$n[0].TreeMazeGenerator.Result,$n[0].TreeMazeGenerator.Settings,$n[1].Vector2,$n[2].Int32]}]}; }, $n);
    $m("MazeGenerators.TreeMazeGenerator.Result", function () { return {"td":$n[0].TreeMazeGenerator,"att":1048578,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"GetTile","t":8,"pi":[{"n":"pos","pt":$n[1].Vector2,"ps":0}],"sn":"GetTile","rt":$n[2].Nullable$1(System.Int32),"p":[$n[1].Vector2],"box":function ($v) { return Bridge.box($v, System.Int32, System.Nullable.toString, System.Nullable.getHashCode);}},{"a":2,"n":"IsInRegion","t":8,"pi":[{"n":"loc","pt":$n[1].Vector2,"ps":0}],"sn":"IsInRegion","rt":$n[2].Boolean,"p":[$n[1].Vector2],"box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"RemoveTile","t":8,"pi":[{"n":"pos","pt":$n[1].Vector2,"ps":0}],"sn":"RemoveTile","rt":$n[2].Void,"p":[$n[1].Vector2]},{"a":2,"n":"SetTile","t":8,"pi":[{"n":"pos","pt":$n[1].Vector2,"ps":0},{"n":"regionId","pt":$n[2].Int32,"ps":1}],"sn":"SetTile","rt":$n[2].Void,"p":[$n[1].Vector2,$n[2].Int32]},{"a":2,"n":"Regions","t":4,"rt":$n[2].Array.type(System.Nullable$1(System.Int32), 2),"sn":"Regions"}]}; }, $n);
    $m("MazeGenerators.TreeMazeGenerator.Settings", function () { return {"td":$n[0].TreeMazeGenerator,"att":1048578,"a":2,"m":[{"a":2,"n":".ctor","t":1,"p":[$n[2].Int32,$n[2].Int32],"pi":[{"n":"width","pt":$n[2].Int32,"ps":0},{"n":"height","pt":$n[2].Int32,"ps":1}],"sn":"ctor"},{"a":2,"n":"Directions","t":4,"rt":System.Array.type(MazeGenerators.Utils.Vector2),"sn":"Directions"},{"a":2,"n":"Height","t":4,"rt":$n[2].Int32,"sn":"Height","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"Random","t":4,"rt":$n[2].Random,"sn":"Random"},{"a":2,"n":"Width","t":4,"rt":$n[2].Int32,"sn":"Width","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"WindingPercent","t":4,"rt":$n[2].Int32,"sn":"WindingPercent","box":function ($v) { return Bridge.box($v, System.Int32);}}]}; }, $n);
    $m("MazeGenerators.Utils.Rectangle", function () { return {"att":1048841,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":".ctor","t":1,"p":[$n[2].Int32,$n[2].Int32,$n[2].Int32,$n[2].Int32],"pi":[{"n":"x","pt":$n[2].Int32,"ps":0},{"n":"y","pt":$n[2].Int32,"ps":1},{"n":"width","pt":$n[2].Int32,"ps":2},{"n":"height","pt":$n[2].Int32,"ps":3}],"sn":"$ctor1"},{"a":2,"n":"Intersects","t":8,"pi":[{"n":"value","pt":$n[1].Rectangle,"ps":0}],"sn":"Intersects","rt":$n[2].Boolean,"p":[$n[1].Rectangle],"box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"Height","t":4,"rt":$n[2].Int32,"sn":"Height","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"Width","t":4,"rt":$n[2].Int32,"sn":"Width","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"X","t":4,"rt":$n[2].Int32,"sn":"X","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"Y","t":4,"rt":$n[2].Int32,"sn":"Y","box":function ($v) { return Bridge.box($v, System.Int32);}}]}; }, $n);
    $m("MazeGenerators.Utils.Vector2", function () { return {"att":1048841,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":".ctor","t":1,"p":[$n[2].Int32,$n[2].Int32],"pi":[{"n":"x","pt":$n[2].Int32,"ps":0},{"n":"y","pt":$n[2].Int32,"ps":1}],"sn":"$ctor1"},{"a":2,"n":"LengthSquared","t":8,"sn":"LengthSquared","rt":$n[2].Int32,"box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"op_Addition","is":true,"t":8,"pi":[{"n":"a","pt":$n[1].Vector2,"ps":0},{"n":"b","pt":$n[1].Vector2,"ps":1}],"sn":"op_Addition","rt":$n[1].Vector2,"p":[$n[1].Vector2,$n[1].Vector2]},{"a":2,"n":"op_Multiply","is":true,"t":8,"pi":[{"n":"a","pt":$n[1].Vector2,"ps":0},{"n":"b","pt":$n[2].Int32,"ps":1}],"sn":"op_Multiply","rt":$n[1].Vector2,"p":[$n[1].Vector2,$n[2].Int32]},{"a":2,"n":"op_Subtraction","is":true,"t":8,"pi":[{"n":"a","pt":$n[1].Vector2,"ps":0},{"n":"b","pt":$n[1].Vector2,"ps":1}],"sn":"op_Subtraction","rt":$n[1].Vector2,"p":[$n[1].Vector2,$n[1].Vector2]},{"a":2,"n":"X","t":4,"rt":$n[2].Int32,"sn":"X","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"Y","t":4,"rt":$n[2].Int32,"sn":"Y","box":function ($v) { return Bridge.box($v, System.Int32);}}]}; }, $n);
});