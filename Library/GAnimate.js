var COLLISION_DATA = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ];

class Animate{
    static set callbackSound(callbackSound){this.callbackSound = callbackSound};
    static get callbackSound(){return this.callbackSound};

    constructor(id,object,state,x,y){
        this.id = id;
        this.object = object;
        this.state = state;
        this.x = x;
        this.y = y;
        this.value = 0;
        this.uniID = getUniqueID();
        
        this.objectState = Object.values(object)[state];
        this.glint = 0;
        this.w = 0;
        this.pre_w = 0;
        this.h = 0;
        this.index =0;
        this.reverseX = 1;
        this.reverseY = 1;
        this.reverseImg = 1;
        this.isAniLoop = true;

        this.callback = function(){};

        this.nextState = null;
    }

    nextFrame(ani_index){
        if(isEmpty(this.objectState))return;
        if(this.index < this.objectState[0].length-1){
            this.index++;
        }else{
            this.index=0;
            if(!isEmpty(this.nextState)){
                this.setState(this.nextState,this.x,this.y);
                this.nextState = null;
            }
            else if(!isEmpty(this.callback))this.callback(AnimateContainer.END_FRAME,ani_index);
        }
        if(!isEmpty(this.callback))this.callback(AnimateContainer.NEXT_FRAME,ani_index);
        if(this.glint > 0){
            this.glint--;
        }
    }
    
    setValue(value){
        this.value = value;
        return this;
    }

    setAniLoop(bool){
        this.isAniLoop = bool;
        return this;
    }

    setState(state,x,y){
        this.x = x;
        this.y = y;
        this.state = state;
        this.nextState = null;
        this.index = 0;
        this.objectState = Object.values(this.object)[state];

        if(GAudio.isOn == false)return this;
        if(this.objectState[1][0] != NO_SOUND){
            var sound = SOUND[this.id][this.objectState[1][0]];
    
            if(!isEmpty(sound)& GAudio.isOn){
                //sound.currentTime = 0;
                sound.play();
            }
        }

        return this;
    }

    setNextState(state){
        this.nextState = state;
        return this;
    }

    setGlint(glint){
        this.glint = glint;
        return this;
    }

    setReverseX(reverse){
        this.reverseX = reverse;
        this.reverseImg = reverse;
        return this;
    }

    getReverseX(){
        return this.reverseX;
    }

    setCallback(callback){
        this.callback = callback;
        return this;
    }

    getUniqueID(){
       return this.uniID; 
    }

    setValue(value){
        this.value= value;
    }

    getValue(){
        return this.value;
    }
}

class AnimateContainer{
    static get END_FRAME(){return 0;};
    static get NEXT_FRAME(){return 1;};
    static get COLLISION(){return 2;};
    static get COLLISION_LEFT(){return 3;};
    static get COLLISION_RIGHT(){return 4;};
    static get COLLISION_UP(){return 5;};
    static get COLLISION_DOWN(){return 6;};
    static get SOUND_ENDED (){return 7;};
    constructor(){
        this.collision = new GCollision();
        this.objectArray = new Array(0);
        this.newObjectArray = new Array(0);
        
        this._unitW = 0;
        this._unitH = 0;
        this.collisionArray =0;
        this.indexStartXCollisionArray = 0;
        this.indexStartYCollisionArray = 0;

        this.engine;
    }

    checkCollision(){
        for (var i = 0; i < this.objectArray.length; i++) {
            for (var j = 0; j < this.objectArray.length; j++) {
                if(i == j)continue;
                if(isEmpty(this.objectArray[i]))continue;
                if(isEmpty(this.objectArray[j]))continue;
                if(this.collision.hitRectangle(this.objectArray[i],this.objectArray[j])){
                    var w = this.objectArray[i].w / 2;
                    var h = this.objectArray[i].h / 2;
                    var w2 = this.objectArray[j].w / 2;
                    var h2 = this.objectArray[j].h / 2;
                    var angle = this.collision.getAngle(this.objectArray[i].x +w,this.objectArray[i].y + h,this.objectArray[j].x + w2,this.objectArray[j].y + h2);
                    this.objectArray[i].callback(AnimateContainer.COLLISION,i,j,angle); 
                }
            }  
        }
    }

