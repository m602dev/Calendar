const week = ["日", "月", "火", "水", "木", "金", "土"];
const today = new Date();
// 月末だとずれる可能性があるため、1日固定で取得
var showDate = new Date(today.getFullYear(), today.getMonth(), 1);

// 初期表示
window.onload = function () {
    showProcess(today, calendar);
    $("#head").hide();
};

window.onmousewheel = function(){
	(event.wheelDelta > 0) ? next() : prev();
}

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

    var cnt = 0;
    var startDayOfWeek = new Date(year, month, 1).getDay();
    var endDate = new Date(year, month + 1, 0).getDate();
    var row = Math.ceil((startDayOfWeek + endDate) / week.length);

    for (var i = 0; i < row; i++){
        cal_tbl += "<tr>";
        for(var j = 0; j < week.length; j++){
            if(i == 0 && j < startDayOfWeek){
                cal_tbl += "<td class='disabled'></td>"; //cal_tbl += "<td class='disabled'>" + (lastMonthEndDate - startDayOfWeek + j + 1) + "</td>";
            }else if (cnt >= endDate){
                cnt++;
                cal_tbl += "<td class='disabled'></td>"; //cal_tbl += "<td class='disabled'>" + (cnt - endDate) + "</td>";
            }else{
                cnt++;
                var detail = JSON.parse(localStorage.getItem(year + (('00'+(month+1)).slice(-2))+(('00'+(cnt)).slice(-2))));
                var d_cnt = (detail === null) ? "" : detail.length + "件";  

                cal_tbl += "<td id='" + cnt + "' onclick='modal(this.id)'";
                if(year == today.getFullYear() && month == (today.getMonth()) && cnt == today.getDate()){
                    cal_tbl += " class='today'";
                }else{                
                    if(j == 0) cal_tbl += " style='background-color: #f1c5c5'";
                    if(j + 1 == week.length) cal_tbl += " style='background-color: #c5e6f1'";
                }
                cal_tbl += " row='" + (i+1) + "' col='" + (j+1) + "'>" + cnt;
                cal_tbl += "<div class='td_cnt'>" + d_cnt + "</div>";              
                cal_tbl += "</td>";
            }
        }
        cal_tbl += "</tr>";
    }
    return cal_tbl;
}

async function modal(id){
    var header = $("#header").prop("innerText");
    var date_fmt = header.substring(0,4) + ('00'+header.substring(6).replace("月","")).slice(-2) + id;
    var detail = JSON.parse(localStorage.getItem(date_fmt));
    var cnt = (detail === null) ? 0 : detail.length;    
    var txt = "";

    for(var a = 0; a < cnt; a++) txt += "・ " + detail[a] + "<br>"

    await Swal.fire({
        title: $("#header").prop("innerText").substring(6) + ' ' + id + '日 (' + week[$('#'+id).attr('col')] + ')',
        html:
            '<div style="text-align: start; padding: 10px; line-height: 45px;">' + txt + '</div>' +       
            '<div style="padding-top: 20px; font-size: 130%; font-weight: bold;">新規予定</div>' + 
            '<div><input id="swal-val" class="swal2-input" placeholder="タイトルや内容を入力"></div>' ,
        focusConfirm: false,
        confirmButtonColor: '#2e3f50',
        confirmButtonText: "保存",
        preConfirm: () => {val = $("#swal-val").prop("value"); (detail === null) ? detail = [val] : detail.push(val); localStorage.setItem(date_fmt, JSON.stringify(detail))
            //post_Ajax({"date": header.substring(0,4) + "/" + header.substring(6).replace("月","") + "/" + id, "address": $("#swal-address").prop("value"), "txt": $("#swal-txt").prop("value"), "tenpo_cd": $("#tenpo_cd").val(), "tanto_cd": localStorage.getItem("tanto_cd"), "sm": sm},"option/post_event.php","イベント登録");
        }
    })
}
