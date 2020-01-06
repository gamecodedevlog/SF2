const NO_SOUND=-1; 

class GAudio {
    constructor(){}

    static set callback(CB){this.CB = CB};
    static get callback(){return this.CB};
    static set isOn(isAudioOn){this.isAudioOn = isAudioOn};
    static get isOn(){return this.isAudioOn};

    static loadSoundFile(callback){
        GAudio.callback = callback;
        GAudio.isOn = true;
        
        this.soundCount = 0;
        for(var i = 0; i<SOUND.length; i++){
            SOUND[i] = new Array(OBJECT[i].SOUND);

            for(var j =0; j<SOUND[i].length; j++){
                this.soundCount++;
            }
        }

        if(this.soundCount == 0){
            GAudio.callback(GEngine.END_FILE,count);
            return;
        }

        //log("GAudio.loadSoundFile() : " + this.soundCount);
        var count = 0;
        var soundMaxCount = this.soundCount;
        for(var i = 0; i<SOUND.length; i++){
            for(var j =0; j<SOUND[i].length; j++){
                SOUND[i][j] = new Audio("./Sound/" + i + "/" + j + ".mp3");
                SOUND[i][j].loop = false;

                SOUND[i][j].addEventListener('canplaythrough', function() { 
                    GAudio.callback(GEngine.NEXT_FILE,count++);
                    if(soundMaxCount == count)GAudio.callback(GEngine.END_FILE,count);
                 }, false);

                //log("SOUND[" + i + "][" + j + "] : " + SOUND[i][j].src);
            }
        } 
    }

    getSoundCount(){
        return this.soundCount;
    }
}