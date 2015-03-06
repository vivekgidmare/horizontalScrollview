var scrollToBottomTimeout = 0;
var indexLeft = 0;
var androidLoagicalFoctor = Ti.Platform.displayCaps.logicalDensityFactor;
Ti.API.info('androidLoagicalFoctor :' + androidLoagicalFoctor);
var isFired = false;
var isNotByTouch = false;
for (var i = 0; i < 120; i++) {
	var view = Ti.UI.createView({
		width : 50,
		height : 50,
		top : 0,
		index : i,
		left : 5,
		backgroundColor : "#434343"
	});
	var aLabel = Ti.UI.createLabel({
		text : 'V-' + i,
		color : '#ff0000',
		touchEnabled : false,
		font : {
			fontSize : 10
		},
		height : Ti.UI.SIZE,
		width : Ti.UI.SIZE,
		textAlign : 'center'
	});
	view.add(aLabel);
	$.scrollView.add(view);

};
$.scrollView.addEventListener("touchstart", function(e) {
	isFired = false;
	isNotByTouch = true;
});
$.scrollView.addEventListener("scroll", function(e) {
	if (OS_ANDROID) {
		// indexLeft = Math.floor(((e.x) / 55));
		indexLeft = Math.floor((e.x / androidLoagicalFoctor) / 55);
		clearTimeout(scrollToBottomTimeout);
		scrollToBottomTimeout = setTimeout(function() {
			// Ti.API.info(e.x + ': Scrollview scroll fired :' + (e.x / androidLoagicalFoctor) + " ::" + indexLeft);
			// Ti.API.info('Now Fire ScrollEnd:' + isFired);
			if (!isFired && isNotByTouch) {
				isFired = true;
				$.scrollView.fireEvent("scrollend");
			};
		}, 500);
		//1000
	} else {
		indexLeft = Math.floor((e.x / 55));
		clearTimeout(scrollToBottomTimeout);
		scrollToBottomTimeout = setTimeout(function() {
			// Ti.API.info('Scrollview scroll fired :' + e.x + " ::" + indexLeft);
			$.scrollView.fireEvent("scrollend");
		}, 500);
		//1000

	}
});

$.scrollView.addEventListener("postlayout", function(e) {
	if (OS_IOS) {
		$.scrollView.scrollTo(35, 0);
	} else {
		isNotByTouch = false;
		$.scrollView.scrollTo(10, 0);
	}

});
var androidToast;
if (OS_ANDROID) {
	androidToast = Ti.UI.createNotification({
		backgroundColor : 'pink',
		duration : Ti.UI.NOTIFICATION_DURATION_SHORT,
		message : 'Stopped ScrollView'
	});
};

$.scrollView.addEventListener("scrollend", function(e) {
	Ti.API.info('got Fired');
	if (OS_IOS) {
		clearTimeout(scrollToBottomTimeout);
		scrollToBottomTimeout = setTimeout(function() {
			var toScroll = (indexLeft * 55);
			// Ti.API.info((indexLeft + 3) + ' < CurrentSelected Scrollview scrollEnd fired **********' + (toScroll + 35));
			$.scrollView.scrollTo((toScroll + 35), 0);
		}, 100);
	} else {
		Ti.API.info('isFired :' + isFired + " ::" + isNotByTouch);
		if (isFired && isNotByTouch) {
			isFired = false;
			isNotByTouch = false;
			clearTimeout(scrollToBottomTimeout);
			scrollToBottomTimeout = setTimeout(function() {
				var toScroll = (indexLeft * (55 * androidLoagicalFoctor));
				Ti.API.info('indexLeft :' + indexLeft + " Center :" + (indexLeft + 3));
				$.scrollView.scrollTo((toScroll + 10), 0);
				isFired = true;
				isNotByTouch = false;
				androidToast.show();
			}, 100);
		};
	}
});

$.index.open();
