
/** 
 * Heler to get info about coords
 * and get details about current location name
 */
var GeoHelper = (function(){
    try{
        var geocoder = new GClientGeocoder();
    }catch(e){
        var geocoder = null;
    }
    
    /**
     * Function to get some custom arguments from marker and
     * processint its values by condition
     * @param name name of marker argument
     * @param condition function. If function return true then value 
     *           of argument will be added to list of results, 
     *           if return null then just return current value
     *           and if false – skip iteration and move on
     */
    var goThroughMarkers = function(name, condition){
        var prefix = 'map_marker';
        var returnVal = [];

        for(var o in geodjango){
            if(o.substring(0, prefix.length) == prefix){
                // search key in obfuscated elements
                for(var s in geodjango[o]){
                    if(geodjango[o] && geodjango[o][s] && geodjango[o][s][name]){
                        var res = condition(geodjango[o][s][name]);
                        if(res == true){
                            returnVal.push(geodjango[o]);
                        }else
                        if(res == null){
                            return geodjango[o];
                        }
                        break;
                    }
                };                
            }
        }
        return returnVal;    
    };
    
    return {
        /**
         * Get info about location from response.
         * There is few important items which return this method:
         *  1) City name (if available)
         *  2) Country name
         *  3) Title (which consist from City name and country name splitted by comma).
         *  Example result: { 'country' : 'Ukraine', 'city' : 'Kiev', 'title' : 'Kiev, Ukraine' }
         */
        getAddrInfo : function(response){
            var city = "";
            var country = "";
            if(response.Placemark && response.Placemark[0] && response.Placemark[0] && response.Placemark[0].AddressDetails && 
                    response.Placemark[0].AddressDetails.Country){
                var pmark = response.Placemark[0].AddressDetails.Country;
                country = pmark.CountryName;
                if(pmark.AdministrativeArea && pmark.AdministrativeArea.Locality){
                    city = pmark.AdministrativeArea.Locality.LocalityName;
                }else
                if(pmark.AdministrativeArea && pmark.AdministrativeArea.SubAdministrativeArea && pmark.AdministrativeArea.SubAdministrativeArea.Locality){
                    city = pmark.AdministrativeArea.SubAdministrativeArea.Locality.LocalityName;
                }
            }

            var location_title = country;
            if(city != ""){
                location_title = city + ', ' + country
            }
            return {
                'city' : city,
                'country' : country,
                'title' : location_title,
            }            
        },
        showAddress : function(response, callback){
            if (!response || response.Status.code != 200) {
                alert("An error occured with Google Maps. Status Code:" + response.Status.code);
            } else {
                callback(response);
            }
        },
        getLocations : function(coords, callback){
            geocoder.getLocations(coords, function(response){ GeoHelper.showAddress(response, callback); });
        },
        /**
         * Get GMarker by option from custom options. This
         * functionality to find markers on map which generated directly by geodjango.
         * @param name name of custom option
         * @param value value to find
         */
        markerByOption : function(name, value){
            var result = goThroughMarkers(name, function(curValue){
               if(curValue == value)return null;
               return false;
            });
            
            if(result == null || result.length == 0)
                return null;          
                
            return result;
        },
        excludeMarkersList : function(name, value){
            var result = goThroughMarkers(name, function(curValue){
                if(curValue != value)return true;
                return false;
            });
            return result;
        }        
    }
})();

