var EVENTS = [
// EVENT NAME               |       ARGUMENTS
// ---------------------------------------------------------------------
'CURRENT_LOCATION_CLICK'    ,       //
'CHANGE_LOCATION'           ,       //
];


var Events = (function(){
    /**
     * Singleton to store handlers for events
     */
    var events = {};
    var inits = [];
    var initialized = false;
    
    var bindEvent = function(name, obj){
        $(document).bind(name, obj.handler);
    };
    return {
        /**
         * bind new event with handler
         * @param name name of event
         * @obj object ot handle event
         */
        'bind' : function(name, obj){
            events[name] = obj;
            
            var initFunc = function(){ bindEvent(name, obj); };
            if(initialized == false){
                inits.push(initFunc);
            }else{
                initFunc();
            }
        },
        /**
         * function to initialize event. This 
         * funcionality should be implemented inside handler object
         */
        'init' : function(){
            for(var i = 0; i < inits.length; i++){
                var func = inits[i];
                func();
            }
            inits = [];
            initialized = true;
        }
    }
})();



$(document).ready(function(){
    Events.init();
});