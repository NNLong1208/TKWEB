var pageTime = 0,
    domTime = 0,
    serverTime = 0;
var connectionType = {
    'domTime': "",
    'pageTime': "",
    'type': "",
    'downlink': "",
    'round-trip time': "",
    'downlinkMax': "",
    'effectiveType': "",
    'effective_bandwidth_estimate': "",
    'rtt': "",
    'device': ""
};
var text = "";

function sendPageSpeedData(appendUrl = false) {
    var timingPerformance = checkWhetherBrowserSupportPerformance();
    if (typeof timingPerformance !== undefined && timingPerformance !== null) {
        domTime = domLoadTime(timingPerformance);
        serverTime = serverResponseTime(timingPerformance);
        logNetworkInfo();
        setTimeout(function() {
            pageTime = pageLoadTime(timingPerformance);
            connectionType.timing = JSON.stringify(timingPerformance);
            connectionType.pageTime = pageTime;
            connectionType.domTime = domTime;
            connectionType.serverTime = serverTime;

            if (appendUrl !== false)
                connectionType.appendUrl = appendUrl;

            var url = "/pagespeed/client";
            $.ajax(url, {
                data: connectionType,
                success: function() {},
                error: errorHandler,
                type: "POST"
            });
            return false;
        }, 2000);
    }
}

function checkWhetherBrowserSupportPerformance() {
    var timingPerformance = null;
    var performance = window.performance;
    if (typeof performance !== "undefined" && performance !== null) {
        var timing = performance.timing;
        if (typeof timing !== undefined && timing !== null) {
            timingPerformance = timing;
        }
    }
    return timingPerformance;
}

function domLoadTime(timing) {
    var start = timing.domLoading;
    var end = timing.domContentLoadedEventEnd;
    return (end - start) / 1000;
}

function serverResponseTime(timing) {
    var start = timing.responseStart;
    var end = timing.responseEnd;
    return (end - start) / 1000;
}

function pageLoadTime(timing) {
    var start = timing.fetchStart;
    var end = timing.loadEventEnd;
    return (end - start) / 1000;
}

function logNetworkInfo() {
    if (typeof isMobile !== 'undefined') {
        if (isMobile === '1') {
            if (typeof navigator.connection !== 'undefined' && navigator.connection !== null) {
                connectionType.type = navigator.connection.type;
                connectionType.effective_bandwidth_estimate = navigator.connection.downlink;
                connectionType.rtt = navigator.connection.rtt + 'ms';
                connectionType.downlinkMax = navigator.connection.downlinkMax;
                connectionType.effectiveType = navigator.connection.effectiveType;
                connectionType.downlink = "";
            }
            connectionType.device = "mobile";
        } else {

            connectionType.type = 'wifi/lan';
            connectionType.device = "desktop";
        }
    } else {
        connectionType.type = 'NA';
        connectionType.device = "NA";
    }
    alternateSpeedCheck();
}

function alternateSpeedCheck() {

    var startTime, endTime;
    startTime = (new Date()).getTime();
    var downloadSize = 17.6 * 1024;
    var imageAddr = "https://trainings.internshala.com/static/images/track.jpg" + "?nnn=" + startTime;
    var download = new Image();
    download.onload = function() {
        endTime = (new Date()).getTime();
        var duration = (endTime - startTime) / 1000;
        var bitsLoaded = downloadSize * 8 * 1;
        var speedBps = Math.round(bitsLoaded / duration);
        var speedKbps = (speedBps / 1024).toFixed(2);
        var speedMbps = (speedKbps / 1024).toFixed(2);
        connectionType.downlink = speedMbps;
    };
    download.src = imageAddr;
}

window.onload = sendPageSpeedData();