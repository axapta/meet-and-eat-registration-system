/**
 * Created with IntelliJ IDEA.
 * User: jan
 * Date: 16.02.13
 * Time: 08:22
 *
 * SEE https://github.com/smeijer/L.GeoSearch
 */




L.GeoSearch = {};
L.GeoSearch.Provider = {};

// MSIE needs cors support
jQuery.support.cors = true;

L.GeoSearch.Result = function (x, y, label) {
    this.X = x;
    this.Y = y;
    this.Label = label;
};

L.Control.GeoSearch = L.Control.extend({

    initialize: function (options) {
        this._found = false;
        this._config = {};
        L.Util.extend(this.options, options);
        this.setConfig(options);
    },

    setConfig: function (options) {
        this._config = {
            'country': options.country || '',
            'provider': options.provider,

            'notFoundMessage': options.notFoundMessage || 'Sorry, that address could not be found.',
            'messageHideDelay': options.messageHideDelay || 3000,
            'zoomLevel': options.zoomLevel || 18
        };
    },

    onAdd: function (map) {
        var $controlContainer = $(map._controlContainer);

        if ($controlContainer.children('.leaflet-top.leaflet-center').length == 0) {
            $controlContainer.append('<div class="leaflet-top leaflet-center"></div>');
            map._controlCorners.topcenter = $controlContainer.children('.leaflet-top.leaflet-center').first()[0];
        }

        this._map = map;
        this._container = L.DomUtil.create('div', 'leaflet-control-geosearch');

        var msgbox = document.createElement('div');
        msgbox.id = 'leaflet-control-geosearch-msg';
        msgbox.className = 'leaflet-control-geosearch-msg';
        this._msgbox = msgbox;

        var resultslist = document.createElement('ul');
        resultslist.id = 'leaflet-control-geosearch-results';
        this._resultslist = resultslist;

        $(this._msgbox).append(this._resultslist);
        $(this._container).append(this._msgbox);

        L.DomEvent.disableClickPropagation(this._container);

        return this._container;
    },

    geosearch: function (street, number, city) {
        this._found = true;
        try {
            var provider = this._config.provider;

            if(typeof provider.GetLocations == 'function') {
                var qry = street + " " + number + ", " + city;
                var results = provider.GetLocations(qry, function(results) {
                    this._processResults(results);
                }.bind(this));
            }
            else {
                var url = provider.GetServiceUrl(street, number, city);

                $.getJSON(url, function (data) {
                    try {
                        var results = provider.ParseJSON(data);
                        this._processResults(results);
                    }
                    catch (error) {
                        this._printError(error);
                    }
                }.bind(this));
            }
        }
        catch (error) {
            this._printError(error);
        }
    },
   _processResults: function(results) {
        if (results.length == 0)
            throw this._config.notFoundMessage;

        this._map.fireEvent('geosearch_foundlocations', {Locations: results});
        this._showLocation(results[0]);
        this._location = results[0];

    },

    _showLocation: function (location) {
        if (typeof this._positionMarker === 'undefined')
            this._positionMarker = L.marker([location.Y, location.X], {draggable: true}).addTo(this._map);
        else
            this._positionMarker.setLatLng([location.Y, location.X]);

        this._map.setView([location.Y, location.X], this._config.zoomLevel, false);
        this._map.fireEvent('geosearch_showlocation', {Location: location});
    },

    _printError: function(message) {
        this._found = false;
        $(this._resultslist)
            .html('<li>'+message+'</li>')
            .fadeIn('slow').delay(this._config.messageHideDelay).fadeOut('slow',
                    function () { $(this).html(''); });
    },

    getSelectedLocation: function() {
        if (typeof this._positionMarker === 'undefined') {
            return undefined;
        }
        if (!this._found) {
            return undefined;
        }
        return this._positionMarker.getLatLng();
    }
});