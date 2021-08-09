$(document).ready(function(){

    //左侧菜单
    $("#menu ul li").each(function(e){
        $(this).click(function(){
            $(this).addClass('active');
            $(this).siblings().removeClass('active');

            //显示右边内容
            let num = 'li' + e;
            $("#" + num).css({display:'block'});
            $("#" + num).siblings().css({display:'none'});
        });
    });
})


