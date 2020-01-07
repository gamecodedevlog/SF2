let ID;
let OBJECT;
let IMAGE;
let SOUND;
let STATE;
let ENGINE;

class GEngine {
    static get END_FILE(){return 0;};
    static get NEXT_FILE(){return 1;};

    static get KEY_LEFT(){return 37;};
    static get KEY_UP(){return 38;};
    static get KEY_RIGHT(){return 39;};
    static get KEY_DOWN(){return 40;};
    static get KEY_SPACE(){return 32;};
    static get KEY_ALT(){return 18;};
    static get KEY_A(){return 65;};
    static get KEY_S(){return 83;};
    static get KEY_1(){return 49;};
    static get KEY_2(){return 50;};
    static get KEY_3(){return 51;};

    static set loopCallback(loopCB){this.loopCB = loopCB};
    static get loopCallback(){return this.loopCB};

    static set callback(CB){this.CB = CB};
    static get callback(){return this.CB};

    static set LOOP_TIME(loopTime){this.loopTime = loopTime};
    static get LOOP_TIME(){return this.loopTime};

    static set engine(eng){this.eng = eng};
    static get engine(){return this.eng};

    static loadObjectFile(IDArray){
        ID = new Enum(IDArray);
        OBJECT = new Array(ID.length);
        IMAGE = new Array(ID.length);
        SOUND = new Array(ID.length);
        STATE = new Array(ID.length);

        //log("GEngine.loadObjectFile() OBJECT : " + ID.length);
        for(var i =0; i<ID.length; i++){
            var jscript = document.createElement('script');
            jscript.type = 'text/javascript';
            jscript.src = "./Object/" + i + ".js";
            document.head.appendChild( jscript );
            //log("OBJECT [" + i +"] : " +jscript.src);
        }
        GEngine.engine = new GEngine(new AnimateContainer());
        return GEngine.engine;
    }

    constructor(animateContainer) {
        this.LOOP_TIME = 1000;
        this.canvas = document.createElement( 'Canvas' );
        this.bufferCanvas = document.createElement( 'Canvas' );

        this.context= this.canvas.getContext('2d');
        this.bufferContext= this.bufferCanvas.getContext('2d');

        this.scale =0;
        this.animateContainer = animateContainer;
    }

    setCanvas(x,y,width,height){
        this.canvas.width=width;
        this.canvas.height=height;
        this.bufferCanvas.width=width;
        this.bufferCanvas.height=height;

        this.canvas.style.position = 'absolute';
        this.canvas.style.left = x;
        this.canvas.style.top = y;
        this.canvas.style.backgroundColor='white';
        this.canvas.style.margin  = '0 auto';

        this.setScale(width * 0.00196);
        return this;
    }
    
    setCanvas3D(transform,perspective){
        this.canvas.style.transform ='rotateX(' +transform +'deg)';
        document.body.style.perspective=perspective +"px";
        document.body.style.transformStyle = 'preserve-3d';
        return this;
    }

    setRatioCanvas(rH,rV){
        var w = 0;
        var h = 0;
        while (w <= window.innerWidth && h <=window.innerHeight){
            w+=rH;
            h+=rV;
        }
        var x= (window.innerWidth - w)/2;
        var y= (window.innerHeight - h)/2;
        this.setCanvas(x,y,w,h);
        return this;
    }

    setResizeCallback(){
        window.addEventListener('resize', function(event){
            GEngine.engine.setRatioCanvas(4,3);
            GEngine.engine.animateContainer.setCollisonArray(COLLISION_DATA);

            var aniCon = GEngine.engine.animateContainer;
            aniCon.drawCollisionArray(GEngine.engine.bufferContext,COLLISION_DATA,IMAGE[ID.BG],aniCon.getUnitWidth(),aniCon.getUnitHeight());
        });
        window.dispatchEvent(new Event('resize'));
    }

    appendBodyChild(){   
        for(var i =0; i<OBJECT.length; i++){
            STATE[i] = new Enum(Object.keys(OBJECT[i]));
        }
        document.body.style.overflow = 'hidden';
        document.body.style.margin  = '0 auto';
        document.body.style.backgroundColor='black';

        document.body.appendChild(this.canvas);
        return this;
    }

    appendDivChild(id){
        var div = document.getElementById(id); 
        div.appendChild(this.canvas);
        return this;
    }

    getCanvas(){
        return this.canvas;
    }

    getBufferCanvas(){
        return this.bufferCanvas;
    }

    getContext(){
        return this.context;
    }

    getBufferContext(){
        return this.bufferContext;
    }

    getImageCount(){
        return this.imageCount;
    }

    setScale(scale){
        this.scale = scale;
        return this;
    }

    getScale(){
        return this.scale;
    }
    
    loadImageFile(callback){
        this.appendBodyChild();

        this.imageCount = 0;
        for(var i = 0; i<IMAGE.length; i++){
            IMAGE[i] = new Array(OBJECT[i].IMG);

            for(var j =0; j<IMAGE[i].length; j++){
                this.imageCount++;
            }
        }
        //log("GEngine.loadImageFile() IMAGE : " + this.imageCount);
        var count = 0;
        var imgMaxCount = this.imageCount;
        for(var i = 0; i<IMAGE.length; i++){
            for(var j =0; j<IMAGE[i].length; j++){
                IMAGE[i][j] = new Image();
                IMAGE[i][j].src =  "./Image/" + i + "/" + j + ".png";
                IMAGE[i][j].onload = function () {
                    callback(GEngine.NEXT_FILE,count++);   
                    if(imgMaxCount == count+1){
                        GAudio.loadSoundFile(function (type, index) {
                            callback(GEngine.NEXT_FILE,count++);
                            if(GEngine.END_FILE == type){
                                callback(GEngine.END_FILE,count);

                                GEngine.engine.setResizeCallback();
                            }
                        });
                    }
                }
                //log("IMAGE[" + i + "][" + j + "] : " + IMAGE[i][j].src);
            }
        }

        this.startTimeLoop(60,function(){
            GEngine.engine.drawNextFrame();
        });
        return this;
    }

    draw(){
        this.context.drawImage(this.bufferCanvas, 0, 0);
    }
    startTimeLoop(loop_time,callback){
        GEngine.LOOP_TIME = loop_time;
        GEngine.loopCallback = callback;
        GEngine.loop();
        return this;
    }

    static loop(){
        var start = new Date().getTime();
        GEngine.loopCallback();
        var delay = new Date().getTime() - start ;
        setTimeout(GEngine.loop, GEngine.LOOP_TIME - delay);
    }

    newObject(id,state,x,y){
        return this.animateContainer.newObject(id,state,x,y);
    }

    setState(index,state,x,y){
        return this.animateContainer.setState(index,state,x,y);
    }

    drawNextFrame(){
        this.animateContainer.drawNextFrame(this);
        return this.animateContainer;
    }

    getObject(index){
        return this.animateContainer.objectArray[index];
    }

}