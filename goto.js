(function() {

	overlay = document.createElement('div');
      overlay.id = 'overlay';

      var styles = {
        backgroundColor: 'rgba(245, 222, 179, 1)',
        left           : 0,
        position       : 'absolute',
        width          : '400px',
        top            : 0,
        zIndex         : 10000,
		display		: 'none',
        borderRadius : '10px',
        webkitBoxShadow : 'rgb(204, 204, 204) 2px 3px 5px 1px',
			padding : '10px'

      }

      for (var style in styles) {
        overlay.style[style] = styles[style];
      }

      document.body.appendChild(overlay);
	
  $('.list0>td>a,.list1>td>a,.list0>td>strike>a,.list1>td>strike>a').mouseover(function(evt) {
	  $("#overlay").css({
		top: evt.pageY+10,
		left: evt.pageX
	  }).show();
	  $("#overlay").html("<br>Loading...");
	  var url = evt.currentTarget.attributes[0].nodeValue;
	$.get(url, function(data) {
		var imgurl = $('.pic_border',data);
		var imgurl2 = $('.pic_bg>td>img',data);
		var dataspan = $('span[class=han]',data);
		var dataspan2 = $('table[class=pic_bg]>tbody>tr>td[class=han]',data);
		if(dataspan.html()==null) dataspan.html("");
		if(dataspan2.html()==null) dataspan2.html("");
		if(imgurl.length !=0 || imgurl2.length != 0) {
			
			if(imgurl.length != 0) {
				$("#overlay").html( "<img src=" + imgurl[0].attributes['src'].nodeValue + " height='200px'>" + "<br>"+dataspan.html() + dataspan2.html()+ "");
			} else {
				$("#overlay").html( "<img src=" + imgurl2[0].attributes['src'].nodeValue + " height='200px'>" + "<br>"+dataspan.html() + dataspan2.html()+ "");
			}
		} else {
			$("#overlay").html("<br>"+dataspan.html() + dataspan2.html() + "<br><br>");
		}
	});
  }).mouseout(function(evt) {
	  $("#overlay").css({
		top: evt.pageY+10,
		left: evt.pageX
	  }).hide();
  }).mousemove(function(evt) {
	$("#overlay").css({
		top: evt.pageY+10,
		left: evt.pageX
	  });
  });
})();