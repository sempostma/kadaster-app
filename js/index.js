var cordova_ready = false;

var isOnline = function () {

}, isOffline = function () {
	ons.notification.alert({
		message: 'Je bent niet verbonden met de server. De gegevens die worden weergegeven zijn mogelijk verouderd.',
	});
};

ons.disableAutoStatusBarFill();

if (window.addEventListener) {
	/*
		Works well in Firefox and Opera with the 
		Work Offline option in the File menu.
		Pulling the ethernet cable doesn't seem to trigger it.
		Later Google Chrome and Safari seem to trigger it well
	*/
	window.addEventListener("online", isOnline, false);
	window.addEventListener("offline", isOffline, false);
}
else {
	/*
		Works in IE with the Work Offline option in the 
		File menu and pulling the ethernet cable
	*/
	document.body.ononline = isOnline;
	document.body.onoffline = isOffline;
}

document.addEventListener("resume", function () {
	if (navigator.onLine === false) {
		ons.notification.alert({
			message: 'Je bent niet verbonden met de server. De gegevens die worden weergegeven zijn mogelijk verouderd.',
		});
	}
}, false)

document.addEventListener('init', function (event) {
	var page = event.target;
	//console.log("button pressed");

	if (page.id === 'map-page') {
		initMap(page);
	}

	else if (page.id === 'details') {
		initDetails(page);
	}

	else if (page.id === 'details-general') {
		initDetailsGeneral(page);
	}

	else if (page.id === 'details-panden') {
		initDetailsPanden(page);
	} 

	else if (page.id === 'details-verblijfplaatsen') {
		initDetailsVerblijfsPlaatsen(page);
	}

	else if (page.id === 'details-misc') {
		initDetailsMisc(page);
	}
});

document.addEventListener("deviceready", function () {
	cordova_ready = true;
	if (cordova.platformId === 'browser') {
		document.body.appendChild(document.createElement('script')).src = './js/browser.js';
	} else {
		// document.body.appendChild(document.createElement('script')).src = './js/admob.js';
	}
	if (navigator.onLine === false) {
		ons.notification.alert({
			message: 'Je bent niet verbonden met de server. De gegevens die worden weergegeven zijn mogelijk verouderd.n',
		});
	}
}, false);

window.fn = {};

window.fn.open = function () {
	var menu = document.getElementById('menu');
	menu.open();
};

window.fn.load = function (page) {
	var content = document.getElementById('content');
	var menu = document.getElementById('menu');
	content.load(page)
		.then(menu.close.bind(menu));
};

(function () {
	var gemeenteCodes;
	var cbs = [];
	getJSON('data/gemeente-codes.json', function (codes) {
		gemeenteCodes = codes;
		for (var i = 0; i < cbs.length; i++) {
			cbs(codes);
		}
	});

	window.fn.getGemeenteCodes = function (cb) {
		if (gemeenteCodes) cb(gemeenteCodes);
		else cbs.push(cb);
	}
})();



