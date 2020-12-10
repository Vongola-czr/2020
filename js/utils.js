// 封装一个函数,求 n -m 之间随机整数
function randomNumber(n, m) {
    if (n > m) {
        return parseInt(Math.random() * (n - m + 1) + m)
    } else {
        return parseInt(Math.random() * (m - n + 1) + n)
    }
}

// 封装一个函数 把url的参数转化为 对象
function changeObj(str) {
    var arr = str.split("&");
    var obj = {}; //定义一个空对象用
    arr.forEach(function (item) {
        var newArr = item.split("=");
        obj[newArr[0]] = newArr[1];
    });
    return obj;
}

// 封装一个随机颜色的函数
function randomcolor() {

    return "rgb(" + randomNumber(0, 255) + "," + randomNumber(0, 255) + "," + randomNumber(0, 255) + ")";
}

// 封装一个时间格式的函数  2020/11/19 17:24:16 星期四
function formatTime(date, fuhao) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    // 给小于10的数字前面添加 0 
    month = month >= 10 ? month : "0" + month;
    var day = date.getDate();
    day = day >= 10 ? day : "0" + day;
    var hours = date.getHours();
    hours = hours >= 10 ? hours : "0" + hours;
    var min = date.getMinutes();
    min = min >= 10 ? min : "0" + min;
    var sec = date.getSeconds();
    sec = sec >= 10 ? sec : "0" + sec;

    var week = date.getDay(); // 返回的是数字 

    // 创建数组 索引拿到数据 重新赋值给 week
    var arr = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    week = arr[week];

    // 如果不传递符号这个参数的时候, 需要做一个处理
    fuhao = fuhao ? fuhao : "/";

    return `${year}${fuhao}${month}${fuhao}${day} ${hours}:${min}:${sec} ${week}`
    // 2020-11-07 15:30:32 星期六 格式的时间
}

// 封装一个计算两个时间差的函数
function timeDifference(date1, date2) {

    // 1 创建两个时间
    // var date1 = new Date("2020-11-07 20:10:10");
    // var date2 = new Date("2020-12-13 00:00:00")
    // 2 先算两个时间对象到格林威治时间的时间差
    var time1 = date1.getTime()
    var time2 = date2.getTime()

    // 3 用abs函数取绝对值
    var time = Math.abs(time1 - time2);

    console.log(time); // 得到两个时间的时间相差毫秒数

    // 计算两个时间差的天数
    var day = parseInt(time / 1000 / 60 / 60 / 24);
    // 如果小于10 的话 在前面加 0
    day = day >= 10 ? day : "0" + day;

    // 计算小时
    // 1. var hours = time / 1000 / 60 / 60 / 24 - day;
    var hours = parseInt((time / 1000 / 60 / 60) % 24);
    hours = hours >= 10 ? hours : "0" + hours;

    // 计算 分钟
    var min = parseInt((time / 1000 / 60) % 60)
    min = min >= 10 ? min : "0" + min;

    // 计算秒数
    var sec = parseInt(time / 1000 % 60)
    sec = sec >= 10 ? sec : "0" + sec;

    // 把计算的day hours min sec 当成函数的返回值
    var obj = {
        day: day,
        hours: hours,
        min: min,
        sec: sec
    }
    return obj;
}