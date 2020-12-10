//1.获取元素
let username = document.querySelector("#username");
let password = document.querySelector("#password")
let form = document.querySelector(".form-horizontal")


//2.绑定提交事件 
form.onsubmit = function () {
    //4. 阻止默认行为 验证返回结果
    let e = window.event;
    e.preventDefault();
    // console.log(username.value, password.value);
    //3. 发送ajax请求
    pAjax({
        type: 'post',
        url: '../api/login.php',
        data: {
            username: username.value,
            password: password.value
        }
    }).then(res => { // 取得结果
        // let res1 = JSON.parse(res)
        // console.log(res1);
        if (res.code == 1) { //5. 取res.code 的值进行判断 
            // 跳转页面 如果从购物车过来的时候登录成功就去购物车页面
            // 否则就去到首页  登录成功后存储登录状态(Cookie)
            setCookie('login', username.value);
            //6. 用Cookie来判断从哪里来到的login
            // let url = getCookie('url');
            let url = localStorage.getItem('url');
            if (url) {
                // 登录成功并且在购物车正确就在当前页面
                // console.log(1); 
                location.href = url;
                // 登录成功的时候就把 url的Cookie值删除 
                // setCookie('url', '', -10)
                localStorage.removeItem('url');
            } else {
                // 如果当前登录成功 code==1 但是不在购物车页面 就去首页
                location.href = 'http://facai.com/PHP/phpday06/index1.html'
            }
        }

    })


}