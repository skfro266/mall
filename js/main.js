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

/***** 왼쪽카테고리 *****/
var sFn = function (data) {
	if (data.result) {
		for (var i = 0, html = '', rs; i < data.result.cates.length; i++) {
			rs = data.result.cates[i];
			html = '<li>';
			html += '<span class="' + rs.icon + '"></span>';
			html += '<a href ="' + rs.link + '"<span>' + rs.title + '</span></a>';
			if (rs.ajax != '') html += '<span class="fas fa-angle-right"></span>';
			html += '</li>';
			$(".banners .cate").append(html);
		}
	}
}

var cateAjax = new Ajax("../json/cate_left.json");
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
	$(".banner").children("li").hide();//find:자손 children:자식
	$(".banner").children("li").eq(banNow).show();
	$(".banner").children("li").eq(banNow).children(".ban_img").addClass("img_ani");
	$(".banner").children("li").eq(banNow).children("div").each(function (i) {
		$(this).css("animation-delay", i/5 + "s").addClass("ban_ani");
	});
	if (banNow == 2) banNow = -1;
	banNow++;
}).trigger("click");

$(".banners").mousemove(function(evt){
    var delta = 50;
    var cX = evt.clientX;
    var cY = evt.clientY;
    var iX = $(this).find(".ban_img").width()/2;
    var iY = $(this).find(".ban_img").height()/2;
    var mX = (iX - cX)/delta;
    var mY = (iY - cY)/delta;
    $(this).find(".ban_img").css("transform","translateX("+mX+"px, "+mY+"px)");
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