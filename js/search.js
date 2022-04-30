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
                } else {
                    operationFn(xmr.status);
                }
            }
        }
    }

    let hotwords = document.querySelector('.hotwords');
    let search_input = document.querySelector('.search_input');
    let keywords = document.querySelector('.keywords');
    let sign = 0;
    // sign用于判断当前处于哪个页面，0为搜索默认页面，1为结果页面

    // 设置默认搜索（热词）
    AjaxRequest(`${defaultUrlHeader}/search/default`, default_keyword);
    function default_keyword(default_word) {
        search_input.placeholder = default_word.data.realkeyword;
    }

    // 搜索页面的设置

    search_input.addEventListener('focus', function () {
        hotwords.style.display = 'none';
        keywords.style.display = 'block';
    })

    search_input.addEventListener('blur', function () {
        if (sign === 0) {
            hotwords.style.display = 'block';
        }
        keywords.style.display = 'none';
    })


    // 搜索提示词
    search_input.addEventListener('input', function () {
        keywords.remove();
        AjaxRequest(`${defaultUrlHeader}/search/suggest?keywords=${search_input.value}`, addSuggest);
    })
    function addSuggest(responseText) {
        let i = 0;
        for (k in responseText.result.artists) {
            let key_item = document.createElement('li');
            keywords.appendChild(key_item);
            keywords.children[i].innerHTML = responseText.result.artists[k].name;
            console.log(responseText);
        }
    }


    // 热门搜索
    AjaxRequest(`${defaultUrlHeader}/search/hot/detail`, hotwordsSetting);
    function hotwordsSetting(responseText) {
        for (let i = 0; i < 10; i++) {
            let hot_item = document.createElement('li');
            hotwords.appendChild(hot_item);
            hotwords.children[i].innerHTML = responseText.data[i].searchWord;
            if (i < 3) {
                hotwords.children[i].style.fontWeight = '600';
            }
        }
    }

    // 提交搜索
    let search_summit = document.querySelector('.search_summit');
    let search_result = document.querySelector('.search_result');
    let single_song = search_result.querySelector('li');
    search_summit.addEventListener('click', function (responseText) {
        sign = 1;
        hotwords.style.display = 'none';
        search_input.style.top = 50 + 'px';
        search_summit.style.top = 58 + 'px';
        keywords.style.top = 100 + 'px';
        search_result.style.display = 'block';
        AjaxRequest(`${defaultUrlHeader}/search?keywords= ${search_input.value}`, search_detail);
    })

    function search_detail(responseText) {
        console.log(responseText);
        let i = 0;
        for (k in responseText.result.songs) {
            if (i == 0) {
                let title = single_song.querySelector('.title').firstElementChild;
                let author = single_song.querySelector('.author');
                title.innerHTML = responseText.result.songs[k].name;
                author.innerHTML = responseText.result.songs[k].artists[0].name;
            } else {
                let single_clone = single_song.cloneNode(true);
                search_result.appendChild(single_clone);
                let title = single_clone.querySelector('.title').firstElementChild;
                let author = single_clone.querySelector('.author');
                title.innerHTML = responseText.result.songs[k].name;
                author.innerHTML = responseText.result.songs[k].artists[0].name;
            }
            i++;
        }
    }
})