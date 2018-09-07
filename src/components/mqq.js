import EventEmitter from 'events';
import { getScript, os } from './common';

export default class MqqAppShare extends EventEmitter {
    constructor() {
        super();

        this.isReady = false;
    }

    ready() {
        if (typeof window === 'undefined') {
            return Promise.reject(new Error('window not found'));
        }
        if (typeof window.mqq !== 'undefined') {
            return Promise.resolve(this);
        }
        if (this.isReady) {
            return Promise.resolve(this);
        }
        return new Promise((resolve, reject) => {
            const callback = () => {
                this.isReady = true;
                resolve(this);
            }
            getScript('//open.mobile.qq.com/sdk/qqapi.js?_bid=152', callback);
        });
    }

    async __invoke(modules, fn, ...args) {
        await this.ready();

        if (!this.__invokeFn) {
            this.__invokeFn = (md, func, ...argv) => {
                return new Promise((resolve, reject) => {
                    if (mqq[md] && typeof mqq[md][func] === 'function') {
                        mqq[md][func](...argv, (result) => resolve(result));
                    } else {
                        reject(new Error('no function: ' + md + ', ' + func));
                    }
                })
            };
        }
        console.log( ...args );
        return this.__invokeFn(modules, fn, ...args);
    }

    // 监听
    __monitor(options) {
        let shareType = ['qq', 'qzone', 'friend', 'timeline'],
            eventData = { source: 'qq', target: '' };
        console.log(options);
        this.__invoke('ui', 'setOnShareHandler')
            .then(type => {
                eventData['target'] = shareType[type];
                this.emit('share', eventData);
                
                options['share_type'] = type;
                return this.__invoke('ui', 'shareMessage', options)
                    .then(result => {
                        console.log(result);
                        this.emit('success', eventData, result);
                    })
            })
    }

    __shareInfo(options){
        this.data = options;
        this.__invoke('data', 'setShareInfo', options)
    }

    setShareInfo(options={}) {
        this.__shareInfo({
            title: options.title,
            desc: options.desc,
            share_url: options.link,
            image_url: options.img,
            source_name: 'QQ',
            back: true // 是否返回到当前页
        });
    }

    show() {
        this.__invoke('ui', 'showShareMenu');
        // this.__monitor(this.data);
    }
}