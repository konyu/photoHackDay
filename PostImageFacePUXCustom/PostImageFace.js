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
	    	data:formData,
	    	success: function(xmlDoc){
	    		PutLog(divNode, '正常に送信できました');
				if (console.dirxml) {
					console.dirxml(xmlDoc);
				}
				var xs = new XMLSerializer();
	    		PutLog(divNode, xs.serializeToString(xmlDoc));
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

})(jQuery);
