import EventEmitter from 'events';
import { getScript, os } from './common';

export default class NewsAppShare extends EventEmitter {
    constructor() {
        super();

        this.__isReady = false;
    }

    // 新闻客户端内的回调
    // iOS客户端提供的 JS API 由客户端注入。页面无需引入或主动加载这些JS文件，客户端会在合适的时机将 JS API 注入到页面中供页面使用
    // iOS客户端里，由于页面执行 客户端注入js 和 页面js 的顺序无法保证，需要在使用 window.TencentNews 对象前，确保客户端提供的 JS API已经处于ready状态
    // Android客户端需要先加载jsapi才能使用 window.TencentNews 这个全局变量
    ready() {
        if (typeof window === 'undefined') {
            return Promise.reject(new Error('window not found'));
        }
        if (typeof window.TencentNews !== 'undefined') {
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
            if (os.android) {
                getScript('//mat1.gtimg.com/www/js/newsapp/jsapi/news.js?_tsid=1', callback, false);
            } else {
                document.addEventListener('TencentNewsJSInjectionComplete', callback, false);
            }
        });
    }

    async __invoke(fn, ...args) {
        await this.ready();

        if (!this.__invokeFn) {
            this.__invokeFn = (func, ...argv) => {
                return new Promise((resolve, reject) => {
                    if (typeof window.TencentNews[func] === 'function') {
                        resolve(window.TencentNews[func](...args));
                    } else {
                        reject(new Error('TencentNews has not function: ' + func));
                    }
                })
            };
        }
        return this.__invokeFn(fn, ...args);
    }

    async __hasFunction(fn) {
        console.log(this.__isReady);
        await this.ready();
        console.log(this.__isReady);

        console.log('start: '+fn);
        if (!this.__hasFn) {
            this.__hasFn = (func) => {
                return new Promise((resolve, reject) => {
                    if (typeof window.TencentNews[func] === 'function') {
                        console.log(func);
                        resolve(this);
                    } else {
                        reject(new Error('TencentNews has not function: ' + func));
                    }
                })
            };
        }
        console.log(fn);
        return this.__hasFn(fn);
    }

    // 获取客户端的版本号
    __getVersion() {
        let _version = 0;

        if (/qqnews/.test(navigator.userAgent.toLocaleLowerCase())) {
            var qqnews_version = navigator.userAgent.toLocaleLowerCase().match(/qqnews\/(\d+\.\d+\.\d+)/)[1].split('.');
            qqnews_version.length == 3 && (_version = parseInt(qqnews_version[0]) * 100 + parseInt(qqnews_version[1]) + parseInt(qqnews_version[2]) / 1000);
        }
        return _version;
    }

    // 设置分享信息
    async setShareInfo({
        title = 'this is title', 
        desc = 'this is description', 
        link = window.locaiton.href, 
        img = 'https://mat1.gtimg.com/news/s/000.png'
    } = {}) {
        await this.ready();
        if( TencentNews.enableSingleH5Share ){
            TencentNews.enableSingleH5Share(1);
        }
        window.TencentNews.setShareArticleInfo(title, title, desc, link, img);
    }

    // 显示分享弹窗
    async show() {
        await this.ready();

        window.TencentNews.showActionMenu();
    }

    // 禁止分享
    async forbidShare() {
        await this.ready();

        if( TencentNews.enableSingleH5Share ){
            TencentNews.enableSingleH5Share(0);
        }

        if(window.TencentNews.setActionBtn){
            window.TencentNews.setActionBtn('0');
        }
    }
}