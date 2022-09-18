function removeGetParams() {
    function toRemoveParams(param) {
        const PARAMS_TO_REMOVE = [
            'alp'
        ];
        return PARAMS_TO_REMOVE.indexOf(param.split('=')[0]) === -1;
    }

    if (!window.preserveParams && history && history.replaceState && location.search) {
        const params = location.search.slice(1).split('&');
        const paramsToPreserve = params.filter(toRemoveParams);
        const search = paramsToPreserve.length ? '?' + paramsToPreserve.join('&') : '';
        const url = location.pathname + search + location.hash;
        history.replaceState(null, null, url);
    }
}

window.addEventListener('load', removeGetParams);