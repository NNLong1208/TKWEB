function error_notification(message) {
    var content = "<div>" + message + "</div>";
    $("#error_notification").show().html(content).slideDown(500);
    var delay = 6000;
    setTimeout(function() {
        $("#error_notification").slideUp(300);
    }, delay);
}

function errorHandler(e) {
    try {
        if (e.status == 599) {
            var response = {};
            if (typeof e.data == "undefined" && typeof e.responseText != "undefined") {
                response = JSON.parse(e.responseText);
            } else {
                response = e.data;
            }
            if (response.code == 599 && response.message == 'redirect' && typeof response.url != "undefined") {
                var url = encodeURIComponent(response.url);
                $.ajax("/ddos/index/ajax_" + url, {
                    data: {},
                    success: function() {},
                    error: function() {},
                    type: "POST"
                });
                return false;
            }
        } else if (e.status == 403) {
            error_notification('You do not have access to this resource');
        } else if (e.status == 0) {
            console.log('xhr cancelled');
        } else if (e.customMessage) {
            error_notification(e.customMessage);
        } else {
            error_notification('Please try again after some time!')
        }
    } catch (ex) {
        error_notification('Please try again after some time!')
    }
}