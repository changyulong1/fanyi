"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translate = void 0;
const https = __importStar(require("https"));
const querystring = __importStar(require("querystring"));
const md5 = require("md5");
const private_1 = require("./private");
const errorMap = {
    52001: ' 请求超时',
    52002: '系统错误 ',
    52003: ' 未授权用户',
    54000: ' 必填参数为空',
    54001: '签名错误 ',
    54003: '访问频率受限',
    54004: '账户余额不足',
    54005: '长query请求频繁',
    58000: ' 客户端IP非法',
    58001: '译文语言方向不支持',
    58002: '58002',
    90107: '认证未通过或未生效',
    unknown: '服务器繁忙'
};
const translate = (word) => {
    console.log(word);
    const salt = Math.random();
    const sign = md5(private_1.appid + word + salt + private_1.appSecret);
    let from, to;
    if (/[a-zA-Z]/.test(word[0])) {
        //英翻中
        from = 'en';
        to = 'zh';
    }
    else {
        //中翻英
        from = 'zh';
        to = 'en';
    }
    const query = querystring.stringify({
        q: word, from, to,
        appid: private_1.appid,
        salt, sign
    });
    const options = {
        hostname: 'api.fanyi.baidu.com',
        port: 443,
        path: `/api/trans/vip/translate?` + query,
        method: 'GET'
    };
    const request = https.request(options, (response) => {
        const chunks = [];
        response.on('data', (chunk) => {
            chunks.push(chunk);
        });
        response.on('end', () => {
            const string = Buffer.concat(chunks).toString();
            const object = JSON.parse(string);
            if (object.error_code) {
                console.log(errorMap[object.error_code] || object.error_code);
                process.exit(2);
            }
            object.trans_result.map((time) => {
                console.log(time.dst);
            });
            process.exit(0);
        });
    });
    request.on('error', (e) => {
        console.error(e);
    });
    request.end();
};
exports.translate = translate;
