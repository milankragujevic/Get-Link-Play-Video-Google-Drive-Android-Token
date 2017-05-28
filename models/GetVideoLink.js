/**
 * Created by KSTN-NAM on 24/11/2016.
 */
var fs=require('fs');
var request = require('request');
var cookies_stored = [
    {
        "domain": "accounts.google.com",
        "hostOnly": true,
        "httpOnly": false,
        "name": "GALX",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": true,
        "storeId": "1",
        "value": "koIip4ORi_k",
        "id": 1
    },
    {
        "domain": "accounts.google.com",
        "expirationDate": 1546852980.367847,
        "hostOnly": true,
        "httpOnly": true,
        "name": "GAPS",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "1",
        "value": "1:TnIAlwpABFOIXlO-GsrdSeGGaWBuAg:mKMeFr2N0Ldmr5lo",
        "id": 2
    }
];
var cheerio = require('cheerio');
var headers = {
    //'user-agent': 'Mozilla/5.0 (Windows NT 6.2; WOW64; rv:19.0) Gecko/20100101 Firefox/19.0',
    'user-agent': ' Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:40.0) Gecko/20100101 Firefox/40.0'

};
//var urlFirst = 'https://accounts.google.com/ServiceLogin?service=wise&passive=1209600&continue=https://drive.google.com/%23&followup=https://drive.google.com/&ltmpl=drive&emr=1#identifier';
var urlFirst = 'https://accounts.google.com/ServiceLogin';
var urlSecond = 'https://accounts.google.com/signin/challenge/sl/password';
function redirect(url){
    console.log('111111111 '+url);
    headers['Cookie'] = getStringCookie(cookies_stored);
    var options = {
        url: url,
        method: 'GET',
        headers: headers
    };
    request(options, function (err, res, body) {
        console.log(body);
        var cookies = setCookie.parse(res);
        changeCookie(cookies);
        var redirectLink=(res.headers.location);
        console.log(redirectLink);
        if(redirectLink){
            redirectLink(redirectLink);
        }else{
            //console.log(cookies_stored);
        }
    });
}
function loginGoogle(email, pass) {

    headers['Cookie'] = '';
    var options = {
        url: urlFirst,
        method: 'GET',
        headers: headers
    };
    request(options, function (err, res, body) {
        if (!err) {
            //console.log(res.headers);
            var cookies = setCookie.parse(res);
            changeCookie(cookies);
            console.log(cookies);
            //callback(err,body);
            //console.log(body);
            var $ = cheerio.load(body);
            var childens = $('#gaia_loginform').children();
            var inputs = {};
            var result = '';
            for (var i = 0; i < childens.length; i++) {
                var obj = (childens[i]);
                if (obj.attribs.value) {
                    inputs[obj.attribs.name]=obj.attribs.value;

                    //result+='&'+obj.attribs.name+'='+obj.attribs.value;
                }

            }
            inputs["Email"]=email;
            inputs["Passwd"]=pass;

            headers['Cookie'] = getStringCookie(cookies_stored);
            var options = {
                url: urlSecond,
                method: 'POST',
                form: inputs,
                headers: headers
            };
            console.log(inputs);
            //console.log(headers);
            request(options, function (err, res, body) {
                console.log(err);
                //console.log(JSON.stringify(res));
                var cookies = setCookie.parse(res);
                changeCookie(cookies);
                console.log(cookies);
                var link=(res.headers.location);
                //redirect(link);
              //  run24per7();/
            });
        } else {
            callback(err);
        }

    });
}
function reAsignCookie(name, value) {
    for (var i = 0; i < cookies_stored.length; i++) {
        if (cookies_stored[i].name == name) {
            cookies_stored[i].value = value;
            return;
        }
    }
}
function removeCookieByName(name) {
    for (var i = 0; i < cookies_stored.length; i++) {
        var obj = cookies_stored[i];
        if (obj.name == name) {
            cookies_stored.splice(i, 1);
            return;
        }
    }
}
function addCookie(cookie) {
    var exist = false;
    for (var i = 0; i < cookies_stored.length; i++) {
        var obj = cookies_stored[i];
        if (obj.name == cookie.name) {
            for (var g in cookie) {
                obj[g] = cookie[g];
            }
            //cookies_stored.splice(i, 1);
            exist = true;
            break;
        }
    }
    if (!exist) {
        var obj = cookies_stored[0];
        for (var g in cookie) {
            obj[g] = cookie[g];
        }
        cookies_stored.push(cookie);
    }
}
function changeCookie(setCookie) {
    for (var i = 0; i < setCookie.length; i++) {
        var obj = setCookie[i];
        if (obj.value == 'deleted') {
            removeCookieByName(obj.name);
        } else {
            addCookie(obj);
        }
    }
}
function getStringCookie(cookies_stored) {
    var string_cookies = '';
    for (var i = 0; i < cookies_stored.length; i++) {
        string_cookies += cookies_stored[i].name + '=' + cookies_stored[i].value + ';';
    }
    return string_cookies;
}

