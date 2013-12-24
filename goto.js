(function() {

	overlay = document.createElement('div');
	overlay.id = 'overlay';

	var styles = {
		backgroundColor	: 'rgba(245, 222, 179, 1)',
		top				: 0,

		// 중앙 정렬
		left			: 0,
		right			: 0,
		margin			: 'auto',

		width			: '700px',
		position		: 'absolute',
		zIndex			: 10000,
		display			: 'none',
		borderRadius	: '10px',
		webkitBoxShadow	: 'rgb(204, 204, 204) 2px 3px 5px 1px',
		padding			: '10px'

	}

	for (var style in styles) {
		overlay.style[style] = styles[style];
	}

	document.body.appendChild(overlay);
	
	$('tr.list0 a,tr.list1 a').mouseover(function(evt) {
		$("#overlay")
		.html("<br>Loading...")
		.css({
			top: evt.pageY+10
		})
		.show();
		
		var url = evt.currentTarget.attributes[0].nodeValue;
		$.get(url, function(data) {
			try {
				$("#overlay").html("");
				var imgs = $("table.pic_bg img:not([src*=icon_mobile_koreapas])",data);
				var embed = $("table.pic_bg embed,table.pic_bg iframe", data);
				var dataspan = $("table.pic_bg~table.pic_bg~table.pic_bg", data);
				
				// 첨부된 이미지는 따로 모아서 작게 보여줌. 중앙 기준으로 crop (가로*세로 비율 유지)
				if(imgs.length) {
					var div = $('<div>').attr('id','imgDiv');
					imgs.each(function(a,b){
						$('<div>').css({
							
							// 미리보기 이미지 크기
							'width':'80px',
							'height':'80px',
							
							'display':'inline-block',
							'margin':'0px 5px 5px 0px',
							'border-radius':'5px',
							'background-repeat':'no-repeat',
							'background-position':'center center',
							'background-size':'cover',
							'background-image':"url('"+b.src+"')"
							
						}).appendTo(div)
					});
					div.appendTo('#overlay');
				}
				// 유투브 등.. 첨부 된 영상이 있는지 알려줌
				if (embed.length) {
					$('<div>').attr('id','embDiv').text("<< 첨부 영상 >>").appendTo('#overlay');
				}
				// 본문이 표시되는 div
				if(dataspan.length) {
					$('<div>').attr('id','txtDiv').css({
						'max-height':'100px',
						'white-space': 'nowrap',
						'overflow': 'hidden',
						'text-overflow': 'ellipsis'
					}).html(dataspan.text().trim().replace(/\n+/g,'<br>')).appendTo('#overlay');
				}
				
				// 리플이 표시되는 div
				var repls = $('span[id^=cTitle]', data).parent();
				if (repls.length) {
					var div = $('<div>').attr('id','replyDiv').css({
						'border-top':'solid 1px',
						'margin-top':'7px',
						'padding-top':'7px'
					});
					repls.each(function(i,e){
						/*
						* 리플이 너무 많은 경우, 처음 N개와 마지막 M개만 출력함
						* 출력 갯수 설정
						* firstN : 앞부분 댓글 갯수
						* lastN : 뒷부분 댓글 갯수
						*/
						var firstN = 5;
						var lastN  = 5;
						if (firstN <= i && i < repls.length-lastN) {
							if (i==firstN) {
								$('<div>').text('...(중략)...').css({
									'color':'#999',
									'text-align':'center'
								}).appendTo(div);
							}
						} else {
							/*
							* color :
							* 작성자,본인,일반인 구분하는 색깔
							* 고파스에서 지정된 색깔 그대로 가져다 씀
							* nick : 닉네임
							* imgNick : 이미지닉태그 URL
							* text : 리플 본문 text
							*/
							var color = $(e).find('font[color]').attr('color')||"#000";
							var nick  = $(e).find('b:not(:has(font[color]))').text().trim();
							var imgNick = $(e).find('img[src*=private_name]').attr('src')||"";
							var text  = $(e).find('td[id^=cid]').text().trim();
							
							// 리플 번호 부분 ex) #5
							$('<span>').text('#'+(i+1)).css({
								'margin-right': '3px',
								'display': 'inline-block',
								'white-space': 'nowrap',
								'overflow': 'hidden',
								'text-overflow': 'ellipsis',
								'color': color,
								'width':'30px'
							}).appendTo(div);
							
							// 닉네임 부분
							var txtSpan = $('<span>').text(nick).css({
								'margin-right': '3px',
								'display': 'inline-block',
								'white-space': 'nowrap',
								'overflow': 'hidden',
								'text-overflow': 'ellipsis',
								'font-weight':'bold',
								'margin-right':'5px',
								'width':'100px',
								'height':'14px'
							});
							// 이미지 닉네임태그 쓰는 경우, 닉태그 이미지를 배경으로 넣어줌
							if (imgNick != "") {
								txtSpan.css({
									'background-image': "url('"+imgNick+"')",
									'background-repeat': 'no-repeat',
									'background-position': 'center center',
									'background-size': 'cover'
								});
							}
							
							// 리플 본문. text만 뽑아서 한줄로 표시함.. 긴 댓글은 후략
							txtSpan.appendTo(div);
							$('<span>').text(text).css({
								'margin-right': '3px',
								'display': 'inline-block',
								'white-space': 'nowrap',
								'overflow': 'hidden',
								'text-overflow': 'ellipsis',
								'width':'535px'
							}).appendTo(div);
							$('<br>').appendTo(div);
						}
					});
					div.appendTo('#overlay');
				}
			} catch(e) {
				$("#overlay").html("[ERROR] "+e.message);
			}
		});
	}).mouseout(function(evt) {
		$("#overlay").hide();
	}).mousemove(function(evt) {
		$("#overlay").css({
			top: evt.pageY+10
		});
	});
})();
