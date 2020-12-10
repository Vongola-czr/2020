let list = document.querySelector(".list")

//3. 获取page元素 进行分页渲染
let page = document.querySelector('.page')

//4. 设置变量 len 方便计算页码总数 7.把num跟len一起转换成全局对象
let defaultIndo = {
    len: 20,
    num: 1 // 默认页码为1
}


//1.请求ajax
pAjax({
    url: '../api/getData.php',
    data: {
        start: defaultIndo.num, // 初始页码
        len: defaultIndo.len
    }
}).then((res) => { //2. 获取分页对象 Pagination
    // res = JSON.parse(res); //5. 把转换过后的值赋给res 才能拿到对象里面的属性

    new Pagination(page, {
        pageInfo: {
            pagenum: 1, // 当前页数
            pagesize: defaultIndo.len, // 每页多少张
            total: res.total, // 数据总数
            totalpage: Math.ceil(res.total / defaultIndo.len) // 页码总数  需要向上取整
        },
        textInfo: {
            first: '首页',
            prev: '上一页',
            list: '',
            next: '下一页',
            last: '最后一页'
        },
        //6. 转换页面函数 num当前点击的页数
        change: function (num) {
            defaultIndo.num = num;
            getData()
            scrollTo(0, 0)
        }
    })
})

async function getData() {
    let res = await pAjax({
        url: '../api/getData.php',
        data: {
            start: defaultIndo.num,
            len: defaultIndo.len
        }
    });
    // console.log(); 
    // let res1 = JSON.parse(res);
    //9. 调用渲染函数
    renderHtml(res.list)

}

//8. 设置一个函数渲染数据
function renderHtml(data) {
    let str = '';
    data.forEach((item) => {
        str += `<li class="list-item">
        <div class="title">
            <ol class="breadcrumb">
                <li><a href="#">${item.cat_one_id}</a></li>
                <li><a href="#">${item.cat_two_id}</a></li>
                <li class="active">${item.cat_three_id}</li>
            </ol>
        </div>
        <div class="row">
            <div>
                <div class="thumbnail">
                    <img src="${item.goods_big_logo}"
                        alt="...">
                    <div class="caption">
                        <h3>${item.goods_name}</h3>
                        <div class="price">
                            <i class="glyphicon glyphicon-yen"></i>
                            <span>${item.goods_price}</span>
                        </div>
                        <p>
                        <a href="./car.html" class="btn btn-primary" role="button">查看购物车</a>
                        <a href="./detail.html?id=${item.goods_id}" class="btn btn-info" role="button">查看商品详情</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </li>`;
    })

    list.innerHTML = str;
}