/***** 자동높이 계산 *****/
function autoHeight() {
    $(".hei-wrap").imagesLoaded().done(heiCalc);
    $(window).resize(heiCalc);
    function heiCalc() {
        $(".hei-wrap").each(function(){
            $(this).height($(this).find(".hei-elem").height());
        });
    }
}
autoHeight();

/***** 이미지 로더 *****/
$('body').imagesLoaded()
  .done( function( instance ) {
		$(".loader").hide(0);
  })
  .progress( function( instance, image ) {
    var result = image.isLoaded ? 'loaded' : 'broken';
  });

/***** firebse 초기변수 *****/
var config = {
	apiKey: "AIzaSyCvuEVM1opXs4Eiq9iVmlXJ0EZyYDpk2Kg",
	authDomain: "skfro266-mall.firebaseapp.com",
	databaseURL: "https://skfro266-mall.firebaseio.com",
	projectId: "skfro266-mall",
	storageBucket: "skfro266-mall.appspot.com",
	messagingSenderId: "1012809377677"
};
firebase.initializeApp(config);

var db = firebase.database();
var ref;
var key;

/***** HOME *****/
(function initHome() {
	ref = db.ref("root/home");
	ref.on("child_added", homeAdd);
	ref.on("child_removed", homeRev);
	ref.on("child_changed", homeChg);
})();

function homeAdd(data) { //데이터가 추가될때 발생
	var id = data.key;
	var img = data.val().img;
	var src = '../img/main/' + img;
	var title = data.val().title;
	var link = data.val().link;
	var html = '';
	html += '<ul id="' + id + '">';
	html += '<li>';
	html += '<img src=' + src + ' class="img" onclick="gourl(\'' + link + '\');">';
	html += '<span>' + title + '</span>';
	html += '</li>';
	html += '</ul>';
	$("#modal0").append(html);
}

function homeRev(data) {
	var id = data.key;
	$("#" + id).remove();
}

function homeChg(data) {
	var id = data.key;
	var ul = $("#" + id);
	$("img", ul).attr("src", "../img/main/" + data.val().img);
	$("span", ul).html(data.val().title);
}

/***** SHOP *****/
(function initShop() {
	ref = db.ref("root/shop");
	ref.on("child_added", shopAdd);
	ref.on("child_removed", shopRev);
	ref.on("child_changed", shopChg);
})();

function shopAdd(data) { //데이터가 추가될때 발생
	shopMake("C", data);
}

function shopRev(data) {
	var id = data.key;
	$("#" + id).remove();
}

function shopChg(data) {
	shopMake("U", data);
}

function shopMake(chk, data) {
	var id = data.key;
	var v = data.val();
	var cnt = 0;
	var wid = 0;
	var html = '';
	if (chk == "C") html = '<ul id = "' + id + '">';
	html += '<li class="title">';
	html += '<a href="' + v.link + '">' + v.title + '</a>';
	if (v.icon) {
		html += '<div class="tooltip" style="background:' + v.color + '">'
		html += v.icon;
		html += '<div style="background:' + v.color + '"></div>';
		html += '</div>';
	}
	html += '</li>';
	if (chk == "C") {
		html += '</ul>';
		$("#modal1").append(html);
	} else {
		$("#" + id).html(html);
	}
	//ul의 개수에 따른 width 변화
	cnt = $("#modal1 > ul").length;
	wid = 100 / cnt + "%";
	$("#modal1 > ul").css("width", wid);

	//2차 카테고리 생성
	$("#modal1 > ul").each(function (i) { //each:jQuery의 각각의 객체에 접근
		var id = $(this).attr("id"); //ul의 아이디
		db.ref("root/shop/" + id + "/sub/").once("value").then(function (snapshot) {
			$("#" + id).find(".cont").remove();
			snapshot.forEach(function (item) { //forEach:객체 변수 각각에 접근 
				var id2 = item.key;
				var v = item.val();
				var html = '<li class="cont" id="' + id2 + '">' //id2는 li의 아이디
				html += '<a href="' + v.link + '">' + v.title + '</a>';
				if (v.icon) {
					html += '<div class="tooltip" style="background:' + v.color + '">'
					html += v.icon;
					html += '<div style="background:' + v.color + '"></div>';
					html += '</div>';
				}
				html += '</li>';
				$("#" + id).append(html);
			});
		});
	}); //ul마다 1번씩 실행
}





