
(function () {

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

    }

    window.initDetailsPanden = function (page) {
        pandenPromise.then(function () {
            var list = document.getElementById('details-panden-list-content');

            var html = '';
            for (var i = 0; i < panden.features.length; i++) {
                var props = panden.features[i].properties;
                html += '<ons-list-item><div class="left">';
                html += panden.features[i].id.replace('.', ' ');
                html += '</div><div class="right">';
                var paths = toSVGPathsArr(panden.features[i], 250, 250, {
                    'style': 'stroke:#00ff00; fill: #F0F8FF;stroke-width:0.5px;',
                    'vector-effect': 'non-scaling-stroke'
                });
                var svg = '<svg width="40" height="40" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">';
                svg += paths.join('');
                svg += '</svg>';
                html += svg;
                html += '</div></ons-list-item>';
            }
            var d = document.createElement('div');
            d.innerHTML = html;
            list.appendChild(d);
        });
    }

    window.initDetailsVerblijfsPlaatsen = function (page) {

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
        geojson3857 = reproject.reproject(
            page.data.feature, 'EPSG:4326', 'EPSG:3857', proj4.defs);

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
                'style': 'stroke:#00ff00; fill: #F0F8FF;stroke-width:0.5px;',
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
        console.log(geojson3857);
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

})();