    drawNextFrame(engine){
        this.engine = engine;
        engine.context.drawImage(engine.bufferCanvas, 0, 0);
        for (var index = 0; index < this.objectArray.length; index++) {
            this.objectArray[index].nextFrame(index);
            if(this.objectArray[index].index == 0 & this.objectArray[index].isAniLoop == false){
                this.deleteObject(index);
                continue;
            }

            var element = this.objectArray[index];
            if(isEmpty(element))continue;
            var image = IMAGE[element.id][Math.abs(element.objectState[0][element.index])];
            if(isEmpty(image))continue;

            element.pre_w = element.w;

            element.w = image.width;
            element.h = image.height;
            var tmpx= element.x;
            element.x += element.objectState[2][element.index] * element.reverseX;
            element.y += element.objectState[3][element.index] * element.reverseY;

            var idx_X_1=parseInt((element.x) /this._unitW) + this.indexStartXCollisionArray;
            var idx_X_2=parseInt((element.x + element.w) /this._unitW) + this.indexStartXCollisionArray;
            var idx_Y=parseInt((element.y + element.h) /this._unitH) + this.indexStartYCollisionArray;

            if( idx_Y > 1 & !isEmpty(element.objectState[4])){
                if(this.collisionArray[idx_Y-1][idx_X_1] != 0 ){
                    if(element.objectState[4][element.index] !=0)
                    if(tmpx >= element.x){
                        element.x = tmpx +5;
                        this.objectArray[index].callback(AnimateContainer.COLLISION_LEFT,index); 
                    }
                }
                if(this.collisionArray[idx_Y-1][idx_X_2] != 0 ){
                    if(element.objectState[4][element.index] !=0)
                    element.x = tmpx-5;
                
                    this.objectArray[index].callback(AnimateContainer.COLLISION_RIGHT,index); 
                }
            }

            var idx_X_1_10=parseInt((element.x+10) /this._unitW) + this.indexStartXCollisionArray;
            var idx_X_2_10=parseInt((element.x+element.w-10) /this._unitW) + this.indexStartXCollisionArray;
            
            if(!isEmpty(element.objectState[4])){
                if(idx_Y <this.collisionArray.length -1){
                    element.y += element.objectState[4][element.index];
                    if(!isEmpty(this.collisionArray)){
                        if(this.collisionArray[idx_Y][idx_X_1_10] != 0 |
                            this.collisionArray[idx_Y][idx_X_2_10] != 0){
                            element.y = ((idx_Y) * this._unitH)-element.h;

                            this.objectArray[index].callback(AnimateContainer.COLLISION_DOWN,index); 
                        }
                    }
                }else{
                    element.y = ((idx_Y-this.indexStartYCollisionArray) * this._unitH)-element.h;
                }
            }

            if(element.y < 0){
                element.y = idx_Y * this._unitH;
                this.objectArray[index].callback(AnimateContainer.COLLISION_UP,index);
            }

            engine.context.save();
            engine.context.scale(engine.scale, engine.scale);  
            
            if(element.glint != 0){
                if((element.glint % 2)==0)
                engine.context.globalAlpha = 0.1;
                else engine.context.globalAlpha = 1.0;
            }

            if(element.objectState[0][element.index] * element.reverseImg >= 0)
            engine.context.drawImage(image, element.x , element.y);
            else{
                element.x +=  element.pre_w - element.w;
                this.flipHorizontally(image, element.x , element.y);
            }
                
            engine.context.restore();
        }
        this.checkCollision();
    }
   
    newObject(id,state,x,y){
        var index =this.objectArray.push(new Animate(id,OBJECT[id],state,x,y))-1;

        if(GAudio.isOn == false)return this.getObject(index);

        if(this.objectArray[index].objectState[1][0] != NO_SOUND){
            var sound = SOUND[id][this.objectArray[index].objectState[1][0]];
            if(!isEmpty(sound) & GAudio.isOn){
                sound.currentTime = 0;
                sound.play();
            }
        }
        return this.getObject(index);
    }

    setState(index,state,x,y){
        this.objectArray[index].setState(state,x,y);

        if(GAudio.isOn == false)return this;
        if(this.objectArray[index].objectState[1][0] != NO_SOUND){
            var sound = SOUND[this.objectArray[index].id][this.objectArray[index].objectState[1][0]];
    
            if(!isEmpty(sound)& GAudio.isOn){
                //sound.currentTime = 0;
                sound.play();
            }
        }

        return this;
    }