/***** UI *****/
$(".searchs .hand").click(function () {
	$(".search_catelist").stop().slideToggle(100);
});

$(".menu > ul > li").hover(function () {
	$(".menu_modal").stop().fadeOut(0);
	$(this).children(".menu_modal").stop().fadeIn(100);
}, function () {
	$(".menu_modal").stop().fadeOut(0);
});




$.ajax({
	url: "../json/cate2.json",
	type: "get",
	dataType: "json",
	success: function (data) {
		var html;
		var blogs = data.result.blog;
		var posts = data.result.recent;
		//blog생성
		for (var i = 0; i < blogs.length; i++) {
			html = '<ul>';
			html += '<li class="title">';
			html += '<a href="' + blogs[i].main.link + '">' + blogs[i].main.title + '</a>';
			if (blogs[i].main.icon != "") {
				html += '<div class="tooltip" style="background:' + blogs[i].main.color + '">';
				html += blogs[i].main.icon;
				html += '<div style="background:' + blogs[i].main.color + '"></div>';
				html += '</div>';
			}
			html += '</li>';
			for (var j = 0; j < blogs[i].sub.length; j++) {
				html += '<li class="sub">';
				html += '<a href="' + blogs[i].sub[j].link + '">' + blogs[i].sub[j].title + '</a>';
				if (blogs[i].sub[j].icon != "") {
					html += '<div class="tooltip" style="background:' + blogs[i].sub[j].color + '">';
					html += blogs[i].sub[j].icon;
					html += '<div style="background:' + blogs[i].sub[j].color + '"></div>';
					html += '</div>';
				}
				html += '</li>';
			}
			html += '</ul>';
			$("#modal2 > .blogs").append(html);
		}
		//recent생성
		for (var i = 0; i < posts.length; i++) {
			html = '<ul>';
			html += '<li class="post clear" onclick="goPost(\'' + posts[i].link + '\');">';
			html += '<img src="' + posts[i].img + '" class="img post_img hover">';
			html += '<div>';
			html += '<div class="post_title">' + posts[i].title + '</div>';
			html += '<span class="post_date">' + posts[i].date + '</span>';
			html += '<span class="post_cnt">' + posts[i].comment + '</span>';
			html += '<span class="post_comment">comment</span>';
			html += '</div>';
			html += '</li>';
			html += '</ul>';
			$("#modal2 > .recents").append(html);
		}
	},
	error: function (xhr, status, error) {
		alert("통신이 원활하지 않습니다.\n잠시후 다시 시도해주세요.")
		console.log(xhr, status, error);
	}
});


/***** 왼쪽 카테고리 패널 0번(furniture) *****/
var furniture = [];
furniture[0] = [];
furniture[1] = [];
furniture[2] = [];
furniture[3] = [];
furniture[0][0] = "../img/main/menu-product-1-118x118.jpg";
furniture[1][0] = "../img/main/menu-product-3-118x118.jpg";
furniture[2][0] = "../img/main/menu-product-3-2-118x118.jpg";
furniture[3][0] = "../img/main/menu-product-5-2-118x118.jpg";
furniture[0][1] = "CLOCKS";
furniture[1][1] = "TABLETOP";
furniture[2][1] = "KITCHEN";
furniture[3][1] = "LIGHTING";
furniture[0][2] = "Mantel Clocks";
furniture[1][2] = "Pepper Shakers";
furniture[2][2] = "Oil Vineager Sets";
furniture[3][2] = "Interior Lighting";
furniture[0][3] = "Anniversary Clocks";
furniture[1][3] = "Spice Jars";
furniture[2][3] = "Bottle Racks";
furniture[3][3] = "Celling Lamps";
furniture[0][4] = "Wall Clocks";
furniture[1][4] = "Dish Drainers";
furniture[2][4] = "Chopping Boards";
furniture[3][4] = "Wall LAmps";
furniture[0][5] = "Digital Clocks";
furniture[1][5] = "Cocktail Shakers";
furniture[2][5] = "Vacuum Flasks";
furniture[3][5] = "Floor Lamps";
furniture[0][6] = "Travel and Alarm";
furniture[1][6] = "Utensil HOlders";
furniture[2][6] = "Utensil HOlders";
furniture[3][6] = "Celling Lamps";
var furnitureBrand = [];
furnitureBrand[0] = "../img/main/brand-alessi.png";
furnitureBrand[1] = "../img/main/brand-Eva-Solo.png";
furnitureBrand[2] = "../img/main/brand-PackIt.png";
furnitureBrand[3] = "../img/main/brand-witra.png";

