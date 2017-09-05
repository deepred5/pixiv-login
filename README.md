# pixiv-login
[![npm version](https://img.shields.io/badge/npm-1.0.0-brightgreen.svg)](https://www.npmjs.com/package/pixiv-login)

爬虫模拟Pixiv登录，获取cookie

## Install
```
npm install --save pixiv-login
```

## Usage
```javascript
const pixivLogin = require('pixiv-login');

pixivLogin({
    username: 'your uesrname',
    password: 'your password'
}).then((cookie) => {
    console.log(cookie);
}).catch((error) => {
    console.log(error);
})
```