    setNextState(index,state){
        this.setState(index,state,this.objectArray[index].x,this.objectArray[index].y);
        return this;
    }
    
    deleteObject(index){
        this.objectArray[index].callback = function(){};
        this.objectArray.splice(index,1);
        return this;
    }

    deleteAllObject(id){
        var count = -1;
        for (var index = 0; index < this.objectArray.length; index++) {
            if(this.objectArray[index].id == id)this.deleteObject(index);
            count++;
        }
        return count;
    }

    setScale(scale){
        this.scale = scale;
        return this;
    }
    
    getObject(index){
        return this.objectArray[index];
    }
    
    setGlint(index,glint){
        this.objectArray[index].setGlint(glint);
        return this;
    }

    getIndex(id){
        for (var index = 0; index < this.objectArray.length; index++) {
            var element = this.objectArray[index];
            if(id == element.id)return index;
        }
    }

    getCount(id){
        var count = 0;
        for (var index = 0; index < this.objectArray.length; index++) {
            if(id == this.objectArray[index].id)count++;
        }
        return count;
    }

    flipHorizontally(img,x,y){     
        this.engine.context.translate(x+img.width,y);
        this.engine.context.scale(-1,1);
        this.engine.context.drawImage(img,0,0);
        this.engine.context.setTransform(1,0,0,1,0,0);
    }

    flipVertically(img,x,y){
        this.context.translate(x,y+img.height);
        this.context.scale(1,-1);
        this.context.drawImage(img,0,0);
        this.engine.context.setTransform(1,0,0,1,0,0);
    }
    
    setCollisonArray(collisionArray){
        this.setScale(this.engine.getScale());
        this.collisionArray = collisionArray;
        this._unitW = (this.engine.canvas.width / this.collisionArray[0].length)/this.engine.scale;
        this._unitH = (this.engine.canvas.height / this.collisionArray.length)/this.engine.scale;
        return this;
    }

    setIndexStartXCollisonArray(index){
        this.indexStartXCollisionArray = index;
        return this;
    }

    setIndexStartYCollisonArray(index){
        this.indexStartYCollisionArray = index;
        return this;
    }

    getUnitWidth(){
        return this._unitW;
    }

    getUnitHeight(){
        return this._unitH;
    }

    allAddXY(x,y){
        for (var index = 0; index < this.objectArray.length; index++) {
            var element = this.objectArray[index];
            element.x +=x;
            element.y +=y;
        }
        return this;
    }

    setCanvas(canvas){
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        return this;
    }

    setBufferCanvas(canvas){
        this.bufferCanvas = canvas;
        this.bufferContext = canvas.getContext('2d');
        return this;
    }

    setEngine(engine){
        this.engine = engine;
        this.setCanvas(engine.getCanvas());
        this.setBufferCanvas(engine.getBufferCanvas());
        return this;
    }
  
    drawMap(context,map,image,sizeW,sizeH){
        var W = sizeW *this.scale;
        var H = sizeH *this.scale;
        var maxY = map.length - this.indexStartYCollisionArray;
        for(var y=0; y<maxY; y++) {
            for(var x=0; x<map[0].length- this.indexStartXCollisionArray; x++) {
                context.drawImage(image[map[y+this.indexStartYCollisionArray][x+this.indexStartXCollisionArray]] , x * W, y * H, W, H);
            }
        }
        return this;
    }

    drawGrid(context,map,sizeW,sizeH){
        var W = sizeW *this.scale;
        var H = sizeH *this.scale;
        var maxY = map.length - this.indexStartYCollisionArray;
        var minY = map.length < maxY ?map.length:maxY;
        for(var y=0; y<minY; y++) {
            for(var x=0; x<map[0].length- this.indexStartXCollisionArray; x++) {
                context.strokeRect(x * W, y * H, W, H);
                context.fillText("" + map[y +this.indexStartYCollisionArray][x +this.indexStartXCollisionArray], (x * W)+W/2, (y * H)+H/2, 10);
           }
        }
        return this;
    }

    drawCollisionArray(context,map,image,W,H){
        this.drawMap(context,map,image,W,H);
        this.drawGrid(context,map,W,H);
        return this;
    }
}