//3. 获取元素 渲染页面
let container = document.querySelector('.container');

//1. 判断是否有登录 (Cookie) 没有登录就跳转到登录页面
let login = getCookie('login')
if (!login) {
    //跳转到登录
    location.href = '../html/login.html';

    // 记录url 从哪里跳过来,保证输入数据后返回原网址
    // setCookie('url', 'http://facai.com/PHP/phpday06/html/car.html')
    localStorage.setItem('url', 'http://facai.com/PHP/phpday06/html/car.html')
    // return;
}

//2. 登录状态下 就获取数据
pAjax({
    url: '../api/getCarData.php',
    data: {
        username: login
    }
}).then(res => {
    //4. 先把数据存放到本地 方便修改网页但是不更改数据库        (此处用于更改保存checked的item.is_selec的值)(是否全选)
    //localStorage.setItem只能存储 JSON数据 所以要转化
    // 'goodsList' 是localStorage设置的 Key(自建) value是res
    // console.log(1);
    localStorage.setItem('goodsList', JSON.stringify(res));
    render(res)
})

//2.1 向后台请求数据可能有,也可能没有
function render(data) {
    // console.log(data);
    // data 可能一条数据都没有 购物车
    // 如果 发送请求 但是购物车里面没有数据 此时res为 []  (空数组不为空)
    // 但是长度length为0 可以从length判断
    // 为false的只有五种情况 : 1. 真的空 ,2. null,3. undefined 4. 0 ,5.NaN
    if (!data.length) { // 此时要是没有数据的话 res.lenght == 0 所以为false
        // console.log(1);

        container.innerHTML = `<div class ="jumbotron">
            <h1>亲爱的用户</h1>
            <p>您购物车空空如也,请到列表页选购你商品</p>
            <p><a class = "btn btn-primary btn-lg" href="../html/list.html" role = "button">
            点击去到列表页</a></p>
        </div>`
        return;
    }
    //5. 判断item.is_select是否等于1 (默认没选中=0)
    // every函数满足全部返回 ture
    let allChecked = data.every(item => {
        return item.is_select == 1;
    })


    //8.1 渲染前运行商品函数
    //获取选中的数据
    let total = shopNum(data);

    //3. 渲染数据
    let str = `<div class="panel panel-default">
    <div class="panel-heading">
        <div class="content">
            <label for="" class="checkbox">
                <input type="checkbox" id = "all" ${allChecked ?'checked' :''}>
                <span>全选</span>
            </label>
            <label for="" class="type">
                <span>商品种类：</span>
                <span>${data.length}</span>
            </label>
            <label for="" class="qty">
                <span>所选商品数量：</span>
                <span>${total.totalNum}</span>
            </label>
            <label for="" class="price">
                <span>所选商品价格：</span>
                <span>${total.totalPrice}</span>
            </label>
            <label for="">
                <button class="btn btn-warning btn-xs buy">结算</button>
                <button class="btn btn-info btn-xs moveCar">清空购物车</button>
            </label>
        </div>
    </div>
    `;

    str += `<div class="panel-body">
    <ul>`
    // console.log(data); // 数组
    // 
    data.forEach(item => {
        // console.log(item);
        str += `<li>
        <div class="media">
            <div class="media-left media-middle">
                <input type="checkbox" class = "check" ${item.is_select==1 ?'checked':''} goods_id="${item.goods_id}">
                <a href="#">
                    <img class="media-object"
                        src="${item.goods_small_logo}"
                        alt="">
                </a>
            </div>
            <div class="media-body">
                <h4 class="media-heading">${item.goods_name}</h4>
                <div class="price">
                    <i class="glyphicon glyphicon-yen"></i>
                    <span>${item.goods_price}</span>
                </div>
                <div class="btn">
                    <p>
                        <butto class="btn btn-danger del" goods_id="${item.goods_id}">删除商品</butto>
                    </p>
                    <div class="btn-group" role="group" aria-label="..." goods_id="${item.goods_id}">
                        <button class="btn btn-default reduce">-</button>
                        <button class="btn btn-default">${item.cart_number}</button>
                        <button class="btn btn-default add" >+</button>
                    </div>
                </div>
            </div>
        </div>
    </li>`
    });

    str += `</ul>
    </div>
</div>`

    container.innerHTML = str;

}

//6. 用事件委托来绑定事件(是否全选)

