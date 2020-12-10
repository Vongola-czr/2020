// 打开详情页的时候先查看是否有携带id参数
// 如果没有id参数的时候 就跳转到列表
// 如果有id参数的时候 就根据id去获取对象的数据 渲染

// http://facai.com/PHP/phpday06/html/detail.html?id=4

// let res = location.search;      // 网址?id=num;
console.log(location);
let reg = /id=(\d+)/;
// exec函数捕获满足条件的值

//2. 判断如果没有id则返回列表页
if (!reg.test(location.search)) {
    location.href = '../html/list.html'
}
//1. 设置变量接收地址 ?号后的参数
let id = reg.exec(location.search)[1]; //取得索引为1的值
// console.log(id);

// 获取元素
let container = document.querySelector('.container');

//3. 根据id获取数据
pAjax({
    url: '../api/getDetail.php',
    data: {
        type: 'post',
        id: id
    }
}).then(res => { // 获得结果
    console.log(res.detail);
    renderHtml(res.detail)
})

//4. 根据id渲染数据函数
function renderHtml(data) {
    container.innerHTML = `<ol class="breadcrumb">
    <li><a href="#">详情</a></li>
</ol>
<div class="media">
    <div class="media-left">
        <a href="#">
            <img class="media-object"
                src="${data.goods_big_logo}"
                alt="...">
        </a>
    </div>
    <div class="media-body">
        <h4 class="media-heading">${data.goods_name}
        </h4>
        <div class="price">
            <i class="glyphicon glyphicon-yen"></i>
            <span>${data.goods_price}</span>
        </div>
        <div class="btn-group" role="group" aria-label="...">
            <button type="button" class="btn btn-default">XL</button>
            <button type="button" class="btn btn-default">L</button>
            <button type="button" class="btn btn-default">M</button>
            <button type="button" class="btn btn-default">S</button>
            <button type="button" class="btn btn-default">XS</button>
        </div>

        <div>
            <button class="btn btn-warning btn-lg" id="goCar">立即购买</button>
            <button class="btn btn-danger btn-lg" id="addCar">加入购物车</button>
        </div>
    </div>
</div>

<ul class="nav nav-tabs">
    <li role="presentation" class="active"><a href="#">Home</a></li>
    <li role="presentation"><a href="#">Profile</a></li>
    <li role="presentation"><a href="#">Messages</a></li>
</ul>
<div class="goods_detail">
    ${data.goods_introduce}
</div>`
}

//5. 判断点击返回的值 来决定加入购物车还是立即购买
container.onclick = function () {
    let e = window.event;
    // console.log(e.target.id);
    if (e.target.id == 'goCar') {
        // console.log(e.target.id);
        location.href = '../html/car.html'
    }

    if (e.target.id == 'addCar') {
        // 因为添加到购物车按钮 需要用户名和商品id
        // 所以需要判断是否有登录
        let login = getCookie('login');
        if (!login) {
            location.href = '../html/login.html';
            // 记录url 从哪里跳过来,保证输入数据后返回原网址
            // setCookie('url', 'http://facai.com/PHP/phpday06/html/detail.html?id' = +id)
            localStorage.setItem('http://facai.com/PHP/phpday06/html/detail.html?id=' + id)
            return
        }
        pAjax({
            url: '../api/addCarData.php',
            data: {
                type: 'post',
                username: login,
                goods_id: id
            }
        }).then(res => {
            console.log(res);
            // console.log(1);
            if (res.code == 1) {
                alert("添加成功")
            }

        })
    }
}