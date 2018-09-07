import EventEmitter from 'events';

export default class OtherShare extends EventEmitter {
    constructor() {
        super();
    }

    setShareInfo(options){
        const shareData = {
            title: options.title,
            desc: options.desc,
            share_url: options.link,
            image_url: options.img,
            back: true // 是否返回到当前页
        };
        // console.error( new Error('not function supported') );
    }
}