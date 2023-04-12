const week = ["日", "月", "火", "水", "木", "金", "土"];
const today = new Date();
// 月末だとずれる可能性があるため、1日固定で取得
var showDate = new Date(today.getFullYear(), today.getMonth(), 1);

// 初期表示
window.onload = function () {
    showProcess(today, calendar);
    $("#head").hide();
};

// 前の月表示
function prev(){
    showDate.setMonth(showDate.getMonth() - 1);
    showProcess(showDate);
}

// 次の月表示
function next(){
    showDate.setMonth(showDate.getMonth() + 1);
    showProcess(showDate);
}

// カレンダー表示
function showProcess(date) {
    var year = date.getFullYear();
    var month = date.getMonth();
    $("#header").prop("innerText", year + "年 " + (month + 1) + "月");

    var calendar = createProcess(year, month);
    document.querySelector('#calendar').innerHTML = calendar;
}

// カレンダー作成
function createProcess(year, month) {
    // 曜日
    var cal_tbl = "<table><tr class='dayOfWeek'>";
    for (var i = 0; i < week.length; i++) {
        cal_tbl += "<th>" + week[i] + "</th>";
    }
    cal_tbl += "</tr>";

    var count = 0;
    var startDayOfWeek = new Date(year, month, 1).getDay();
    var endDate = new Date(year, month + 1, 0).getDate();
    var row = Math.ceil((startDayOfWeek + endDate) / week.length);

    // 1行ずつ設定
    for (var i = 0; i < row; i++) {
        cal_tbl += "<tr>";
        // 1colum単位で設定
        for (var j = 0; j < week.length; j++) {
            if (i == 0 && j < startDayOfWeek) {
                // 1行目で1日まで先月の日付を設定
                cal_tbl += "<td class='disabled'></td>"; //cal_tbl += "<td class='disabled'>" + (lastMonthEndDate - startDayOfWeek + j + 1) + "</td>";
            } else if (count >= endDate) {
                // 最終行で最終日以降、翌月の日付を設定
                count++;
                cal_tbl += "<td class='disabled'></td>"; //cal_tbl += "<td class='disabled'>" + (count - endDate) + "</td>";
            } else {
                count++;

                // 当月の日付を曜日に照らし合わせて設定
                cal_tbl += "<td id='" + count + "'";
                if(year == today.getFullYear() && month == (today.getMonth()) && count == today.getDate()){
                    cal_tbl += " class='today'";
                }else{                
                    if(j == 0) cal_tbl += " style='background-color: #f1c5c5'";
                    if(j + 1 == week.length) cal_tbl += " style='background-color: #c5e6f1'";
                }
                cal_tbl += " row='" + (i+1) + "' col='" + (j+1) + "'>" + count;
                cal_tbl += "</td>";
            }
        }
        cal_tbl += "</tr>";
    }
    return cal_tbl;
}
