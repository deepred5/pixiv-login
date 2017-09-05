const axios = require('axios');
const cheerio = require('cheerio');
const querystring = require('querystring');

const LOGIN_URL = 'https://accounts.pixiv.net/login?lang=zh&source=pc&view_type=page&ref=wwwtop_accounts_index';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36';
const LOGIN_API = 'https://accounts.pixiv.net/api/login?lang=zh';


const pixivLogin = ({ username, password }) => {
    return new Promise((resolve, reject) => {
        const getKey = axios({
            method: 'get',
            url: LOGIN_URL,
            headers: {
                'User-Agent': USER_AGENT
            }
        }).then((response) => {
            const $ = cheerio.load(response.data);
            const post_key = $('input[name="post_key"]').val();
            const cookie = response.headers['set-cookie'].join(' ;');

            if (post_key) {
                return { post_key, cookie };
            }
            reject(new Error('no post_key'));
        }).catch((error) => {
            reject(error);
        });

        getKey.then(({ post_key, cookie }) => {
            axios({
                method: 'post',
                url: LOGIN_API,
                headers: {
                    'User-Agent': USER_AGENT,
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Origin': 'https://accounts.pixiv.net',
                    'Referer': 'https://accounts.pixiv.net/login?lang=zh&source=pc&view_type=page&ref=wwwtop_accounts_index',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Cookie': cookie
                },
                data: querystring.stringify({
                    pixiv_id: username,
                    password: password,
                    captcha: '',
                    g_recaptcha_response: '',
                    post_key: post_key,
                    source: 'pc',
                    ref: 'wwwtop_accounts_index',
                    return_to: 'http://www.pixiv.net/'
                })
            }).then((response) => {
                if (response.headers['set-cookie']) {
                    const cookie = response.headers['set-cookie'].join(' ;');
                    resolve(cookie);
                } else {
                    reject(new Error('no cookie'));
                }
                
            }).catch((error) => {
                reject(error);
            });
        });
    })
}

module.exports = pixivLogin;