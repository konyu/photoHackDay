// api url
var url="http://ajax.googleapis.com/ajax/services/search/images?v=1.0&callback=response";
// 検索語
//var word="Marion Cotillard";
// 開始ページ
var start = 0;
// 取得件数
var rsz = 8;
// サイト指定
var as_sitesearch='facebook.com';

// 画像URL参照用配列
var imageUrlArray=[];

// $(function() {
//     search();
// });

function submitStop(e){
    if (!e) var e = window.event;

    if(e.keyCode == 13)
      return false;
}

// 検索
function search() {
  start=0;
    $("#images").html("");
    addScript();
}

// 画像選択
function selectImg(imageURL){
  $('#res').PostImageURL('RCGHACKA02', imageURL);
  $('body').viewImageURL(imageURL);
};


// scriptタグ生成
function addScript() {
    var src = url + "&q=" + $("#word").val() + "&as_sitesearch=" + as_sitesearch +"&imgsz=small|medium|large|xlarge" +"&start=" + start + "&rsz=" + rsz;
    $("head").append($(document.createElement("script")).attr("src", src));
}

// apiコールバック
function response(data) {
  var str = "";
  if (data.responseData === null) {
    return;
  }

    // データ取得
  for (var ii in data.responseData.results) {
    var no = eval(start) + eval(ii);
    var title = data.responseData.results[ii].titleNoFormatting;  // タイトル
    var htmlUrl = data.responseData.results[ii].originalContextUrl; // ページurl
    var imageUrl = data.responseData.results[ii].unescapedUrl;    // 画像url
    imageUrlArray.push(imageUrl);
    // console.dir(imageUrl);
    // 画像表示させたくないときは↓コメントアウト
    // str += (no + 1) + ':' + '<a href="' + htmlUrl + '" target="_blank">' + title + '</a><br>';
    str += '<img style="width:300px;" src="' + imageUrl + '"><br><br>';
    str += '<input type="button" value="Oh,,, you look so sad." class="btn btn-primary btn-lg" onclick=selectImg("'+imageUrl+'");><br><br><br><br><br><br>';
  }

  $("#images").append(str);

    // 開始ページを設定して、scriptタグ生成を再帰
  start = eval(start) + eval(rsz);
  addScript();
}
