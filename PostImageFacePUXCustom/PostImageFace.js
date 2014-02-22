(function($) {

	// リクエストドメイン
	var REQ_URL = "http://eval.api.pux.co.jp:8080";
	// リクエストパス
	var REQ_PATH = "/webapi/face.do";

	function PutLog(node, str) {
		$(node).append('<plaintext>' + str);
	}

	/*
	 * imageURL での送信
	 */
	$.fn.PostImageURL = function(api_key, in_url) {
		var divNode = this[0];
		PutLog(divNode, '------------------------------------');
		PutLog(divNode, 'APIKEY:' + api_key);
		PutLog(divNode, 'IMAGE:' + decodeURIComponent(in_url));
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
	    		getFaceDataFromXML(xmlDoc);
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
				alert('aaaaaa');
	    		PutLog(divNode, xs.serializeToString(xmlDoc));
	    		xmlPerser(xmlDoc);
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

//////////////////////
function getFaceDataFromXML(xml){
  //顔のノードを全部取り出す。
  var faces = [];
  console.log(xml);
  //一人ひとりの顔データを取り出す
  $(xml).find('detectionFaceInfo').each(function(i){
    //人数分の処理ができる
    //console.log($(this).text());
    var face = {};
    //笑顔レベル取得
    face['smileLevel'] = $(this).find('smileLevel').text();

    //左目中心取得
    var pos = {};
    pos['x'] = $(this).find('leftBlackEyeCenter').attr('x');
    pos['y'] = $(this).find('leftBlackEyeCenter').attr('y');
    face['leftBlackEyeCenter'] = pos;

    //左目外側取得
    pos = {};
    pos['x'] = $(this).find('leftEyeOutsideEnd').attr('x');
    pos['y'] = $(this).find('leftEyeOutsideEnd').attr('y');
    face['leftEyeOutsideEnd'] = pos;

    //左目内側取得
    pos = {};
    pos['x'] = $(this).find('leftEyeInsideEnd').attr('x');
    pos['y'] = $(this).find('leftEyeInsideEnd').attr('y');
    face['leftEyeInsideEnd'] = pos;

    //右目中央取得
    pos = {};
    pos['x'] = $(this).find('rightBlackEyeCenter').attr('x');
    pos['y'] = $(this).find('rightBlackEyeCenter').attr('y');
    face['rightBlackEyeCenter'] = pos;

    //右目外側取得
    pos = {};
    pos['x'] = $(this).find('rightEyeOutsideEnd').attr('x');
    pos['y'] = $(this).find('rightEyeOutsideEnd').attr('y');
    face['rightEyeOutsideEnd'] = pos;

    //右目内側取得
    pos = {};
    pos['x'] = $(this).find('rightEyeInsideEnd').attr('x');
    pos['y'] = $(this).find('rightEyeInsideEnd').attr('y');
    face['rightEyeInsideEnd'] = pos;

    faces.push(face);
  });
  console.log('==============');
  console.log(faces);

  return faces;
}

})(jQuery);
