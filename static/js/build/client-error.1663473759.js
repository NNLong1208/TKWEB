(function() {
    const f = a => {
            const b = new XMLHttpRequest;
            b.open("POST", "/error_log/client_error", !0);
            b.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            b.setRequestHeader("X-CSRF-TOKEN", document.cookie.replace(/(?:(?:^|.*;\s*)csrf_cookie_name\s*=\s*([^;]*).*$)|^.*$/, "$1"));
            b.send(a)
        },
        g = (a, b) => `type=${a}&message=${b}`,
        h = a => "object" === typeof a ? JSON.stringify(a) : a.toString();
    window.onunhandledrejection = ({
        reason: {
            message: a,
            stack: b
        }
    }) => {
        a = (a ? "\nMessage: " + a : "") + (b ? "\nStack:\n" + encodeURIComponent(b) :
            "");
        f(g("javascript", a.trim()))
    };
    window.onerror = (a, b, c, d, e) => {
        a = (a ? "\nMessage: " + a : "") + (b ? "\nURL: " + b : "") + (c ? "\nLine: " + c : "");
        a += d ? "\nColumn: " + d : "";
        a += e ? "\nError: " + e : "";
        f(g("javascript", encodeURIComponent(a.trim())))
    };
    window.logRequestFail = ({
        url: a,
        method: b = null,
        status: c = null,
        response: d = null,
        headers: e = null,
        config: k = null
    }) => {
        a = (a ? "\nURL: " + a : "") + (b ? "\nMethod: " + b.toUpperCase() : "");
        a = a + (c ? "\nStatus: " + c : "") + (d ? "\n\nResponse:\n" + h(d) : "");
        a += e ? "\n\nHeaders:\n" + h(e) : "";
        a += k ? "\n\nConfig:\n" + h(k) : "";
        f(g("request",
            encodeURIComponent(a.trim())))
    }
})();