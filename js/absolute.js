(function autoHeight() {
    $(".hei-wrap").imagesLoaded().done(heiCalc);
    $(window).resize(heiCalc);
    function heiCalc() {
        $(".hei-wrap").each(function(){
            $(this).height($(this).find(".hei-elem").height());
        });
    }
})();
/*
 $(".wrap").each(function(){
    $(this).imagesLoaded().done(function(obj){
        var hei = $(".wrap").find(".box").height();
        $(".wrap").height(hei);
    });
});
 */