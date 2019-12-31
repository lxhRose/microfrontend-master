const DateFormat = {
    getToday: () => { // 今天
        let myDate = new Date();
        return DateFormat.format(myDate);
    },
    getYesterday: () => { // 昨天
        let myDate = new Date();
        myDate.setDate(myDate.getDate() - 1);

        return DateFormat.format(myDate);
    },
    getNowWeek: () => { //获取本周
        let myDate = new Date();
        let todayStr = DateFormat.format(myDate);
        let day = myDate.getDay();
        if (day === 0) { // 星期天
            myDate.setDate(myDate.getDate() - 6); // 周一
        } else {
            myDate.setDate(myDate.getDate() - day + 1); // 周一
        }
        let startStr = DateFormat.format(myDate);
        return [startStr, todayStr];
    },
    getNowMonth: () => { // 本月
        let myDate = new Date();
        let todayStr = DateFormat.format(myDate);
        myDate.setDate(1); // 从本月一号开始
        let startStr = DateFormat.format(myDate);
        return [startStr, todayStr];
    },
    getNowYear: () => { // 全年
        let myDate = new Date();
        let todayStr = DateFormat.format(myDate);
        myDate.setMonth(0, 1); // 从本年一月一号开始
        let startStr = DateFormat.format(myDate);
        return [startStr, todayStr];
    },
    format: (myDate) => {
        let year = myDate.getFullYear();
        let month = DateFormat.lowTen(myDate.getMonth()+1);
        let date = DateFormat.lowTen(myDate.getDate());

        return `${year}-${month}-${date}`;
    },
    lowTen: (value) => { // 对小于10 的数处理+0
        return value < 10 ? '0' + value.toString() : value.toString();
    }
}

export default DateFormat;
