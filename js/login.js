window.addEventListener('DOMContentLoaded', function () {

    // 登录页面弹出框设置转换
    let log_button = document.querySelector('.log_button');
    let switchLoginMode = log_button.children;
    let identi_num = document.querySelector('.identi_num');
    let password = document.querySelector('.password');
    let flag = 0;
    for (var i = 0; i < 2; i++) {
        switchLoginMode[i].addEventListener('click', function () {
            if (identi_num.style.display === 'none') {
                identi_num.style.display = 'block';
                password.style.display = 'none';
                switchLoginMode[0].style.display = 'none';
                switchLoginMode[1].style.display = 'block';
                flag = 1;
                // 1表示当前处于手机密码登录页面
            } else {
                identi_num.style.display = 'none';
                password.style.display = 'block';
                switchLoginMode[0].style.display = 'block';
                switchLoginMode[1].style.display = 'none';
                flag = 0;
                // 0表示当前处于手机验证码登录页面
            }
        })
    }
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
                } else {
                    operationFn(xmr.status);
                }
            }
        }
    }

    let status = document.querySelector('.status');
    // status.innerHTML = 'helle0';
    function finishLogin(responseText) {
        if (typeof responseText == 'number') {
            status.innerHTML = '账户不存在';
        } else {
            status.innerHTML = responseText.message;
        }
    }

    let login_summit = document.querySelector('.login_summit');
    login_summit.addEventListener('click', function () {
        switch (flag) {
            case 0:
                let phonenumber = document.querySelector('.phonenumber');
                let password_input = document.querySelector('.password_input');
                AjaxRequest(`${defaultUrlHeader}/login/cellphone?phone=${phonenumber.value}&password=${password_input.value}`, finishLogin);
                break;
        }

    })

    function judgeLoginStasus() {
        AjaxRequest(`${defaultUrlHeader}/login/status`, loginstatus);
    }

    judgeLoginStasus();

    let profile = document.querySelector('.profile');
    let unlogin = document.querySelector('.unlogin');
    let mask = document.querySelector('.mask');
    let login_board = document.querySelector('.login_board');
    let login_close = document.querySelector('.login_close');

    unlogin.addEventListener('click', function () {
        mask.style.display = 'block';
        login_board.style.display = 'block';
    })

    login_close.onclick = function () {
        mask.style.display = 'none';
        login_board.style.display = 'none';
    }

    function loginstatus(responseText) {
        if (responseText['data']['account'] == null) {
            profile.style.display = 'none';
            unlogin.style.display = 'block';
        } else {
            profile.style.display = 'block';
            unlogin.style.display = 'none';
        }
    }
    loginstatus();
})