/***** 왼쪽카테고리 *****/
var sFn = function (data) {
	if (data.result) {
		for (var i = 0, html = '', rs; i < data.result.cates.length; i++) {
			rs = data.result.cates[i];
			html = '<li>';
			html += '<span class="' + rs.icon + '"></span>';
			html += '<a href ="' + rs.link + '"<span>' + rs.title + '</span></a>';
			if (rs.ajax != '') {
				html += '<span class="fas fa-angle-right"></span>';
				html += '<div class="cate_panel clear">';
				/***** 패널생성,시작 *****/
				if (i == 0) {
					for (var j = 0; j < furniture.length; j++) {
						html += '<ul id="fur_panel' + i + '" class="fur_panel">';
						html += '<li><img src="' + furniture[j][0] + '" class="img"></li>';
						html += '<li>' + furniture[j][1] + '</li>';
						html += '<li>' + furniture[j][2] + '</li>';
						html += '<li>' + furniture[j][3] + '</li>';
						html += '<li>' + furniture[j][4] + '</li>';
						html += '<li>' + furniture[j][5] + '</li>';
						html += '<li>' + furniture[j][6] + '</li>';
						html += '</ul>';
					}
					html += '<ul class="fur_brand_panel clear">';
					for (var j = 0; j < furnitureBrand.length; j++) {
						html += '<li><img src="' + furnitureBrand[j] + '" class="img w3-grayscale-max w3-opacity"></li>';
					}
					html += '</ul>';
				}
				/***** 패널생성,종료 *****/
				html += '</div>';
			}
			html += '</li>';
			$(".banners .cate").append(html);
		}
		$(".cate > li").hover(function () {
			$(this).find(".cate_panel").show();
		}, function () {
			$(this).find(".cate_panel").hide();
		});
		$(".fur_brand_panel img").hover(function () {
			$(this).removeClass("w3-grayscale-max w3-opacity");
		}, function () {
			$(this).addClass("w3-grayscale-max w3-opacity");
		});
	}
}

var cateAjax = new Ajax("../json/cate_left.json");
//cateAjax.addData({chk:0});
cateAjax.send(sFn);
/*
$(".banner > li").each(function(i){
	$(this).children("div").each(function(i){
		$(this).css("animation-delay", i/5+"s").addClass("ban_ani");
	});
});
*/
var banNow = 0;
$(".banners .rt_arrow").click(function () {
	$(".banner").children("li").hide();
	$(".banner").children("li").eq(banNow).show();
	$(".banner").children("li").eq(banNow).children(".ban_img").addClass("img_ani");
	$(".banner").children("li").eq(banNow).children("div").each(function (i) {
		$(this).css("animation-delay", i / 5 + "s").addClass("ban_ani");
	});
	if (banNow == 2) banNow = -1;
	banNow++;
}).trigger("click");

$(".banners").mousemove(function (evt) {
	var delta = 50;
	var cX = evt.clientX;
	var cY = evt.clientY;
	var iX = $(this).find(".ban_img").width() / 2;
	var iY = $(this).find(".ban_img").height() / 2;
	var mX = (iX - cX) / delta;
	var mY = (iY - cY) / delta;
	$(this).find(".ban_img").css("transform", "translate(" + mX + "px, " + mY + "px)");
});


