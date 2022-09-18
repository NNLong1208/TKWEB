window.sendTrackRequest = function() {
    var xHttp = new XMLHttpRequest();
    xHttp.open('POST', '/home/track', true);
    xHttp.send();
}

window.sendTrackRequest();