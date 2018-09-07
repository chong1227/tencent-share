import EventEmitter from 'events';

export default class VideoAppShare extends EventEmitter {
    constructor(options) {
        
    }

    ready(){
        if (typeof window === 'undefined') {
            return Promise.reject(new Error('window not found'));
        }
        if (typeof window.TenvideoJSBridge !== 'undefined') {
            return Promise.resolve(this);
        }
        if (this.__isReady) {
            return Promise.resolve(this);
        }

        return new Promise((resolve, reject) => {
            // this.__readyListener.push(() => resolve(this));
            const callback = () => {
                this.__isReady = true;
                resolve(this);
            }
            document.addEventListener('onTenvideoJSBridgeReady', callback, false);
        });
    }

    async setShareInfo(options={}){
        await this.ready();
        var params = {
            "hasRefresh":true, 
            "hasShare":true, 
            "shareInfo":{
                "title":options.title, 
                // "subTitle":shareData.desc, 
                "singleTitle":options.title,
                "content":options.desc,
                'contentTail':options.title,
                "imageUrl":options.img, 
                "url":options.link 
            }
        };
    
        TenvideoJSBridge.invoke("setMoreInfo", params, function(res) {
            // var ss = JSON.parse(res);
        });
    }
}