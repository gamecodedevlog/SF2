OBJECT[ID.FX] = {
    IMG:7,
    SOUND:0,
    NEW:[
    [1,2,3,4,5,6],//image
    [NO_SOUND],//sound
    [5,5,5,5,5,20],//x
    [0,0,0,0,0,0],//y
    ],
};

function callbackFX(type,indexA,indexB,angle){
    var objA = _ENGINE.getObject(indexA);
    var objB = _ENGINE.getObject(indexB);
    switch (type) {
        case AnimateContainer.END_FRAME:
            _ENGINE.setState(indexA,STATE[ID.FX].NEW,objA.x,objA.y);
        break;
        case AnimateContainer.COLLISION:
            if(objB.id == ID.RYU && objA.getValue() != objB.getUniqueID())
            objB.setState(STATE[ID.RYU].GET_BLOW,objB.x,objB.y);
        break;
        case AnimateContainer.COLLISION_RIGHT:
            _ENGINE.deleteObject(indexA);
        break;
    }    
}