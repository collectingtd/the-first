window.addEventListener('DOMContentLoaded', function () {
    // AJAX请求
    const defaultUrlHeader = "http://localhost:3000";

    const AjaxRequest = function (url, operationFn) {
        let xmr = new XMLHttpRequest();
        xmr.open("GET", url, true);
        xmr.send();
        xmr.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status >= 200 && this.status < 300) {
                    operationFn(JSON.parse(xmr.responseText));
                }
            }
        }
    }

    function judgeLoginStasus() {
        AjaxRequest(`${defaultUrlHeader}/login/status`, loginstatus);
    }

    judgeLoginStasus();

    let profile = document.querySelector('.profile');
    let unlogin = document.querySelector('.unlogin');

    function loginstatus(responseText) {
        console.log(responseText.data);
        if (responseText.data.account == null) {
            profile.style.display = 'none';
        }
    }
    loginstatus();
})