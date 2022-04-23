const defaultUrlHeader = "http://localhost:3000";

// AJAX请求函数
function AjaxRequest(url, operationFn) {
    let xmr = new XMLHttpRequest();
    xmr.open("GET", url, true);
    xmr.send();
    xmr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status >= 200 && this.status < 300) {
            operationFn(JSON.parse(xmr.responseText));
        }
    }
}

AjaxRequest(`${defaultUrlHeader}/login/status`,);
function oook() {
    console.log(1);
}

