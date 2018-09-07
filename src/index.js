import {os} from './components/common';
import WeixinShare from './components/weixin';
import MqqShare from './components/mqq';
import NewsShare from './components/news';
import VideoShare from './components/video';
import OtherShare from './components/other';

export default class Share {
    constructor(options={}, type){
        if( !this.instance ){
            if( os.qqnews ){
                this.instance = new NewsShare();
            }else if( os.weixin ){
                this.instance = new WeixinShare();
            }else if( os.qq ){
                this.instance = new MqqShare();
            }else if( os.tenvideo ){
                this.instance = new VideoShare();
            }else{
                this.instance = new OtherShare();
            }
        }

        if( Object.keys(options).length ){
            this.setShareInfo(options, type);
        }
    }

    __invoke(fn, ...args){
        if( this.instance && this.instance[fn] ){
            this.instance[fn](...args);
        }
    }

    on(fn, callback){
        if( this.instance ){
            this.instance.on(fn, result=>callback(result));
        }
        return this;
    }

    // 设置分享信息    
    setShareInfo(options={}, type){
        this.__invoke('setShareInfo', options, type);
        return this;
    }

    setShareInWx(options={}, type){
        if( os.weixin ){
            this.__invoke('setShareInfo', options, type);
            return this;
        }
    }

    setShareInQQ(options={}){
        if( os.qq ){
            this.__invoke('setShareInfo', options);
            return this;
        }
    }

    setShareInNews(options={}){
        if( os.qqnews ){
            this.__invoke('setShareInfo', options);
            return this;
        }
    }

    setShareInVideo(options={}){
        if( os.tenvideo ){
            this.__invoke('setShareInfo', options);
            return this;
        }
    }

    // 显示分享窗口
    show(){
        this.__invoke('show');
        return this;
    }

    // 禁止分享
    forbidShare(){
        this.__invoke('forbidShare');
        return this;
    }
};
