  // Initialize Firebase
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
  function initHome() {
      $(".list:not(#home_wr)").remove();
      ref = db.ref("root/home");
      ref.on("child_added", homeAdd);
      ref.on("child_removed", homeRev);
      ref.on("child_changed", homeChg);
  }
  initHome();

  function homeAdd(data) { //데이터가 추가될때 발생
      var id = data.key;
      var img = data.val().img;
      var src = '../img/main/' + img;
      var title = data.val().title;
      var link = data.val().link;
      var html = '';
      html += '<ul class="list clear row" id="' + id + '">';
      html += '<li class="col-xs-4 col-sm-3 col=md-2 col-lg-2">';
      html += '<div>';
      html += '<img src ="' + src + '">';
      html += '<input type="text" class="tit_img form-control" placeholder="이미지" value="' + img + '">';
      html += '</div>';
      html += '</li>';
      html += '<li class="col-xs-4 col-sm-6 col-md-7 col-lg-8">';
      html += '<div>';
      html += '<input type="text" class="title form-control" placeholder="타이틀" value="' + title + '">';
      html += '<input type="text" class="link form-control" style="margin-top:5px;" placeholder="링크주소" value="' + link + '">';
      html += '</div>';
      html += '</li>';
      html += '<li class="col-xs-4 col-sm-3 col-md-3 col-lg-2">';
      html += '<div>';
      html += '<button class="btn btn-danger" onclick="homeDel(this);">삭제</button> ';
      html += '<button class="btn btn-warning" onclick="homeUp(this);">수정</button>';
      html += '</div>';
      html += '</li>';
      html += '</ul>';
      $("#home_wrap").append(html);
  }

  function homeRev(data) {
      var id = data.key;
      $("#" + id).remove();
  }

  function homeChg(data) {
      var id = data.key;
      var ul = $("#" + id);
      $("img", ul).attr("src", "../img/main/" + data.val().img);
      alert("수정되었습니다.");
  }

  $("#home_save").on('click', function () {
      var img = $("#home_wr .tit_img").val(); //id가 home_save를 클릭하면 id가 home_wr의 클래스가 tit_img의 값을 가져온다.
      var title = $("#home_wr .title").val(); //id가 home_save를 클릭하면 id가 home_wr의 클래스가 title의 값을 가져온다.
      var link = $("#home_wr .link").val(); //id가 home_save를 클릭하면 id가 home_wr의 의 클래스가 link의 값을 가져온다.
      if (title == '' || link == '' || img == '') { //title과 link와 img가 빈값이거나 셋중 하나가 빈값이면 alert창이 뜬다.
          alert("내용을 적어주세요.");
      } else { //title과 link와 img의 값이 빈값이 아니면 firebase의 database의 ref의 root안의 home안에 title과 link, img값이 저장된다.
          ref = db.ref("root/home");
          ref.push({
              img: img,
              title: title,
              link: link
          }).key;
          alert("등록되었습니다.")
      }
  });

  function homeUp(obj) {
      var ul = $(obj).parent().parent().parent();
      var id = ul.attr("id");
      var img = $(".tit_img", ul).val();
      var title = $(".title", ul).val();
      var link = $(".link", ul).val();
      if (title == '' || link == '' || img == '') {
          alert("내용을 적어주세요.");
      } else {
          ref = db.ref("root/home/" + id);
          ref.update({
              img: img,
              title: title,
              link: link
          });

      }
  };

  function homeDel(obj) {
      if (confirm("정말로 삭제하시겠습니까?")) {
          // var id =obj.parentNode.parentNode.parentNode.id;
          var id = $(obj).parent().parent().parent().attr("id"); //attr: class나 id같은 코드를 의미함
          if (id != "") {
              db.ref("root/home/" + id).remove();
          }
      }
  }

  /***** SHOP ******/
  //페이지가 생성될때 한번 실행되며 shop레퍼런스에 콜백을 링크한다.
  function initShop() {
      $(".grid > ul").remove();
      ref = db.ref("root/shop"); //기준점. 기준점을 기준으로 함수 실행
      ref.on("child_added", shopAdd);
      ref.on("child_removed", shopRev);
      ref.on("child_changed", shopChg);
  }
  initShop();

  //chk의 변수의 값(C, U)에 따라 ul을 생성 또는 수정한다.
  function shopMake(chk, data) {
      var id = data.key; //key: firebase의 databaser의 id값
      var html = '';
      if (chk == 'C') html += '<ul id="' + id + '" class="grid-item">';
      html += '<li class="shop_li1 clear">';
      html += '<div>';
      html += '<input type="text" value="' + data.val().title + '" class="title form-control" placeholder="제목">';
      html += '<input type="text" value="' + data.val().icon + '" class="icon form-control" placeholder="아이콘">';
      html += '<input type="text" value="' + data.val().color + '" class="color form-control" placeholder="아이콘컬러">';
      html += '<input type="text" value="' + data.val().link + '" class="link form-control" placeholder="링크">';
      html += '</div>';
      html += '<div>';
      html += '<button class="btn btn-danger" onclick="shopDel(this);">삭제</button>';
      html += '<button class="btn btn-warning" onclick="shopUp(this);">수정</button>';
      html += '</div>';
      html += '</li>';
      html += '<li class="shop_li2 clear shop_li2_wr">';
      html += '<div>';
      html += '<input type="text" class="title form-control" placeholder="제목">';
      html += '<input type="text" class="icon form-control" placeholder="아이콘">';
      html += '<input type="text" class="color form-control" placeholder="아이콘컬러">';
      html += '<input type="text" class="link form-control" placeholder="링크">';
      html += '</div>';
      html += '<div>';
      html += '<button class="btn btn-primary" onclick="shopAdd2(this)">저장</button>';
      html += '</div>';
      html += '</li>';
      if (chk == 'C') {
          html += '</ul>';
          $(".grid").append(html);
      } else if (chk == 'U') {
          $("#" + id).html(html);
      }
      if (data.val().sub) {
          db.ref("root/shop/" + id + "/sub").once("value").then(function (snapshot) {
              snapshot.forEach(function (item) {
                  html = '<li class="shop_li2 clear" id="' + item.key + '">';
                  html += '<div>';
                  html += '<input type="text" value="' + item.val().title + '" class="title form-control" placeholder="제목">';
                  html += '<input type="text" value="' + item.val().icon + '" class="icon form-control" placeholder="아이콘">';
                  html += '<input type="text" value="' + item.val().color + '" class="color form-control" placeholder="아이콘컬러">';
                  html += '<input type="text" value="' + item.val().link + '" class="link form-control" placeholder="링크">';
                  html += '</div>';
                  html += '<div>';
                  html += '<button class="btn btn-danger" onclick="shopDel2(this);">삭제</button>';
                  html += '<button class="btn btn-warning" onclick="shopUp2(this);">수정</button>';
                  html += '</div>';
                  html += '</li>';
                  $("#" + id).append(html);
              });
          });
      }
  }


  //child_added콜백
  function shopAdd(data) {
      var id = data.key;
      shopMake('C', data);
  }

  //child_removed콜백
  function shopRev(data) {
      var id = data.key;
      $("#"+id).remove();
  }


  //child_changed콜백
  function shopChg(data) {
      var id = data.key;
      shopMake('U', data);
  }


  //1차 카테고리 생성
  $(".shop_wr").click(function () {
      var title = $(".shop_li0 .title").val();
      var icon = $(".shop_li0 .icon").val();
      var color = $(".shop_li0 .color").val();
      var link = $(".shop_li0 .link").val();
      if (title == "") {
          alert("제목을 입력하세요.");
          $(".shop_li0 .title").focus();
      } else {
          ref = db.ref("root/shop");
          ref.push({
              title: title,
              icon: icon,
              color: color,
              link: link
          }).key;
      }
  });

  //2차 카테고리 생성
  function shopAdd2(obj) {
      var div = $(obj).parent().prev();
      var idUl = $(obj).parent().parent().parent().attr("id");
      var title = $(".title", div).val();
      var icon = $(".icon", div).val();
      var color = $(".color", div).val();
      var link = $(".link", div).val();
      ref = db.ref("root/shop/" + idUl + "/sub");
      ref.push({
          title: title,
          icon: icon,
          color: color,
          link: link
      }).key;
  }

  //1차 카테고리 삭제
  function shopDel(obj) {
      if(confirm("정말로 삭제하시겠습니까?\n1차 카테고리 삭제시 하위 카테고리도 삭제됩니다.")){
        var id =$(obj).parent().parent().parent().attr("id");
        db.ref("root/shop/"+id).remove();//firebase의 database의 root의 shop의 id까지 접슨하여 remove해준다.
      }
  }

  //1차 카테고리 수정
  function shopUp(obj) {
      var id = $(obj).parent().parent().parent().attr("id");
      var div = $(obj).parent().prev();
      var title = $(".title", div).val();
      var icon = $(".icon", div).val();
      var color = $(".color", div).val();
      var link = $(".link", div).val();
      if(title == ""){
          alert("카테고리명을 입력하세요.");
          $(".title", div).focus();
          return false;
      }
      else{
          db.ref("root/shop/"+id).update({
              title: title,
              icon: icon,
              color: color,
              link: link
          });
      }
  }

  //2차 카테고리 삭제
  function shopDel2(obj) {
    if(confirm("정말로 삭제하시겠습니까?")){
      var id = $(obj).parent().parent().parent().attr("id");//ul
      var id2 = $(obj).parent().parent().attr("id");//li
      db.ref("root/shop/"+id+"/sub/"+id2).remove();
    }
  }

  //2차 카테고리 수정
  function shopUp2(obj) {
    var id = $(obj).parent().parent().parent().attr("id");//ul
    var id2 = $(obj).parent().parent().attr("id");//li
    var div = $(obj).parent().prev();
    var title = $(".title", div).val();
    var icon = $(".icon", div).val();
    var color = $(".color", div).val();
    var link = $(".link", div).val();
    if(title == ""){
        alert("카테고리명을 입력하세요.");
        $(".title", div).focus();
        return false;
    }
    else{
        db.ref("root/shop/"+id+"/sub/"+id2).update({
            title: title,
            icon: icon,
            color: color,
            link: link
        });
    }
  }

  /***** UI *****/
  $(".nav").on("click", function () {
      var n = $(this).index();
      $(".nav").css({
          "background-color": "",
          "color": ""
      }); //3개의 section의 색이default된다.
      $(this).css({
          "background": "rgb(29,58,102)",
          "color": "#fff"
      }); //클릭된 nav의 css
      $(".section").hide();
      $(".section").eq(n).show();
  });
  $(".nav").eq(0).trigger("clcik"); //trigger로 인해 먼저 시작 (0번째부터)

  /***** 참조사항 *****/
  /*
  || : or 연산자(이거나) => true||true(true) / true||false(true) / false||false(false) 둘중 하나만 참이여도 결과는 참이다.
  && : and 연산자(그리고) => true||true(true) / true||false(false) / false||false(true) 둘다 참이여야 결과는 참이다.

  //var img = $("#home_wr .tit_img").val();
  //var img = $(".tit_img", "#home_wr").val();
  //var img = $("#home_wr").find(".tit_img").val();
  //var img = $("#home_wr").children(".tit_img").val();
  */