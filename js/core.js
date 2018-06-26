
function getJSON(url, cb) {
    var xmlhttp = new XMLHttpRequest();
    var onError = ons.notification.alert.bind(ons.notification, {
        message: 'Je bent niet verbonden met de server. De gegevens die worden weergegeven zijn mogelijk verouderd.',
    });

    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status == 200) {
                var myArr = JSON.parse(this.responseText);
                cb(JSON.parse(this.responseText));
            } else {
                onError();
            }
        }
    };
    xmlhttp.onerror = onError;
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}


function _promise() {
    var done = false;
    var res = undefined;
    var cbs = [];
    var d = function(result) {
        done = true;
        res = result; 
        for(var i = 0; i < cbs.length; i++) cbs[i](result);
    }
    d.then = function(cb) {
        if (done) cb(res);
        else cbs.push(cb);
    }
    return d;
}
