import EventEmitter from 'events';
import { getScript, os } from './common';

const fnBindContext = (fn, { context = null } = {}) => {
    return (...args) => {
        return new Promise((resolve, reject) => {
            fn.bind(context)(...args, (result) => {
                resolve(result)
            });
        })
    }
}

class WeixinShare extends EventEmitter {
    constructor() {
        super();

        this.isReady = false;
        this.__readyListener = [];
        if (typeof window.WeixinJSBridge !== 'undefined') {
            this.isReady = true;
        } else {
            const callback = () => {
                this.isReady = true;
                while (this.__readyListener.length) {
                    this.__readyListener.shift()();
                }
            }

            document.addEventListener('WeixinJSBridgeReady', callback, false);
        }
    }

    ready() {
        if (typeof window === 'undefined') {
            return Promise.reject(new Error('window not found'));
        }
        if (typeof window.wx !== 'undefined' || typeof WeixinJSBridge !== 'undefined') {
            return Promise.resolve(this);
        }
        if (this.isReady) {
            return Promise.resolve(this);
        }
        return new Promise((resolve, reject) => {
            this.__readyListener.push(() => resolve(this));
        });
    }

    async __invoke(...args) {
        await this.ready();
        if (!this.__invokeFn) {
            const originInvoke = window.WeixinJSBridge.invoke
            window.WeixinJSBridge.__invoke = function (...args) {
                const invokeBurned = window.WeixinJSBridge.invoke;
                window.WeixinJSBridge.invoke = originInvoke;
                window.WeixinJSBridge.invoke(...args);
                window.WeixinJSBridge.invoke = invokeBurned;
            }

            this.__invokeFn = fnBindContext(WeixinJSBridge.__invoke, {
                context: WeixinJSBridge
            });
        }
        return this.__invokeFn(...args);
    }

    async __on(...args) {
        await this.ready();
        if (!this.__onFn) {
            // this.__onFn = (...argv) => {
            //     return new Promise((resolve, reject) => {
            //         WeixinJSBridge.on(...argv, (result) => resolve(result));
            //     })
            // };
            const originOn = window.WeixinJSBridge.on;
            window.WeixinJSBridge.__on = function (...args) {
                const burnedOn = window.WeixinJSBridge.on;
                window.WeixinJSBridge.on = originOn;
                window.WeixinJSBridge.on(...args);
                window.WeixinJSBridge.on = burnedOn;
            }
            this.__onFn = window.WeixinJSBridge.__on;
        }
        return this.__onFn(...args);
    }

    // 分享给朋友
    __share4Friends(options) {
        const eventData = { source: 'weixin', target: 'friend' };
        const self = this;

        this.__on('menu:share:appmessage', () => {
            this.emit('share', eventData);
            this.__invoke('sendAppMessage', options)
                .then(({ err_msg }) => {
                    switch (err_msg) {
                        case 'send_app_msg:confirm':
                        case 'send_app_msg:ok':
                            self.emit('success', eventData);
                            break;
                        case 'send_app_msg:cancel':
                            self.emit('cancel', eventData);
                            break;
                        default:
                            console.error(`WeixinShare.setShareInfo2Friend: unknown err_msg=${err_msg}`);
                            break;
                    }
                })
        });
    }

    // 分享到朋友圈
    __share4Timeline(options) {
        const eventData = { source: 'weixin', target: 'timeline' };
        const self = this;

        this.__on('menu:share:timeline', () => {
            this.emit('share', eventData);

            this.__invoke('shareTimeline', options)
                .then(({ err_msg }) => {
                    switch (err_msg) {
                        case 'share_timeline:ok':
                            this.emit('success', eventData);
                            break;
                        case 'share_timeline:cancel':
                            this.emit('cancel', eventData);
                            break;
                        default:
                            console.error(`WeixinShare.share4Timeline: unknown err_msg=${err_msg}`);
                            break;
                    }
                })
        });
    }

    // 分享给QQ好友
    // 分享给QQ好友时无论是成功分享还是中途取消，都会返回ok状态
    __share4QQ(options) {
        const eventData = { source: 'weixin', target: 'qq' };
        const self = this;

        this.__on('menu:share:qq', () => {
            this.emit('share', eventData);

            this.__invoke('shareQQ', options)
                .then(({ err_msg }) => {
                    switch (err_msg) {
                        case 'shareQQ:ok':
                            this.emit('success', eventData);
                            break;
                        default:
                            console.error(`WeixinShare.share4QQ: unknown err_msg=${err_msg}`);
                            break;
                    }
                })
        });
    }

    // 分享到QQ空间
    // 与分享给QQ好友相似，分享给QQ空间时无论是成功分享还是中途取消，都会返回ok状态
    __share4QZone(options) {
        const eventData = { source: 'weixin', target: 'qzone' };
        const self = this;

        this.__on('menu:share:QZone', () => {
            this.emit('share', eventData);
            this.__invoke('shareQZone', options)
                .then(({ err_msg }) => {
                    switch (err_msg) {
                        case 'shareQZone:ok':
                            this.emit('success', eventData);
                            break;
                        default:
                            console.error(`WeixinShare.share4QZone: unknown err_msg=${err_msg}`);
                            break;
                    }
                })
        });
    }

    setShareInfo(options, type) {
        const shareData = {
            title: options.title || 'test',
            desc: options.desc || '',
            link: options.link || document.location.href,
            appid: options.appid || '',
            img_url: options.img || '',
            img_width: '120',
            img_height: '120'
        };

        switch (type) {
            case 'timeline': {
                this.__share4Timeline(shareData);
                break;
            }
            case 'friends': {
                this.__share4Friends(shareData);
                break;
            }
            case 'qq': {
                this.__share4QQ(shareData);
                break;
            }
            case 'qzone': {
                this.__share4QZone(shareData);
                break;
            }

            default: {
                this.__share4Friends(shareData);
                this.__share4Timeline(shareData);
                this.__share4QQ(shareData);
                this.__share4QZone(shareData);
            }
        }
    }

    // 禁止分享
    forbidShare() {
        this.__invoke('hideOptionMenu', {})
            .then(res => console.log(res))
    }
}

export default WeixinShare;