
function initSearchPage(page) {
    
    document.getElementById('location-search')
        .addEventListener('click', function(e) {
            var term = document.getElementById('location-search-input').value;
            getJSON('https://api.teleport.org/api/cities/?search=' + term, function(res) {
                var list = res._embedded['city:search-results'];
                var filtered = [];
                for(var i = 0; i < list.length; i++) {
                    if (list[i].matching_full_name.match(/netherlands$/i)) {
                        filtered.push(list[i])
                    }
                }
                handleSearch(filtered);
            });
        });

    function handleSearch(results) {
        var list = document.getElementById('location-search-results');
        while(list.firstChild) list.removeChild(list.firstChild);
        results.forEach(function(city) {
            var div = document.createElement('div');
            var cityName = city.matching_full_name.split(', ').slice(0, 2).join(', ');
            div.innerHTML = 
                '<ons-list-item tappable>' + cityName + '</ons-list-item>';
                div.firstChild.addEventListener('click', function() {
                    window.fn.city = city;
                    window.fn.load('views/map.html')
                });
            list.appendChild(div.firstChild);
        });
        document.getElementById('location-search-card').setAttribute('class', '');
        if (results.length === 0) {
            list.innerHTML = '<ons-list-item>Geen resultaten</ons-list-item>';
        }
    }
}
