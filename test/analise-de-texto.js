function textAnalize(text, callback) {

	let uri = 'https://azure.microsoft.com/pt-br/cognitive-services/demo/textanalyticsapi/';
	let tagPost = '__RequestVerificationToken';

	// Token Cookie
	let cookie_token = 'Lxu0TBLlqkbIK-FFoiqeKPG7yEGIePxKjlC0Dph0wtRLTRoMHBT3OdRe0iuRZ3X4scKRmICyYq-b6ibDMl_iKRPIWXc1';

	// Token Post Request
	let post_token = 'rCF6vrrgnWTnLFdI1_eZ3RiGVEVcsknRD0_GRxpmRgi-z5Py-x84PY9Y3AKLWN6PbEmH1q5Yi_K889VRvuaRbbbvXRA1';

	chrome.cookies.remove({url: uri, name: tagPost}, function() {
		chrome.cookies.set({url: uri, name: tagPost, value: cookie_token}, function() {

			$.post(uri, {'__RequestVerificationToken': post_token, 'Query': text}, function(data) {

				let phrases = data;
				phrases = phrases.replace(/(\r\n|\n|\r)/g, '');
				phrases = phrases.match(/,        &quot;keyPhrases&quot;: (.*?)        ]/g);
				if (phrases !== null) {
					phrases = phrases[0].replace(/        /g, '');
					phrases = phrases.replace(/(,&quot;|&quot;|&quot)/g, '"');
					phrases = '{'+phrases+'}';
					phrases = jQuery.parseJSON(phrases);
				}else {
					phrases = [];
				}

				data = data.replace(/ /g, '');
				data = data.replace(/(\r\n|\n|\r)/g, '');
				data = data.match(/<preclass="prettyprintjson-result">(.*?)<\/pre>/);
				data = data[1].replace(/&quot;/g, '"');
				data = jQuery.parseJSON(data);
				data.keyPhrases.documents[0] = phrases;

				$.each(data.keyPhrases.documents[0].keyPhrases, function(index) {
					data.keyPhrases.documents[0].keyPhrases[index] = decodeStr(data.keyPhrases.documents[0].keyPhrases[index]);
				});

				callback({err: null, result: data});
			}).fail(function() {
				callback({err: null, result: data});
			});
		});
	});

}

function decodeStr(txt) {
	
	let parser = new DOMParser;
	let dom = parser.parseFromString('<!doctype html><body>' + txt, 'text/html');
	let decodedString = dom.body.textContent;
	return decodedString;
}