var setCookie = require('set-cookie-parser');
function getVideoInfo(fileId, callback) {
    var headers = {
        'authority': 'drive.google.com',
        'method': 'GET',
        'path': '/get_video_info?docid=' + fileId,
        'scheme': 'https',
        //'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        //'Accept-Encoding': 'gzip, deflate, br',
        //'accept-language': 'vi-VN,vi;q=0.8,fr-FR;q=0.6,fr;q=0.4,en-US;q=0.2,en;q=0.2',
        //'alexatoolbar-alx_ns_ph': 'AlexaToolbar/alx-4.0',
        'host': 'drive.google.com',
        //'upgrade-insecure-requests': '1',
        //'user-agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.3.2743.138 Safari/537.36',
        'user-agent': ' Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:40.0) Gecko/20100101 Firefox/40.0'
        //'x-chrome-uma-enabled': '1'
    };
     headers['cookie'] = getStringCookie(cookies_stored);
    
    var options = {
        url: BASE_URL + fileId,
        method: 'GET',
        headers: headers
    };
    request(options, function (err, res, body) {
        if (!err) {
            console.log(res.headers);
            var cookies = setCookie.parse(res);
            changeCookie(cookies);
            callback(err, body);
        } else {
            callback(err);
        }

    });
}
//var BASE_URL='https://docs.google.com/get_video_info?docid=';
// var BASE_URL = 'https://drive.google.com/get_video_info?docid=';
var BASE_URL = 'https://docs.google.com/u/0/get_video_info?authuser=&mobile=true&html5=1&el=embedded&hl=en_US&ps=default&c=WEB&cver=1.20170129&cplayer=UNIPLAYER&cbr=Chrome&cbrver=56.0.2924.76&cos=Windows&cosver=6.3&autoplay=1&iframe=1&docid=';
var MAP_QUANTITY = {
    // 'itag=18': 360,
    // 'itag=22': 720,
    // 'itag=59': 480,
    // 'itag=43': 360,
    // 'itag=37': 1080,
    // 'itag=5': 240
    'itag=18': '360p',
    'itag=22': '720p',
    'itag=59': '480p',
    'itag=43': '360p',
    'itag=37': '1080p',
    'itag=5': '240p'
};
function getQuantiy(url) {
    for (var key in MAP_QUANTITY) {
        if (url.indexOf(key) >= 0) {
            return MAP_QUANTITY[key];
        }
    }
}
function getLinkVideoFromFileIdIPv6(fileId, callback) {
    var fileName='get_video_info?docid='+fileId;
    var commandLine='wget https://docs.google.com/get_video_info?docid='+fileId+'&pli=1';
    exec(commandLine, function (err, stdout, stderr) {
        console.log('11111111111',err);
        if (!err) {
            try {
                var video_info = fs.readFileSync(fileName);
                fs.unlink(fileName,function(){});
                video_info = ((decodeURIComponent(decodeURIComponent(video_info))));
                fs.writeFileSync('video_info.txt',video_info);
                var s1 = 'fmt_stream_map=';
                var s2 = '&fmt_list';
                var i1 = video_info.indexOf(s1);
                var i2 = video_info.indexOf(s2);
                var t = video_info.substring(i1 + s1.length, i2);
                t = t.split('|');
                var candidates = [];
                var check = {};
                for (var i = 0; i < t.length; i++) {
                    var obj = t[i];
                    if (obj.indexOf('https') >= 0) {
                        var quantity = getQuantiy(obj);
                        if (quantity) {
                            if (!check[quantity]) {
                                var m1 = obj.indexOf('/videoplay');
                                var domain = obj.substring(0, m1);
                                //obj=obj.replace('ipbits=24','ipbits=0');
                                //obj=obj.replace('ipbits=8','ipbits=0');
                                //obj=obj.replace('ipbits=0','ipbits=8');
                                obj = obj.substring(0, t[i].length - 3);
                                var link = obj.replace(domain, 'https://redirector.googlevideo.com');
                                console.log(link);
                                candidates.push({link: link, link_extra: obj, quantity: quantity});
                                check[quantity] = true;
                            }

                        }
                    }
                }
                callback(err, candidates);
            } catch (e) {
                callback(e);
            }

        } else {
            callback(err);
        }
    });

}
function getLinkVideoFromFileId(fileId, callback) {
    getVideoInfo(fileId, function (err, video_info) {
        if (!err) {
            try {
                video_info = ((decodeURIComponent(decodeURIComponent(video_info))));
                fs.writeFileSync('video_info.txt',video_info);
                var s1 = 'fmt_stream_map=';
                var s2 = '&fmt_list';
                var i1 = video_info.indexOf(s1);
                var i2 = video_info.indexOf(s2);
                var t = video_info.substring(i1 + s1.length, i2);
                t = t.split('|');
                var candidates = [];
                var check = {};
                for (var i = 0; i < t.length; i++) {
                    var obj = t[i];
                    if (obj.indexOf('https') >= 0) {
                        var quantity = getQuantiy(obj);
                        if (quantity) {
                            if (!check[quantity]) {
                                var m1 = obj.indexOf('/videoplay');
                                var domain = obj.substring(0, m1);
                                //obj=obj.replace('ipbits=24','ipbits=0');
                                //obj=obj.replace('ipbits=8','ipbits=0');
                                //obj=obj.replace('ipbits=0','ipbits=8');
                                obj = obj.substring(0, t[i].length - 3);
                                var iStartdriveId=obj.indexOf('&driveid');
                                var iEnddriveId=obj.indexOf('&',iStartdriveId+1);
                                if(iEnddriveId<0){
                                    iEnddriveId = obj.length;
                                }
                                var needRemove = obj.substring(iStartdriveId,iEnddriveId);
                                obj = obj.replace(needRemove,'');
                                var link = obj.replace(domain, 'https://redirector.googlevideo.com');
                                console.log(link);
                                candidates.push({file: link, label: quantity});
                                check[quantity] = true;
                            }

                        }
                    }
                }
                callback(err, candidates);
            } catch (e) {
                callback(e);
            }

        } else {
            callback(err);
        }
    });
}

function run24per7() {
    getLinkVideoFromFileId('0B1xQLLJtrzJoaWUxUHdqY01mRGM', function (err, links) {
        console.log(err);
        console.log(links);
        fs.writeFileSync('link.txt',JSON.stringify(links));
        //run24per7();
    });
}
//run24per7();
module.exports.getLinkVideoFromFileId = getLinkVideoFromFileId;
module.exports.getLinkVideoFromFileIdIPv6 = getLinkVideoFromFileIdIPv6;
//realDangKy(email);
loginGoogle('2mail.com', '22');

