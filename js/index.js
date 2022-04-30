window.addEventListener('DOMContentLoaded', function () {
    // 侧边栏高度设置
    var sidebar = document.querySelector('.sidebar');
    sidebar.style.height = window.innerHeight + 'px';

    var detail = document.querySelector('.detail');
    detail.style.right = sidebar.offsetWidth + 'px';
    detail.style.height = window.innerHeight + 'px';
})