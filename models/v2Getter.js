/**
 * Created by nam on 5/28/2017.
 */
var request = require('request');
var emails = [''];
var passwords = [''];
var deviceIds = [];
var mapEmailTokens = {};
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
function start() {
    function getToken(email, password, deviceId, callback, counter) {
        if (!counter) counter = 0;
        request.post({
            url: 'http://localhost:1337/token',
            method: 'POST',
            json: {
                email: email,
                password: password,
                deviceId: deviceId
            }
        }, function (error, response, body) {
            if (counter > 5) {
                callback(email, {});
            } else {
                if (body && Object.keys(body).length > 0) {
                    callback(email, body);
                } else {
                    getToken(email, password, deviceId, callback, counter++);
                }
            }
        });
    }

    for (var i = 0; i < emails.length; i++) {
        getToken(emails[i], passwords[i], deviceIds[i], function (email, token) {
                console.log(email, token);
                mapEmailTokens[email] = token;
            }
        );
    }

}
function getQuantiy(url) {
    for (var key in MAP_QUANTITY) {
        if (url.indexOf(key) >= 0) {
            return MAP_QUANTITY[key];
        }
    }
}
function getLinkVideoFromFileId(fileId,callback) {
    var rand = Math.floor(emails.length * Math.random());
    var url = 'https://docs.google.com/get_video_info?mobile=true&docid=' + fileId + '&authuser=0';
    var options = {
        url: 'https://docs.google.com/get_video_info?mobile=true&docid=' + fileId + '&authuser=0',
        headers: {
            'Authorization': 'Bearer ' + mapEmailTokens[emails[rand]].Auth,
        }
    }
    console.log(mapEmailTokens[emails[rand]].Auth);
    request.get(options, (err, res, video_info) => {
        if(err){
          return callback(err,[]);
        }
        video_info = ((decodeURIComponent(decodeURIComponent(video_info))));
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
                        obj = obj.substring(0, t[i].length - 3);
                        var link = obj.replace(domain, 'https://redirector.googlevideo.com');
                        candidates.push({file: link, label: quantity});
                        check[quantity] = true;
                    }

                }
            }
        }
        callback(err, candidates);
    });
}
start();
setInterval(()=>{
    start();
},59 * 60 * 1000);

module.exports.getLinkVideoFromFileId = getLinkVideoFromFileId;

setTimeout(() => {
    getLinkVideoFromFileId('0B1BWiY-2aayyZU5sbURIcGlrRUk',function (err,results) {
        console.log(err,results);
    });
}, 2000);