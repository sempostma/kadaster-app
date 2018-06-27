
(function () {

    var _proj4_proj_epsg4326 = new proj4.Proj('EPSG:4326');    //source coordinates will be in Longitude/Latitude, WGS84
    var _proj4_proj_epsg3785 = new proj4.Proj('EPSG:3785');

    var pandenPromise;
    var verblijfPlaatsenPromise;
    var ligPlaatsenPromise;
    var standPlaatsenPromise;
    var woonPlaatsenPromise;

    var feature;
    var geojson3857;
    var xMax;
    var xMin;
    var yMax;
    var yMin;
    var panden;
    var detailsPage;
    var verblijfsObjecten;
    var ligPlaatsen;
    var standPlaatsen;
    var woonpPlaatsen;

    window.initDetailsMisc = function (page) {
        woonPlaatsenPromise.then(function () {
            ligPlaatsenPromise.then(function () {
                standPlaatsenPromise.then(function () {
                    setupDetailMiscPage(page);
                });
            });
        });
    }

    function setupDetailMiscPage(page) {
        var woonplaatsenList = document.getElementById('woonplaats-misc-list-item-container');
        var ligPlaatsenList = document.getElementById('ligplaatsen-misc-list-item-container');
        var standPlaatsenList = document.getElementById('standplaatsen-misc-list-item-container');

        woonpPlaatsen.features.forEach(function (feature) {
            var props = feature.properties;
            var listItem = document.createElement('div');
            listItem.innerHTML =
                '<ons-list-item><div class="left">' + props.woonplaats +
                '</div><div class="center"><small>' + feature.id.replace('.', ' ') + ', ' + 'Identificatie: ' + 'props.identificatie' +
                ', Status: ' + props.status + '</small></div></ons-list-item>';
            woonplaatsenList.appendChild(listItem);
        });

        if (woonpPlaatsen.features.length === 0) {
            woonplaatsenList.innerHTML =
                '<ons-list-item>Geen woonplaatsen gevonden</ons-list-item>';
        }

        ligPlaatsen.features.forEach(function (feature) {
            var props = feature.properties;
            var html = '<ons-list-item expandable>';
            html += feature.id.replace('.', ' ');
            html += '<div class="expandable-content">';
            html += '<div><b>Actualiteitsdatum:</b> ' + (props.actualiteitsdatum
                ? new Date(props.actualiteitsdatum).toLocaleDateString()
                : 'Niet beschikbaar') + '</div>';
            html += '<div><b>Huisletter</b> ' + (props.huisletter || '') + '</div>';
            html += '<div><b>Huisnummer:</b> ' + props.huisnummer + '</div>';
            html += '<div><b>Identificatie:</b> ' + props.identificatie + '</div>';
            html += '<div><b>Openbare ruimte:</b> ' + props.openbare_ruimte + '</div>';
            html += '<div><b>Postcode:</b> ' + props.postcode + '</div>';
            html += '<div><b>Status:</b> ' + props.status + '</div>';
            html += '<div><b>Toevoeging:</b> ' + (props.toevoeging || '') + '</div>';
            html += '<div><b>Woonplaats:</b> ' + props.woonplaats + '</div>';
            html += '</div></ons-list-item>';
            var div = document.createElement('div');
            div.innerHTML = html;
            ligPlaatsenList.appendChild(div);
        });

        if (ligPlaatsen.features.length === 0) {
            ligPlaatsenList.innerHTML =
                '<ons-list-item>Geen ligplaatsen gevonden</ons-list-item>';
        }

        standPlaatsen.features.forEach(function (feature) {
            var props = feature.properties;
            var html = '<ons-list-item expandable>';
            html += feature.id.replace('.', ' ');
            html += '<div class="expandable-content">';
            html += '<div><b>Actualiteitsdatum:</b> ' + (props.actualiteitsdatum
                ? new Date(props.actualiteitsdatum).toLocaleDateString()
                : 'Niet beschikbaar') + '</div>';
            html += '<div><b>Huisletter</b> ' + (props.huisletter || '') + '</div>';
            html += '<div><b>Huisnummer:</b> ' + props.huisnummer + '</div>';
            html += '<div><b>Identificatie:</b> ' + props.identificatie + '</div>';
            html += '<div><b>Openbare ruimte:</b> ' + props.openbare_ruimte + '</div>';
            html += '<div><b>Postcode:</b> ' + props.postcode + '</div>';
            html += '<div><b>Status:</b> ' + props.status + '</div>';
            html += '<div><b>Toevoeging:</b> ' + (props.toevoeging || '') + '</div>';
            html += '<div><b>Woonplaats:</b> ' + props.woonplaats + '</div>';
            html += '</div></ons-list-item>';
            var div = document.createElement('div');
            div.innerHTML = html;
            standPlaatsenList.appendChild(div);
        });

        if (standPlaatsen.features.length === 0) {
            standPlaatsenList.innerHTML =
                '<ons-list-item>Geen standplaatsen gevonden</ons-list-item>';
        }

        console.log('misc', woonpPlaatsen, ligPlaatsen, standPlaatsen);
    }

    window.initDetailsVerblijfObjectDetail = function (page) {
        var verblijfsobject = page.data.verblijfobject;
        var props = verblijfsobject.properties;

        document.getElementById('details-vo-actualiteitsdatum').innerText =
            props.actualiteitsdatum
                ? new Date(props.actualiteitsdatum).toLocaleDateString()
                : 'Niet beschikbaar';

        document.getElementById('details-vo-bouwjaar').innerText =
            props.bouwjaar || 'Niet beschikbaar';

        document.getElementById('details-vo-gebruiksdoel').innerText =
            props.gebruiksdoel || 'Niet beschikbaar';

        document.getElementById('details-vo-huisletter').innerText =
            props.huisletter || 'Niet van toepassing';

        document.getElementById('details-vo-huisnummer').innerText =
            props.huisnummer || 'Niet beschikbaar';

        document.getElementById('details-vo-identificatie').innerText =
            props.identificatie || 'Niet beschikbaar';

        document.getElementById('details-vo-openbare-ruimte').innerText =
            props.openbare_ruimte || 'Niet beschikbaar';

        document.getElementById('details-vo-oppervlakte').innerText =
            props.oppervlakte || 'Niet beschikbaar';

        document.getElementById('details-vo-pandidentificatie').innerText =
            props.pandidentificatie || 'Niet beschikbaar';

        document.getElementById('details-vo-pandstatus').innerText =
            props.pandstatus || 'Niet beschikbaar';

        document.getElementById('details-vo-postcode').innerText =
            props.postcode;

        document.getElementById('details-vo-status').innerText =
            props.status || 'Niet beschikbaar';

        document.getElementById('details-vo-toevoeging').innerText =
            props.toevoeging || 'Niet van toepassing';

        document.getElementById('details-vo-woonplaats').innerText =
            props.woonplaats;

    }

    window.initDetailsPanden = function (page) {
        pandenPromise.then(function () {
            var list = document.getElementById('details-panden-list-content');

            var html = '';
            for (var i = 0; i < panden.features.length; i++) {
                var props = panden.features[i].properties;
                html += '<ons-list-item expandable>';
                var paths = toSVGPathsArr(panden.features[i], 250, 250, {
                    'style': 'stroke:#660000; fill: #F0F8FF;stroke-width:0.5px;',
                    'vector-effect': 'non-scaling-stroke'
                });
                html += panden.features[i].id.replace('.', ' ');
                html += '<div class="expandable-content">';
                html += '<svg class="pand-svg" width="200" height="200" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">';
                html += paths.join('');
                html += '</svg>';
                html += '<div><b>Oppervlakte (min):</b> ' + props.oppervlakte_min + 'm<sup>2</sub></div>';
                html += '<div><b>Oppervlakte (max):</b> ' + props.oppervlakte_max + 'm<sup>2</sub></div>';
                html += '<div><b>Actualiteitsdatum:</b> ' + (props.actualiteitsdatum || 'Niet beschikbaar') + '</div>';
                html += '<div><b>Gebruiksdoel:</b> ' + (props.gebruiksdoel || 'Niet beschikbaar/van toepassing') + '</div>';
                html += '<div><b>Bouwjaar:</b> ' + (props.bouwjaar || 'Niet beschikbaar') + '</div>';
                html += '<div><b>Identificatie:</b> ' + (props.identificatie || 'Niet beschikbaar') + '</div>';
                html += '<div><b>Status:</b> ' + (props.status || 'Niet beschikbaar') + '</div>';
                html += '</div></ons-list-item>';
            }
            if (panden.features.length === 0) {
                html += '<h3>Geen panden op dit perceel.</h3>'
            }
            var d = document.createElement('div');
            d.innerHTML = html;
            list.appendChild(d);
        });
    }

    window.initDetailsVerblijfsPlaatsen = function (page) {
        verblijfPlaatsenPromise.then(function () {
            var list = document.getElementById('details-verblijfplaatsen-list');
            for (var i = 0; i < verblijfsObjecten.features.length; i++) {
                (function () {
                    var verblijfobject = verblijfsObjecten.features[i];
                    var props = verblijfobject.properties;
                    var paths = toSVGPathsArr({ type: verblijfobject.type, geometry: props.pandgeometrie }, 250, 250, {
                        'style': 'stroke:#660000; fill: #F0F8FF;stroke-width:0.5px;',
                        'vector-effect': 'non-scaling-stroke'
                    });
                    var html = '<ons-list-item tappable>';
                    html += '<div class="left">'
                    html += '<svg class="pand-svg" width="40" height="40" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">';
                    html += paths.join('');
                    html += '</svg></div>';
                    html += '<div class="center">';
                    html += [props.openbare_ruimte, props.huisnummer + props.huisletter + (props.toevoeging || '') + ',', props.postcode + ',', props.woonplaats].join(' ');
                    html += '</div></ons-list-item>';
                    var el = document.createElement('div');
                    el.innerHTML = html;
                    var featureClosure = verblijfsObjecten.features[i];
                    el.firstChild.addEventListener('click', function (e) {
                        document.getElementById('navigator').pushPage('views/details-verblijfobject-detail.html', {
                            data: { verblijfobject: verblijfobject }
                        });
                    });
                    list.appendChild(el.firstChild);
                })();

            }
            if (verblijfsObjecten.features.length === 0) {
                var el = document.createElement('h3');
                el.innerText = 'Geen verblijfplaatsen op dit perceel.';
                list.appendChild(el);
            }
        });
    }

    window.initDetailsGeneral = function initDetailsGeneral(page) {
        pandenPromise.then(function () {
            var detailsSvg = document.getElementById('details-svg');
            detailsSvg.innerHTML = svgHTML;

            window.fn.getGemeenteCodes(function (codes) {
                document.getElementById('gemeente').innerText =
                    codes[feature.properties.kadastraleGemeenteCode];
            });

            document.getElementById('gemeente-code').innerText =
                feature.properties.kadastraleGemeenteCode;

            document.getElementById('kadastrale-grootte').innerHTML =
                feature.properties.kadastralegrootte.toLocaleString() + 'm<sup>3</sub>';

            document.getElementById('logisch-ontstaan').innerText =
                new Date(feature.properties.logischtijdstipOntstaan)
                    .toLocaleDateString();

            if (feature.properties.logischtijdstipVervallen) {
                document.getElementById('logisch-vervallen').innerText =
                    new Date(feature.properties.logischtijdstipOntstaan)
                        .toLocaleDateString();
            } else {
                document.getElementById('logisch-vervallen').innerText =
                    'Niet van toepassing';
            }

            document.getElementById('perceel-nummer').innerText =
                feature.properties.perceelnummer

            document.getElementById('perceel-lon').innerText =
                feature.properties.plaatscoordinaten.coordinates[0];

            document.getElementById('perceel-lat').innerText =
                feature.properties.plaatscoordinaten.coordinates[1];

            var dms = convertDMS(feature.properties.plaatscoordinaten.coordinates[1], feature.properties.plaatscoordinaten.coordinates[0]);

            document.getElementById('perceel-lon-dms').innerText = dms[1];

            document.getElementById('perceel-lat-dms').innerText = dms[0];

            document.getElementById('perceel-sectie').innerText = feature.properties.sectie;
        });
    }


    window.initDetails = function initDetails(page) {
        detailsPage = page;
        console.log('init details', page, page.data);
        pandenPromise = _promise();
        verblijfPlaatsenPromise = _promise();
        woonPlaatsenPromise = _promise();
        ligPlaatsenPromise = _promise();
        standPlaatsenPromise = _promise();

        feature = page.data.feature;



        console.log('transform', feature.geometry.coordinates[0][0]);
        transformToEspg3857OnSpot(feature);
        var geojson3857 = feature;

        console.log(geojson3857);
        xMin = Infinity;
        xMax = -Infinity;
        yMin = Infinity;
        yMax = -Infinity;
        for (var i = 0; i < geojson3857.geometry.coordinates.length; i++) {
            for (var j = 0; j < geojson3857.geometry.coordinates[i].length; j++) {
                var x = geojson3857.geometry.coordinates[i][j][0],
                    y = geojson3857.geometry.coordinates[i][j][1];
                if (x < xMin) xMin = x;
                if (x > xMax) xMax = x;
                if (y < yMin) yMin = y;
                if (y > yMax) yMax = y;
            }
        }

        var geojson2svg_converter = geojson2svg({
            viewportSize: { width: 250, height: 250 },
            attributes: {
                'style': 'stroke:#006600; fill: #F0F8FF;stroke-width:0.5px;',
                'vector-effect': 'non-scaling-stroke'
            },
            mapExtent: {
                left: xMin,
                right: xMax,
                bottom: yMin,
                top: yMax
            },
        });

        var svgStrings = geojson2svg_converter.convert(geojson3857);
        console.log(svgStrings);

        svgHTML = svgStrings.join('');

        var verblijfsobjectenURL = getBagTypesURL([xMin, yMin, xMax, yMax], 'verblijfsobject', 'EPSG:3857')
        getJSON(verblijfsobjectenURL, function (vo) {
            verblijfsObjecten = vo;
            console.log('verblijfobjecten', verblijfsObjecten);
            document.getElementById('details-verblijfplaatsen-tab').setAttribute('badge', vo.features.length);
            verblijfPlaatsenPromise();
        });

        var ligPlaatsenURL = getBagTypesURL([xMin, yMin, xMax, yMax], 'ligplaats', 'EPSG:3857');
        getJSON(ligPlaatsenURL, function (lp) {
            ligPlaatsen = lp;
            ligPlaatsenPromise();
        });

        var standPlaatsenURL = getBagTypesURL([xMin, yMin, xMax, yMax], 'standplaats', 'EPSG:3857');
        getJSON(standPlaatsenURL, function (lp) {
            standPlaatsen = lp;
            standPlaatsenPromise();
        });

        var woonPlaatsenURL = getBagTypesURL([xMin, yMin, xMax, yMax], 'woonplaats', 'EPSG:3857');
        getJSON(woonPlaatsenURL, function (wp) {
            woonpPlaatsen = wp;
            woonPlaatsenPromise();
        });

        var pandenURL = getBagTypesURL([xMin, yMin, xMax, yMax], 'pand', 'EPSG:3857');
        getJSON(pandenURL, function (p) {
            panden = p;
            console.log('panden', panden);
            var pandenSVG = geojson2svg_converter.convert(panden,
                {
                    attributes: {
                        'style': 'stroke:#660000; fill:transparent; stroke-width:0.5px;',
                        'vector-effect': 'non-scaling-stroke'
                    }
                });

            svgHTML += pandenSVG.join('');
            svgHTML += '<text x="120" y="120" transform="rotate(' + -feature.properties.perceelnummer_rotatie + ', 120, 120)">' + feature.properties.perceelnummer + '</text>';

            document.getElementById('details-panden-tab').setAttribute('badge', panden.features.length);
            pandenPromise();
        });
    }

    function toDegreesMinutesAndSeconds(coordinate) {
        var absolute = Math.abs(coordinate);
        var degrees = Math.floor(absolute);
        var minutesNotTruncated = (absolute - degrees) * 60;
        var minutes = Math.floor(minutesNotTruncated);
        var seconds = Math.floor((minutesNotTruncated - minutes) * 60);

        return degrees + "° " + minutes + "' " + seconds + '"';
    }

    function convertDMS(lat, lng) {
        var latitude = toDegreesMinutesAndSeconds(lat);
        var latitudeCardinal = Math.sign(lat) >= 0 ? "N" : "S";

        var longitude = toDegreesMinutesAndSeconds(lng);
        var longitudeCardinal = Math.sign(lng) >= 0 ? "E" : "W";

        return [latitude + " " + latitudeCardinal, longitude + " " + longitudeCardinal];
    }

    function getBagTypesURL(bbox, type, srs) {
        var options = 'request=getFeature';
        options += '&version=2.0.0';
        options += '&typenames=bag:' + type;
        options += '&srsName=' + srs;
        options += '&outputFormat=application/json';
        options += "&cql_filter=BBOX(geometrie, " + bbox.join(',') + ",'" + srs + "')";
        return 'https://geodata.nationaalgeoregister.nl/bag/wfs?' + options;
    }
    https://geodata.nationaalgeoregister.nl/kadastralekaartv3/wms?service=WMS&request=GetMap&layers=perceel&styles=&format=image%2Fpng&transparent=true&version=1.3.0&width=256&height=256&crs=EPSG%3A28992&cql_filter=perceelnummer%20%3D%207762&bbox=135286.72066510047%2C443915.7340757709%2C135357.31311489383%2C443986.32652556425
    function getPerceelImageURL(perceelNummer, latLonBbox) {
        var options = 'request=GetMap';
        options += '&layers=perceel';
        options += '&styles=';
        options += '&format=image/png';
        options += '&transparent=true';
        options += '&version=1.3.0';
        options += '&width=256';
        options += '&height=256';
        options += '&crs=EPSG:28992';
        options += '&cql_filter=perceelnummer%20%3D%20' + perceelNummer;
        options += '&bbox=' + latLonBbox.join(',');
        return 'https://geodata.nationaalgeoregister.nl/kadastralekaartv3/wms?' + options;
    }

    function toSVGPathsArr(geojson3857, vbwidth, vbheight, attributes) {
        xMin = Infinity;
        xMax = -Infinity;
        yMin = Infinity;
        yMax = -Infinity;
        var coordinates = geojson3857.geometry.coordinates;
        if (geojson3857.geometry.type !== "MultiPolygon") coordinates = [coordinates]
        for (var i = 0; i < coordinates.length; i++) {
            for (var j = 0; j < coordinates[i].length; j++) {
                for (var k = 0; k < coordinates[i][j].length; k++) {
                    var x = coordinates[i][j][k][0],
                        y = coordinates[i][j][k][1];
                    if (x < xMin) xMin = x;
                    if (x > xMax) xMax = x;
                    if (y < yMin) yMin = y;
                    if (y > yMax) yMax = y;
                }
            }
        }
        var geojson2svg_converter = geojson2svg({
            viewportSize: { width: 250, height: 250 },
            attributes: attributes,
            // attributes: {
            //     'style': 'stroke:#00ff00; fill: #F0F8FF;stroke-width:0.5px;',
            //     'vector-effect': 'non-scaling-stroke'
            // },
            mapExtent: {
                left: xMin,
                right: xMax,
                bottom: yMin,
                top: yMax
            },
        });
        return geojson2svg_converter.convert(geojson3857);
    }

    function transformToEspg3857OnSpot(feature) {
        for (var h = 0; h < feature.geometry.coordinates.length; h++) {
            var c2 = feature.geometry.coordinates[h];
            for (var i = 0; i < c2.length; i++) {
                var p = new proj4.Point(c2[i][0], c2[i][1]);   //any object will do as long as it has 'x' and 'y' properties
                proj4.transform(_proj4_proj_epsg4326, _proj4_proj_epsg3785, p);
                c2[i][0] = p.x;
                c2[i][1] = p.y;
            }
        }
    }

})();