// cateAjax.addData({chk:0});
/*
                <ul>
                  <li class="title"><a href="#">DEMO LAYOUTS</a></li>
                  <li class="sub"><a href="#">Categories</a></li>
                </ul>
                <ul>
                  <li class="title"><a href="#">DEMO LAYOUTS</a></li>
                  <li class="sub"><a href="#">Categories</a></li>
                </ul>
                <ul>
                  <li class="title"><a href="#">DEMO LAYOUTS</a></li>
                  <li class="sub"><a href="#">Categories</a></li>
                </ul>
*/


/*
function modalMake1() {
	var html = '';
	var wid = 100 / cates.length + "%";
	for (var i = 0; i < cates.length; i++) {
		html = '<ul style ="width:' + wid + '">';
		*/
/*
'<ul style ="width:' + wid + '">'
='<ul style ="width:' + 100 / cates.length + "%" + '">'
='<ul style ="width:' + 100 / 6 + "%" + '">'
='<ul style ="width:' + 16.66666666666667%+ '">'
='<ul style ="width:16.66666666666667%">'
*/
/*
html += '<li class="title">'
html += '<a href="' + cates[i].main.link + '">' + cates[i].main.title + '</a>';
*/
/*
'<a href="' + cates[i].main.link + '">' + cates[i].main.title + '</a>'
='<a href="' + # + '">' + cates[i].main.title + '</a>'
='<a href="#">cates[i].main.title의 내용</a>'
*/
/*
if (cates[i].main.icon != "") {
	html += '<div class="tooltip"style="background:'+cates[i].main.color+'">';
	html +=  cates[i].main.icon;
	html +=  '<div style="background:'+cates[i].main.color+'"></div>';
	html += '</div>';
}
*/
/*
=<div class="tooltip"style="background:cates[i].main.color">
	cates[i].main.icon의 내용
	<div style ="background:cates[i].main.color"></div>
</div>
의 결과가 나온다.
*/
/*
html += '</li>'
for (var j = 0; j < cates[i].sub.length; j++) {
	html += '<li class="cont">'
	html += '<a href="' + cates[i].sub[j].link + '">' + cates[i].sub[j].title + '</a>';
	*/
/*
'<a href="' + cates[i].sub[j].link + '">' + cates[i].sub[j].title + '</a>'
='<a href="#">cates[i].sub[j].title 의 내용</a>
*/
/*
			if (cates[i].sub[j].icon != "") {
				html += '<div class="tooltip"style="background:'+cates[i].sub[j].color+'">';
				html +=  cates[i].sub[j].icon;
				html +=  '<div style="background:'+cates[i].sub[j].color+'"></div>';
				html +=  '</div>';
			}
			html += '</li>';
		}
		html += '</ul>';
		$("#modal1").append(html);
	}
	$("#modal1 .tooltip").each(function(){
		var n = $(this).prev().html().length;
		$(this).css({"left": n*5+"px"});
	});
}
modalMake1();
*/
/***** Featured *****/
$(".featured_item").hover(function () {
	$(this).find("div").stop().animate({
		"bottom": 0
	}, 200);
	$(this).find("img").css({
		"animation-name": "featuredAni"
	});
}, function () {
	$(this).find("div").stop().animate({
		"bottom": "-3rem"
	}, 200);
	$(this).find("img").css({
		"animation-name": "featuredAniBack"
	});
});

/***** Featured Products *****/
var prdNum = 0;
/*
$.ajax({
	url: "../json/prds.json",
	type: "post",
	dataType: "json",
	success: function(data) {
		//여기가 실행 구문
		console.log(data);
	},
	error: function(xhr, status, error) {
		console.log(xhr, status, error);
	}
});
*/

