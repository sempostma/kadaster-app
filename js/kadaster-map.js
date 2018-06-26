function initMap() {

    var interacted = false;
    var zoomedLowEnough = false;

    var map = L.map('map', {
        zoomControl: false,
        maxZoom: 21,
        bounceAtZoomLimits: false,
    });
    L.control.zoom({
        position: 'topright',
    }).addTo(map);
    map.setView([53.232, 6.569], 16);

    // load OpenStreetMap basemap
    var basemap = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        format: 'image/png',
        transparent: true,
        maxZoom: 21,

    });
    basemap.addTo(map);

    L.tileLayer.wms('https://geodata.nationaalgeoregister.nl/kadastralekaartv3/wms?', {
        layers: 'kadastralekaartv3:kadastralegrens,annotatie,perceel',
        format: 'image/png',
        transparent: true,
        version: '1.0.0',
        attribution: "www.nationaalgeoregister.nl",
        maxZoom: 21,
        minZoom: 10
    }).addTo(map);


    var geoJson = L.geoJson(undefined, { onEachFeature: onEachFeature });
    geoJson.addTo(map);

    var geoJson2 = L.geoJson(undefined, { onEachFeature: onEachFeature2 });
    geoJson2.addTo(map);

    map.locate({ setView: true, maxZoom: 30 });

    map.on("moveend", function () {
        var zoom = map.getZoom();
        console.log(zoom)
        interacted = true;
        var zoomPercentage = 100 - Math.min(100, zoom / 17) * 100;
        document.getElementById('zoomlevel-progress').setAttribute('style', 'top: ' + zoomPercentage + '%');
        if (zoom < 17) {
            geoJson.clearLayers();
            return;
        }
        zoomedLowEnough = true;
        // var viewBounds = map.getBounds();
        // var url = 'https://geodata.nationaalgeoregister.nl/kadastralekaartv3/wfs?';
        // var params = 'service=wfs&';
        // params += 'version=3.0.0&';
        // params += 'request=GetFeature&';
        // params += 'typeName=kadastralekaartv3:perceel&';
        // params += 'outputFormat=json&';
        // params += 'srsName=EPSG:4326&';
        // params += `BBOX=${viewBounds._southWest.lng},${viewBounds._southWest.lat},${viewBounds._northEast.lng},${viewBounds._northEast.lat},EPSG:4326&`;
        // params += 'count=10000';

        // getJSON(url + params, function (data) {
        //     console.log(data);
        //     geoJson.clearLayers();
        //     geoJson.addData(data.features);
        // });
    });

    map.on('click', function (e) {
        console.log('click', e);
        var latLong = e.latlng;
        console.log(latLong);
        showLocationOnMap(latLong);
    });



    map.locate({ setView: true, maxZoom: 30 });

    //---------------------------------------------------------------------------------------------------------------------------------//

    function onEachFeature(feature, layer) {
        if (feature.properties) {
            var properties = [];
            if (feature.properties.kadastraleGemeenteCode)
                properties.push('Gemeente Code: ' + feature.properties.kadastraleGemeenteCode);
            if (feature.properties.type)
                properties.push('Type: ' + feature.properties.type || "")
            if (feature.properties.kadastralegrootte)
                properties.push('Kadastrale grootte: ' + feature.properties.kadastralegrootte + 'm<sup>3</sup>')
            if (feature.properties.logischtijdstipOntstaan)
                properties.push('Logisch tijdstip ontstaan: ' + feature.properties.logischtijdstipOntstaan || "")
            if (feature.properties.logischtijdstipVervallen)
                properties.push('Logisch tijdstip vervallen: ' + feature.properties.logischtijdstipVervallen || "")
            if (feature.properties.lokaalID)
                properties.push('LokaalID: ' + feature.properties.lokaalID || "");
            if (feature.properties.perceelnummer)
                properties.push('Perceel nummer: ' + feature.properties.perceelnummer || "")
            if (feature.properties.sectie)
                properties.push('Sectie: ' + feature.properties.sectie || "")

            var id = 'popup-details-' + Math.random().toString(36);
            properties.push('<br><ons-button id="' + id + '" class="button popup-details">Details</ons-button>');

            layer.on('add', function (e) {
                e.target.openPopup();
                var btn = document.getElementById(id);
                btn.addEventListener('click', function () {
                    document.getElementById('navigator').pushPage('views/details.html', {
                        data: {
                            feature: feature,
                        }
                     });
                });
            })
     
            layer.bindPopup(properties.join('<br>'));
        }

        if (feature.geometry_name === "plaatscoordinaten") {
            layer.on({
                click: highlightFeature
            });
        }
    }

    function onEachFeature2() {

    }

    function showLocationOnMap(latLong) {
        if (map.getZoom() < 17) {
            geoJson.clearLayers();
            return;
        }
        getJSON('https://epsg.io/trans?data=' + latLong.lng + ',' + latLong.lat + '&s_srs=4326&&t_srs=28992',
            function (res) {
                var espg28992 = res[0];
                var params = 'request=getFeature&';
                params += 'srsName=EPSG:4326&';
                params += 'version=2.0.0&';
                params += 'typenames=kadastralekaartv3:perceel&';
                params += 'outputFormat=application/json&';
                params += 'cql_filter=CONTAINS(begrenzingperceel%2CPOINT(' + espg28992.x + ' ' + espg28992.y + '))'
                getJSON('https://geodata.nationaalgeoregister.nl/kadastralekaartv3/wfs?' + params, function (data) {
                    console.log(data);
                    geoJson.clearLayers();
                    geoJson.addData(data.features);
                })
            });
    }

    var info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        console.log(props);
        var content = "";
        if (props) {
            content += "<h4>Eigenschappen:</h4>";
            for (let p in props) {
                content += ("<br />" + p + ": " + props[p]);
            }
        }
        else {
            this._div.innerHTML = "<br />Selecteer een perceel";
        }

        this._div.innerHTML = content;
    };

    info.addTo(map);

    setTimeout(function () {
        if (zoomedLowEnough) return;
        ons.notification.toast('Zoom in om kadaster informatie te bekijken.', { timeout: 4000, animation: 'fall' });
    }, 6000);



    //---------------------------------------------------------------------------------------------------------------------------------//

    function highlightFeature(e) {

        resetHighlight(e);
        var target = geoJson2.addData(e.target.feature.properties.begrenzingperceel);

        map.fitBounds(target.getBounds());
        info.update(e.target.feature.properties);
    }

    function resetHighlight(e) {
        info.update();
        geoJson2.clearLayers();
    }
}


