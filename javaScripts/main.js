var $tbody = $("table tbody");
$(function () {
    //数据加载
    dataLoading();
    //货号排序
    sortData(0);
    //生产日期排序
    sortData(1);
    //进货日期排序
    sortData(2);
    //售价排序
    sortData(3);
    //禁用第一个选择框
    oDisable();
});

/**** 功能函数及方法定义部分 ****/

    /*数据加载*/
    function dataLoading() {
        //点击加载数据按钮
        $("#loadData").on("click",function () {
            //加载效果
            $("#LoadingEffect ").fadeIn();
            setTimeout(function () {
                $("#LoadingEffect ").fadeOut();
                $("thead input[name = 'ckData']")[0].indeterminate = false;
                $("thead input[name = 'ckData']").prop("checked",false);
                //数据请求
                $.getJSON("http://www.aulence.com/project/dataCommand/json/goodsData.json",function (data) {
                    console.log(data)
                    //数据生成函数
                    addData(data,function (str) {
                        $tbody.html(str);
                        //全选半选
                        selectOperation();
                        //数据删除
                        deleteData();
                        //禁用第一个选择框
                        oDisable();
                    });
                })
            },1200)
        });
    }

/*排序函数*/
function sortData(idx) {
    var $sortButton = $("#dataTable i");
        $sortButton.eq(idx).on("click",function () {
            //异常处理，判断$tbody是否有内容，是否进行排序操作
            if ( $tbody.html() === ""){
                return;
            }
            //加载效果
            $("#LoadingEffect ").fadeIn();
        setTimeout(function () {
            $("#LoadingEffect ").fadeOut();
            $sortButton.eq(idx).toggleClass("up");
            $sortButton.eq(idx).parents("th").siblings().children(".arrow").removeClass("up");
            //判读是否包含class .up ，包含就排序，不包含点击就不排序
            if ( $sortButton.eq(idx).is(".up")){
                if(idx === 0){
                    $.getJSON("http://www.aulence.com/project/dataCommand/json/goodsData.json",function (data) {
                        data.sort(function (obj1,obj2) {
                            var num1 = 0,num2 = 0;
                            num1 = (obj1.id).slice((obj1.id).indexOf("-")+1);
                            num2 = (obj2.id).slice((obj2.id).indexOf("-")+1);
                            return num1 - num2
                        })
                        addData(data,function (str) {
                            $tbody.html(str);
                            //全选半选
                            selectOperation();
                            //数据删除
                            deleteData();
                        })
                    })
                }
                else if(idx === 1){
                    $.getJSON("http://www.aulence.com/project/dataCommand/json/goodsData.json",function (data) {
                        data.sort(function (obj1,obj2) {
                            var num1 = 0,num2 = 0;
                            num1 = (obj1.manufacDate).replace(/\-/g,"");
                            num2 = (obj2.manufacDate).replace(/\-/g,"");
                            return num1 - num2
                        })
                        addData(data,function (str) {
                            $tbody.html(str);
                            //全选半选
                            selectOperation();
                            //数据删除
                            deleteData();
                        })
                    })
                }
                else if(idx === 2){
                    $.getJSON("http://www.aulence.com/project/dataCommand/json/goodsData.json",function (data) {
                        data.sort(function (obj1,obj2) {
                            var num1 = 0,num2 = 0;
                            num1 = (obj1.stockDete).replace(/\-/g,"");
                            num2 = (obj2.stockDete).replace(/\-/g,"");
                            return num1 - num2
                        })
                        addData(data,function (str) {
                            $tbody.html(str);
                            //全选半选
                            selectOperation();
                            //数据删除
                            deleteData();
                        })
                    })
                }
                else if(idx === 3){
                    $.getJSON("http://www.aulence.com/project/dataCommand/json/goodsData.json",function (data) {
                        data.sort(function (obj1,obj2) {
                            var num1 = 0,num2 = 0;
                            num1 = obj1.price;
                            num2 = obj2.price;
                            return num1 - num2
                        })
                        addData(data,function (str) {
                            $tbody.html(str);
                            //全选半选
                            selectOperation();
                            //数据删除
                            deleteData();
                        })
                    })
                }
            }else {
                $.getJSON("http://www.aulence.com/project/dataCommand/json/goodsData.json",function (data) {
                    addData(data,function (str) {
                        $tbody.html(str);
                        //全选半选
                        selectOperation();
                        //数据删除
                        deleteData();
                    })
                })
            }
        },1200)
    })
}