// {"result":[{"title":"best", "data":[{},{}]},{...},{...}]} --> data 구조입니다.
var prds = new Ajax("../json/prds.json");
prds.send(resultFn);
function resultFn(data) {
	var html = '';
	var li;
	for(var i=0; i<data.result.length; i++){
		html = '<ul class="prd_wrap clear hei-elem">';
		for(var j=0; j<data.result[i].data.length; j++) {
			li = data.result[i].data[j];
			html+= '<li class="prd">';
			html+= '<div class="prd_img">';
			html+= '<img src="'+li.img[0]+'" class="img">';
			html+= '</div>';
			html+= '<div class="prd_tit">'+li.title+'</div>';
			html+= '<div class="prd_cate">'+li.cate+'</div>';
			html+= '<div class="prd_price">';
			html+= '<span>'+li.price[0]+'</span>';
			html+= '<span>'+li.price[1]+'</span>';
			html+= '</div>';
			html+= '<div class="prd_hover">';
			html+= '<div class="prd_img">';
			html+= '<img src="'+li.img[1]+'" class="img prd_hover_img">';
			html+= '</div>';
			html+= '<ul>';
			html+= '<li class="prd_compare">';
			html+= '<div>';
			html+= '<img src="../img/main/baseline-compare_arrows-24px.svg">';
			html+= '</div>';
			html+= '</li>';
			html+= '<li class="prd_tit">'+li.title+'</li>';
			html+= '<li class="prd_cate">'+li.cate+'</li>';
			html+= '<li class="prd_price">';
			html+= '<span>'+li.price[0]+'</span>';
			html+= '<span>'+li.price[1]+'</span>';
			html+= '</li>';
			html+= '<li class="prd_cont">';
			html+= li.cont;
			html+= '<div><i class="fa fa-ellipsis-h"></i></div>';
			html+= '</li>';
			html+= '<li class="prd_detail clear">';
			html+= '<div>';
			html+= '<a href="#" data-toggle="tooltip" data-placement="top" title="Add to Wishlist">';
			html+= '<img src="../img/main/baseline-favorite_border-24px.svg">';
			html+= '</a>';
			html+= '</div>';
			html+= '<ul>';
			html+= '<li>VIEW PRODUCTS</li>';
			html+= '<li><i class="fa fa-shopping-cart"></i></li>';
			html+= '</ul>';
			html+= '<div>';
			html+= '<a href="#" data-toggle="tooltip" data-placement="top" title="Search">';
			html+= '<img src="../img/main/baseline-search-24px (2).svg">';
			html+= '</a>';
			html+= '</div>';
			html+= '</li>';
			html+= '</ul>';
			html+= '</div>';
			if(li.pct > 0) html+= '<div class="prd_pop">-'+li.pct+'%</div>';
			html+= '</li>';
		}
		html+= '</ul>';
		$(".prd_out_wrap").append(html);
		autoHeight();
	}
	//생성완료된 후 이벤트 처리
	$(".prd_nav > li").click(function(){
		$(".prd_wrap").eq(prdNum).stop().animate({"top":"5rem", "opacity":0}, 500, function(){
			$(this).css({"display":"none"});	
		});
		prdNum = $(this).index();
		$(".prd_wrap").eq(prdNum).css({"display":"block"}).stop().animate({"top":0, "opacity":1}, 500);
		$(".prd_nav > li").css({"color":"#666"});
		$(".prd_nav div").css({"width":0});
		$(this).css({"color":"#222"});
		$(this).children("div").css({"width":"100%"});
	});
	$(".prd_nav > li").hover(function(){
		if($(this).index() != prdNum) {
			$(this).css({"color":"#222"});
			$(this).children("div").stop().animate({"width":"100%"}, 100);
		}
	},function(){
		if($(this).index() != prdNum) {
			$(this).css({"color":"#666"});
			$(this).children("div").stop().animate({"width":0}, 100);
		}
	});
	$(".prd_nav > li").eq(0).trigger("click");
	
	$(".prd").hover(function(){
		$(this).children(".prd_hover").stop().fadeIn(300);
		$(this).find(".prd_compare").find("div").stop().animate({"top":"-43px"}, 300);	
		if($(this).find(".prd_cont")[0].offsetHeight < $(this).find(".prd_cont")[0].scrollHeight) {
			console.log("overflow");
			$(this).find(".prd_cont").children("div").stop().animate({"bottom":0}, 200);
			$(this).find(".prd_cont").children("div").click(function(){
				$(this).parent().css({"height":"auto"});
				$(this).hide(0);
			});
		}
		$(this).find(".prd_detail").children("ul").hover(function(){
			$(this).children(":first-child").stop().animate({"margin-top":"-38px"}, 200);
		}, function(){
			$(this).children(":first-child").stop().animate({"margin-top":0}, 200);
		});
	}, function(){
		$(this).children(".prd_hover").stop().fadeOut(300);
		$(this).find(".prd_compare").find("div").stop().animate({"top":0}, 300);
		if($(this).find(".prd_cont")[0].offsetHeight < $(this).find(".prd_cont")[0].scrollHeight) {
			$(this).find(".prd_cont").children("div").stop().animate({"bottom":"-20px"}, 200);
		}
	});
	$(".prd_hover_img").hover(function(){
		$(this).stop().animate({"opacity":1}, 200).css({"animation-name":"prdImg"});
	}, function(){
		$(this).stop().animate({"opacity":0}, 200).css({"animation-name":"prdImgBack"});
	});
	$('[data-toggle="tooltip"]').tooltip(); 
}