container.onclick = function () {
    let e = window.event;
    //点击全选按钮  需要修改item.is_selec 的值 变成1 checked
    //但是又不能修改数据库里面的值 所以获取localStloorage里面保存的数据
    if (e.target.id == 'all') {
        let data = JSON.parse(localStorage.getItem('goodsList')) //拿到localStloorage的值 但是是JSON数据
        // console.log(data); // 得到数组里面的对象
        // 点击全选后 把 item.is_select 赋值为1
        data.forEach(item => {
            // 如果e.target.checked为真就选中 为false就不选中
            e.target.checked ? item.is_select = 1 : item.is_select = 0;
            // item.is_select = 1;
        })
        // 更改完后 重新渲染数据 跟重新更改localStorage
        localStorage.setItem('goodsList', JSON.stringify(data))
        render(data);
    }

    // let inp = document.querySelector('.check');
    // inp.onmousemove = function(){
    //     let e = window.event
    //     var val = e.target.value;
    //     console.log(val);
    // }
    //7. 单选 
    //判断当前点击事件是否等于 check,
    //取得当前点击标签的goods_id
    //取得localStorage的数据(因为不能影响数据库)
    //判断两者的id是否相等 如果相等就使 选择框为真
    if (e.target.className == 'check') {
        // inp.goods_ids = 12 // 
        let id = e.target.getAttribute('goods_id');
        // let val = e.target.value
        let data = JSON.parse(localStorage.getItem('goodsList'));
        console.log(data);
        // console.log(id);
        data.forEach(item => {
            if (item.goods_id == id) {
                // console.log(2);
                item.is_select = e.target.checked ? 1 : 0;
            }
        })
        // console.log(1);
        // 更改完后 重新渲染数据 跟重新更改localStorage
        localStorage.setItem('goodsList', JSON.stringify(data))
        render(data);
    }

    //9. del按钮
    // if (e.target.className == 'del') // 这里为什么className == 'del'不行
    // 包含del的
    if (e.target.classList.contains('del')) {
        // 删除数据库中 和 本地存储中对应的数据 (删除按钮中有保存 goods_id)
        let id = e.target.getAttribute("goods_id")
        pAjax({
            url: '../api/removeCarData.php',
            data: {
                username: login,
                goods_id: id
            }
        }).then(res => {
            if (res.code) {
                // 先获取本地存储中的数据
                let data = JSON.parse(localStorage.getItem('goodsList'))
                // 使用过滤把不等于该id的返回出去
                let res = data.filter(item => {
                    return item.goods_id != id;
                });
                // 重新渲染本地数据
                localStorage.setItem('goodsList', JSON.stringify(res));
                render(res);
            }
        })
    }

    //10. 更新商品的数量    给按钮添加类名 add reduce
    if (e.target.classList.contains('reduce')) {
        //进行数量减法
        let data = JSON.parse(localStorage.getItem('goodsList'))
        let id = e.target.parentNode.getAttribute('goods_id');

        //10.1 过滤出点击商品的id 并转为对象
        let obj = data.filter(item => {
            return item.goods_id == id
        })[0];

        //10.2  *1 转化为number类型 小于1时无法进行减法 否则自减
        let num = obj.cart_number * 1;
        if (num <= 1) {
            num = 1
        } else {
            num--
        }
        //10.3 更改后台数据
        pAjax({
            url: '../api/updCarData.php',
            data: {
                username: login,
                goods_id: id,
                goods_num: num
            }
        }).then(res => {
            //10.4 如果rescode添加成功为真 就重新赋值渲染
            if (res.code) {
                obj.cart_number = num;
                localStorage.setItem('goodsList', JSON.stringify(data))
                render(data);
            }
        })
    }

    //11. 更新商品的数量    给按钮添加类名 add reduce
    if (e.target.classList.contains('add')) {
        //进行数量加法
        let data = JSON.parse(localStorage.getItem('goodsList'))
        let id = e.target.parentNode.getAttribute('goods_id');

        //10.1 过滤出点击商品的id 并转为对象
        let obj = data.filter(item => {
            return item.goods_id == id
        })[0];

        //10.2  *1 转化为number类型 小于1时无法进行减法 否则自减
        let num = obj.cart_number * 1;
        if (num < 1) {
            num = 1
        } else {
            num++
        }
        //10.3 更改后台数据
        pAjax({
            url: '../api/updCarData.php',
            data: {
                username: login,
                goods_id: id,
                goods_num: num
            }
        }).then(res => {
            //10.4 如果rescode添加成功为真 就重新赋值渲染
            if (res.code) {
                obj.cart_number = num;
                localStorage.setItem('goodsList', JSON.stringify(data))
                render(data);
            }
        })
    }

    //12. 结算按钮  buy moveCar 
    if (e.target.classList.contains('buy')) {

        
        console.log('buy');
    }
}


//8. 计算商品价格
function shopNum(goods) {

    //过滤出选中的商品
    let res = goods.filter(item => {
        // 取出选中的商品id
        return item.is_select == 1
    })

    let totalNum = res.reduce((pre, item, ) => {
        // 计算出数量
        // *1 转为number
        return pre + item.cart_number * 1;
    }, 0);

    let totalPrice = res.reduce((pre, item) => {
        return pre + item.goods_price * item.cart_number
    }, 0)
    // console.log(totalNum);

    return {
        totalNum,
        totalPrice
    }
}