/*数据生成函数*/
function addData(obj,callBack) {
    //获取数据长度
   var objLength = obj.length;
   var str = "";
   //添加数据
   for (var i = 0 ; i < objLength; i ++){
       str +=`<tr>
                 <td>${obj[i].choose}</td>
                 <td>${obj[i].id}</td>
                 <td>${obj[i].goods}</td>
                 <td>${obj[i].manufacDate}</td>
                 <td>${obj[i].stockDete}</td>
                 <td>${obj[i].qualityDete}年</td>
                 <td>￥${obj[i].price}</td>
                 <td class="ctrl">${obj[i].command}</td>`
   }
   if (callBack){
       callBack(str)
   }
}

/*数据删除*/
function deleteData() {
    var $delete = $(".delete");
    var $Popup = $("#Popup");
    var $delCkdData = $("#delCkdData");
    $delete.off("click").on("click",function () {
        $(this).parents("tr").addClass("holdCommand");
        //淡出弹出框
        $Popup.fadeIn();
        $("#Determine").off("click").on("click",function () {
            $("tbody tr.holdCommand").remove();
            $Popup.fadeOut();
            //禁用第一个选择框
            oDisable();
            selectOperation()
        });
        $("#cancel").off("click").on("click",function () {
            $("tbody tr.holdCommand").removeClass("holdCommand");
            $Popup.fadeOut();
        })
    });
    //删除选中项
    $delCkdData.off("click").on("click",function () {
        $Popup.children("div").children(".a").text("您确定要删除选中数据吗？");
        //淡入弹出框
        $Popup.fadeIn();
        $("tbody input[name = 'ckData']:checked").parents("tr").addClass("holdCommand");

        $("#Determine").off("click").on("click",function () {
            $(".holdCommand").remove();
            //将input的状态值设为false
        $("thead input[name = 'ckData']").prop("checked",false);
        $("thead input[name = 'ckData']")[0].indeterminate = false;
            $Popup.fadeOut();
            //禁用第一个选择框
            oDisable();
            selectOperation()
        });
        $("#cancel").off("click").on("click",function () {
            $(".holdCommand").removeClass();
          $Popup.fadeOut();
        })
    })
}

/*全选半选*/
function selectOperation() {
    //全选
    $("thead input[name = 'ckData']").off("click").on("click",function () {
        var $checked = $("thead input[name = 'ckData']").prop("checked");
        if ($checked){
            $("tbody input[name = 'ckData']").prop("checked",true);
        }
        else {
            $("tbody input[name = 'ckData']").prop("checked",false);
        }
    });
    //半选
    $("tbody input[name = 'ckData']").off("click").on("click",function () {
        var $ckData = $("tbody input[name = 'ckData']").length;
        var $ckData_length = $("tbody input[name = 'ckData']:checked").length;
        if ($ckData === $ckData_length){
            $("thead input[name = 'ckData']")[0].indeterminate = false;
            $("thead input[name = 'ckData']").prop("checked",true);
        }
        else if($ckData_length === 0){
            $("thead input[name = 'ckData']")[0].indeterminate = false;
            $("thead input[name = 'ckData']").prop("checked",false);
        }
        else {
            $("thead input[name = 'ckData']")[0].indeterminate = true;
        }
    })
}

/*输入框禁用*/
function oDisable() {
    //输入框禁用
    var $sortButton = $("#dataTable i");
    if($tbody.html() === ""){
        $("thead input[name = 'ckData']").css("cursor","not-allowed");
        $("thead input[name = 'ckData']").prop("disabled",true);
        $("thead input[name = 'ckData']").prop("checked",false);
        $("thead input[name = 'ckData']")[0].indeterminate = false;
        $sortButton.removeClass("up");
}
    else {
        $("thead input[name = 'ckData']").css("cursor","pointer");
        $("thead input[name = 'ckData']").removeAttr("disabled");
    }
}