/***** 하단 배너 *****/
var fNum = 0;	//현재의 index
var fLen = $(".fban > li").length - 1;	//마지막 index (예:5개라면 0,1,2,3,4 -> 4)
var duration = 500;	//animate 속도
$(window).resize(function(){
	//본 작업을 진행하는 이유는 absolute 되어 있는 객체의 높이를 계산하기 위해서..
	$(".fban").height($(".fban > li").eq(fNum).height()+30);
}).trigger("resize");
//최초 한번 실행
$(".fban > li").each(function(i){
	$('<i class="fa-circle"></i>').appendTo("#fban_pager").click(function(){
		var iNum = $(this).index();
		if(fNum < iNum) {
			$(".fban > li").eq(fNum + 1).hide();
			$(".fban > li").eq(iNum).show().css({"left":"100%"});
			fNum = iNum;
			fbanAni("-100%");
		}
		else if(fNum > iNum) {
			$(".fban > li").eq(fNum - 1).hide();
			$(".fban > li").eq(iNum).show().css({"left":"-100%"});
			fNum = iNum;
			fbanAni("100%");
		}
	});
});
fbanPos();
function fbanAni(val) {
	$(".fban > li").eq(fNum).css({"animation-name":"fbanAni", "animation-duration":duration*0.001+"s"});
	$(".fban").stop().animate({"left":val}, duration, fbanPos);
}
function fbanPos() {
	$(".fban").height($(".fban > li").eq(fNum).height()+30);
	$("#fban_pager > i").removeClass("fas").addClass("far");
	$("#fban_pager > i").eq(fNum).removeClass("far").addClass("fas");
	$(".fban > li").hide().css({"animation-name":""});
	$(".fban").css({"left":0});
	$(".fban > li").eq(fNum).show().css({"left":0});
	if(fNum == 0) {
		$(".fban > li").eq(fLen).show().css({"left":"-100%"});
		$(".fban > li").eq(1).show().css({"left":"100%"});
	}
	else if(fNum == fLen) {
		$(".fban > li").eq(fNum - 1).show().css({"left":"-100%"});
		$(".fban > li").eq(0).show().css({"left":"100%"});
	}
	else {
		$(".fban > li").eq(fNum - 1).show().css({"left":"-100%"});
		$(".fban > li").eq(fNum + 1).show().css({"left":"100%"});
	}
}
$("#fban_lt").click(function(){
	if(fNum == fLen) fNum = 0;
	else fNum++;
	fbanAni("-100%");
});
$("#fban_rt").click(function(){
	if(fNum == 0) fNum = fLen;
	else fNum--;
	fbanAni("100%");
});
