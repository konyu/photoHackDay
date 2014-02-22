(function($) {

	// リクエストドメイン
	var REQ_URL = "http://eval.api.pux.co.jp:8080";
	// リクエストパス
	var REQ_PATH = "/webapi/face.do";

    var imgData;
    var rate;//縦横比
    var power;//元画像との倍率
	function PutLog(node, str) {
		$(node).append('<plaintext>' + str);
	}

	/*
	 * imageURL での送信
	 */
	$.fn.PostImageURL = function(api_key, in_url) {
		var divNode = this[0];
		// パラメータの生成
		var data = {
			"apiKey" : api_key,
			"imageURL" : decodeURIComponent(in_url)
		};
		var url = REQ_URL + REQ_PATH;
	    $.ajax({
	    	type:"POST",
	    	url:url,
	    	data:data,
	    	success: function(xmlDoc){
	    		PutLog(divNode, '正常に送信できました');
				if (console.dirxml) {
					console.dirxml(xmlDoc);
				}
				var xs = new XMLSerializer();
	    		PutLog(divNode, xs.serializeToString(xmlDoc));
	    		imgData = getFaceDataFromXML(xmlDoc);
	    		rate = viewImageURL(in_url, imgData);
	    	},
	    	error: function(xhr, status, err){
	    		PutLog(divNode, '問題が発生しました:' + status + ' error:' + err);
	    		var xmlDoc = xhr.responseXML;
				if (console.dirxml) {
					console.dirxml(xmlDoc);
				}
				var xs = new XMLSerializer();
	    		PutLog(divNode, xs.serializeToString(xmlDoc));
	    	}
	    });

        return this;
	};

	/*
	 * inputFile での送信
	 */
	$.fn.PostFileSend = function(api_key, in_file) {
		var divNode = this[0];
		PutLog(divNode, '------------------------------------');
		PutLog(divNode, 'APIKEY:' + api_key);
		PutLog(divNode, 'IMAGE:' + in_file.name);
		// パラメータ用フォームデータの生成
		var formData = new FormData();
		formData.append('apiKey', api_key);
		formData.append('inputFile', in_file);
		var url = REQ_URL + REQ_PATH;
	    $.ajax({
	    	type:"POST",
	    	url:url,
	    	contentType: false,
	    	processData: false,
	    	data:xml,
	    	success: function(xmlDoc){
	    		PutLog(divNode, '正常に送信できました');
				if (console.dirxml) {
					console.dirxml(xmlDoc);
				}
				var xs = new XMLSerializer();
	    		PutLog(divNode, xs.serializeToString(xmlDoc));
	    		imgData = xmlPerser(xmlDoc);
	    		rate = viewImageURL(imageURL, imgData);
	    	},
	    	error: function(xhr, status, err){
	    		PutLog(divNode, '問題が発生しました:' + status + ' error:' + err);
	    		var xmlDoc = xhr.responseXML;
				if (console.dirxml) {
					console.dirxml(xmlDoc);
				}
				var xs = new XMLSerializer();
	    		PutLog(divNode, xs.serializeToString(xmlDoc));
	    	}
	    });

        return this;
	};

	/*
	 * inputBase64 での送信
	 */
	$.fn.PostBase64Send = function(api_key, in_file) {
		var divNode = this[0];
		PutLog(divNode, '------------------------------------');
		PutLog(divNode, 'APIKEY:' + api_key);
		PutLog(divNode, 'IMAGE:' + in_file.name);
		var reader = new FileReader();
		reader.onload = function(evt) {
			PutLog(divNode,'read:' + evt.target.result);
			var dataURL = evt.target.result;
			// パラメータの生成
			var data = {
				"apiKey" : api_key,
				"inputBase64" : dataURL
			};
			var url = REQ_URL + REQ_PATH;
		    $.ajax({
		    	type:"POST",
		    	url:url,
		    	data:data,
		    	success: function(xmlDoc){
		    		PutLog(divNode, '正常に送信できました');
					if (console.dirxml) {
						console.dirxml(xmlDoc);
					}
					var xs = new XMLSerializer();
		    		PutLog(divNode, xs.serializeToString(xmlDoc));
		    	},
		    	error: function(xhr, status, err){
		    		//alert("問題が発生しました");
		    		PutLog(divNode, '問題が発生しました:' + status + ' error:' + err);
		    		var xmlDoc = xhr.responseXML;
					if (console.dirxml) {
						console.dirxml(xmlDoc);
					}
					var xs = new XMLSerializer();
		    		PutLog(divNode, xs.serializeToString(xmlDoc));
		    	}
		    });
		};
		reader.readAsDataURL(in_file);

        return this;
	};

/* xmlから顔画像の必要な要素を取り出す
 * 左右眼の中心、外内端、口中心、外内端、笑顔レベル
 * 画像のサイズ
*/
function getFaceDataFromXML(xml){
  //顔のノードを全部取り出す。
  var imgData = {};
  var faces = [];
  console.log(xml);
  //画像のサイズを取り出す
  imgData['width'] = parseInt($(xml).find('width').text());
  imgData['height'] = parseInt($(xml).find('height').text());
  //一人ひとりの顔データを取り出す
  $(xml).find('detectionFaceInfo').each(function(i){
    //人数分の処理ができる
    //console.log($(this).text());
    var face = {};
    //笑顔レベル取得
    face['smileLevel'] = parseInt($(this).find('smileLevel').text());

    //左目中心取得
    var pos = {};
    pos['x'] = parseInt($(this).find('leftBlackEyeCenter').attr('x'));
    pos['y'] = parseInt($(this).find('leftBlackEyeCenter').attr('y'));
    face['leftBlackEyeCenter'] = pos;

    //左目外側取得
    pos = {};
    pos['x'] = parseInt($(this).find('leftEyeOutsideEnd').attr('x'));
    pos['y'] = parseInt($(this).find('leftEyeOutsideEnd').attr('y'));
    face['leftEyeOutsideEnd'] = pos;

    //左目内側取得
    pos = {};
    pos['x'] = parseInt($(this).find('leftEyeInsideEnd').attr('x'));
    pos['y'] = parseInt($(this).find('leftEyeInsideEnd').attr('y'));
    face['leftEyeInsideEnd'] = pos;

    //右目中央取得
    pos = {};
    pos['x'] = parseInt($(this).find('rightBlackEyeCenter').attr('x'));
    pos['y'] = parseInt($(this).find('rightBlackEyeCenter').attr('y'));
    face['rightBlackEyeCenter'] = pos;

    //右目外側取得
    pos = {};
    pos['x'] = parseInt($(this).find('rightEyeOutsideEnd').attr('x'));
    pos['y'] = parseInt($(this).find('rightEyeOutsideEnd').attr('y'));
    face['rightEyeOutsideEnd'] = pos;

    //右目内側取得
    pos = {};
    pos['x'] = parseInt($(this).find('rightEyeInsideEnd').attr('x'));
    pos['y'] = parseInt($(this).find('rightEyeInsideEnd').attr('y'));
    face['rightEyeInsideEnd'] = pos;

    //口左端取得
    pos = {};
    pos['x'] = parseInt($(this).find('mouthLeftEnd').attr('x'));
    pos['y'] = parseInt($(this).find('mouthLeftEnd').attr('y'));
    face['mouthLeftEnd'] = pos;

    //口右端取得
    pos = {};
    pos['x'] = parseInt($(this).find('mouthRightEnd').attr('x'));
    pos['y'] = parseInt($(this).find('mouthRightEnd').attr('y'));
    face['mouthRightEnd'] = pos;

    //口中央取得
    pos = {};
    pos['x'] = parseInt($(this).find('mouthCenter').attr('x'));
    pos['y'] = parseInt($(this).find('mouthCenter').attr('y'));
    face['mouthCenter'] = pos;

    faces.push(face);
  });
  imgData['faces'] = faces;
  console.log('==============');
  console.log(imgData);

  return imgData;
}

function viewImageURL(imageURL, imgData){
  imgWidth = imgData['width'];
  imgHeight = imgData['height'];
  cWidth = 1000;
  cHeight = 1000;

  rate = imgHeight / imgWidth;
  power = cWidth / imgWidth;

  $('#imageArea').append('<canvas id="c1" width='+ cWidth +' height=' + cHeight +'></canvas>');
  //画像オブジェクトに任意の画像を読み込み
  var img = new Image();
  //これを入れないと canvas使用時にエラーになる　Uncaught SecurityError: Failed to execute 'getImageData' on 'CanvasRenderingContext2D': the canvas has been tainted by cross-origin data.
  img.crossOrigin = "anonymous";

  //画像のパス指定
  img.src = imageURL;
  //画像の読み込みが終わったら、canvasに貼付けを実行
  img.onload = (function(){
    //canvas(c1)のノードオブジェクト
    var canvas = document.getElementById('c1');
    //2Dコンテキストをctxに格納
    var ctx = canvas.getContext('2d');
    //読み込んだimgをcanvas(c1)に貼付け
    ctx.drawImage(img, 0, 0, cWidth, cWidth * rate);
  });
  return rate;
}

$('#smileBtn').on('click', function(e){
  var ctx = $('#c1')[0].getContext('2d');
  console.log(rate);
  console.log(imgData);
  //人数と笑っている人がどれかわかる、しきい値を取れる
  //Step 1 顔の特徴点に点を打つ
  var faces = imgData['faces'];
  for(var i = 0; i < faces.length; i++){
    var v = faces[i];
    console.log('v:', v);
    isDebug =true;
    if(isDebug){
    for (key in v) {
 //   alert(key + " : " + v[key]);
      console.log('dot:', v[key]);
      var dot = v[key];
      if(dot['x'] != undefined ){
      	console.log('x:', dot['x']);
      	console.log('y:', dot['y']);
        ctx.globalAlpha = 0.9; //塗りつぶしの透明度設定
        ctx.fillStyle = 'rgb(255, 80, 77)';
        ctx.beginPath();
        ctx.arc(dot['x'] * power, dot['y'] * power,3,0,2*Math.PI,true);
        //arc(x座標,y,直径,円弧の描き始めの位置,書き終わりの位置,円弧を描く方向(true:反時計回り))
        ctx.fill();
      }// elseの時はSmile Level
    }
	}

  };
});


})(jQuery);
