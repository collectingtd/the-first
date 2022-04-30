window.addEventListener('DOMContentLoaded', function () {

    // 登录页面弹出框设置转换
    let log_button = document.querySelector('.log_button');
    let switchLoginMode = log_button.children;
    let identi_num = document.querySelector('.identi_num');
    let password = document.querySelector('.password');
    let mask = document.querySelector('.mask');
    let login_board = document.querySelector('.login_board');
    let login_close = document.querySelector('.login_close');
    let flag = 1;
    //flag用于判当前页面处于哪个登录方式界面
    for (var i = 0; i < 2; i++) {
        switchLoginMode[i].addEventListener('click', function () {
            if (identi_num.style.display === 'none') {
                identi_num.style.display = 'block';
                password.style.display = 'none';
                switchLoginMode[0].style.display = 'none';
                switchLoginMode[1].style.display = 'block';
                flag = 1;
                // 1表示当前处于手机验证码登录页面
            } else {
                identi_num.style.display = 'none';
                password.style.display = 'block';
                switchLoginMode[0].style.display = 'block';
                switchLoginMode[1].style.display = 'none';
                flag = 0;
                // 0表示当前处于手机密码登录页面
            }
        })
    }
    let profile = document.querySelector('.profile');
    let profile_img = profile.querySelector('img');
    let unlogin = document.querySelector('.unlogin');

    unlogin.addEventListener('click', function () {
        mask.style.display = 'block';
        login_board.style.display = 'block';
    })

    login_close.onclick = function () {
        mask.style.display = 'none';
        login_board.style.display = 'none';
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

    // 发送验证码
    let ablesent = 1;
    let identi_request = document.querySelector('.identi_request');
    function ForbidSent() {
        ablesent = 0;
        let timer = 60;
        var count = setInterval(function () {
            timer--;
            identi_request.innerHTML = timer;
        }, 1000);
        if (timer == 0) {
            ablesent = 1;
            clearInterval(count);
            identi_request.innerHTML = timer;
        }
    }

    identi_request.addEventListener('click', function () {
        if (ablesent == 1) {
            var phonenumber = document.querySelector('.phonenumber');
            AjaxRequest(`${defaultUrlHeader}/captcha/sent?phone=${phonenumber.value}`, ForbidSent);
        }
    })

    // 提交登录信息
    let login_summit = document.querySelector('.login_summit');
    login_summit.addEventListener('click', function () {
        switch (flag) {
            case 0:
                var phonenumber = document.querySelector('.phonenumber');
                var password_input = document.querySelector('.password_input');
                AjaxRequest(`${defaultUrlHeader}/login/cellphone?phone=${phonenumber.value}&password=${password_input.value}`, finishLogin);
                break;
            case 1:
                var phonenumber = document.querySelector('.phonenumber');
                var identi_content = document.querySelector('.identi_content');
                AjaxRequest(`${defaultUrlHeader}/captcha/verify?phone=${phonenumber.value}&captcha=${identi_content.value}`, finishLogin);
                break;
        }
    })

    // 提交登录后的页面响应
    let status = document.querySelector('.status');
    function finishLogin(responseText) {
        console.log(`${defaultUrlHeader}/login/status`);
        console.log(responseText);
        if (typeof responseText == 'number') {
            status.innerHTML = '账户不存在';
        } else if (typeof responseText == 'object') {
            if (responseText.code == 502) {
                status.innerHTML = responseText.message;
            } else {
                unlogin.style.display = 'none';
                profile.style.display = 'block';
                profile_img.src = responseText.profile.avatarUrl;
                login_close.click();
            }
        }
        judgeLoginStatus();
    }

    // 判断登录状态
    function judgeLoginStatus() {
        AjaxRequest(`${defaultUrlHeader}/login/status`, loginstatus);
    }

    judgeLoginStatus();
    function loginstatus(responseText) {
        console.log(responseText);
    }
    loginstatus();
})
