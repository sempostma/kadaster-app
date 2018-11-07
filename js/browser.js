if (navigator['serviceWorker']) {
	navigator.serviceWorker.register('./sw.js', { scope: './' }).then(function (registration) {
		console.log('Service worker successfully registered on scope', registration.scope);

	}).catch(function (error) {
		console.log('Service worker failed to register');
	});
}

if (navigator.userAgent.indexOf('MSIE') !== -1
	|| navigator.appVersion.indexOf('Trident/') > 0) {
	document.body.appendChild(document.createElement('div')).innerHTML = '<div id="oldbrowser-modal" class="modal" role="dialog" aria-expanded="true" \
	style="position: fixed; z-index: 200000; padding-top: 100px; left: 0px; top: 0px; width: 100%; height: 100%; overflow: auto; background-color: rgba(0, 0, 0, 0.9); \
	transition: padding-top 100ms ease-out; box-sizing: border-box; font-family: "Ubuntu", sans-serif, Verdana, Geneva, Tahoma;">\
	<div class="modal-content" style="margin: auto; display: block; width: 80%; max-width: 700px; padding: 40px; background: white; box-sizing: border-box; ;">\
		<h2 class="text-danger mt-1 mb-4" style="color: rgb(236, 78, 32); margin-top: 6px; margin-bottom: 36px; box-sizing: border-box; ;">Belangrijk!</h2>\
		<p class="noscript-msg" style="box-sizing: border-box; ;">\
			Je gebruikt een oudere\
			<strong class="text-danger">outdated</strong> browser.\
			<a href="http://browsehappy.com/" class="text-success" style="style="background-color: transparent; color: rgb(1, 111, 185); box-sizing: border-box; \
			text-decoration: none;">Update je browser</a> om je ervaring te verbeteren.\
		</p>\
	</div>\
</div>'.split('\n').join('');
}

var timeout = setTimeout(showFullVersionNotification, 1000 * 60 * 2);

function showFullVersionNotification() {
	clearTimeout(timeout);
	ons.notification.confirm({
		title: 'Toegang to meer functies',
		id: 'get-the-full-version',
		messageHTML: "<ul><li>Geen reclames</li><li>Informatie over panden, verblijfplaatsen, ligplaatsen, standplaatsen en woonplaatsen</li><li>Satelliet kaart (luchtfoto)</li><li>Zoekfunctie</li><li>Geolocatie</li><li>Eerder toegang tot nieuwe functies</li><li>Technische ondersteuning</li></ul>\
		<a target='_blank' href='https://play.google.com/store/apps/details?id=com.EchoSierraStudio.Kadaster_Kaart&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'><img alt='Ontdek het op Google Play' src='https://play.google.com/intl/en_us/badges/images/generic/nl_badge_web_generic.png'/></a>",
		buttonLabels: ['Volledige Versie', 'Annuleer'],
		primaryButtonIndex: 0,
		callback: function () {
			timeout = setTimeout(showFullVersionNotification, 1000 * 60 * 2);
		}
	});

	document.querySelector('#get-the-full-version .alert-dialog-button--primal').addEventListener('click', function () {
		window.open('https://play.google.com/store/apps/details?id=com.EchoSierraStudio.Kadaster_Kaart', '_blank');
	});
}

window.fn.trail = true;

var ads = document.createElement("script");
ads.async = true;
ads.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
ads.onload = function () {
	(adsbygoogle = window.adsbygoogle || []).push({
		google_ad_client: "ca-pub-9732535637352249",
		enable_page_level_ads: true
	});
};
document.head.appendChild(ads);

