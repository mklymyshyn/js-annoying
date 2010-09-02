/**
 * Wrap function with default arguments.
 * Usage:
 * var f_orig = function(a, b){ ... };
 * var a = 1;
 * var b = 2;
 * var f_wrapped = Globa.wrapFunc(f_orig, a);
 * 
 * f_wrapped(b); // this execute f_orig and pass a as first argument and b as second 
 * 
 * @param {Function} func function to wrap
 * @return {Function} wrapped function
 */
var wrapFunc = function(func){
		var makeArray = Array.prototype.slice;
		var wrapArguments = makeArray.call(arguments, 1);					
		return function(){ return func.apply(this, wrapArguments.concat(makeArray.call(arguments))); };							
};


/**
 * Method to find element in array
 * @param value Value to find
 */
Array.prototype.inarr = function (value){
    // Returns true if the passed value is found in the
    // array. Returns false if it is not.
    for (var i = 0; i < this.length; i++) {
        // Matches identical (===), not just similar (==).
        if (this[i] === value) {
            return true;
        }
    }
    return false;
};


/**
 * Class to write log messages to console
 */
var logger = (function(){
   return {
       'log' : function(m){
           try{               
               var currentTime = new Date();
               var month = currentTime.getMonth() + 1;
               var day = currentTime.getDate();
               var year = currentTime.getFullYear();
               var hours = currentTime.getHours();
               var minutes = currentTime.getMinutes();
               var seconds = currentTime.getSeconds();

               var timestamp = month + "/" + day + "/" + year + ' ' + hours + ':' + minutes + ':' + seconds;               
               if(typeof(m) != 'object'){
                    console.log(timestamp + '   ' + m);
                }else{
                    console.log(timestamp);
                    console.log(m);
                }
           }catch(e){}    
       }
   } 
})();


/**
 * generate random string
 */
function randomString(len) {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var string_length = len | 8;
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
    return randomstring;
}

/** 
 * Template string
 */
var Template = (function(){
	return {	
	    'parseItem' : function(tpl, source, destination){	
		    return tpl.replace(new RegExp('[\{]' + source + '[\}]', 'g'), destination);
	    },	
	    'parse' : function(tpl, source){
    		for(var i in source){
    			tpl = Template.parseItem(tpl, i, source[i]);
    		}
    		return tpl;
	    }
	} 
})();


/** 
 * interface functions to work with jQuery UI Dialogs in ajax mode
 */

var UI = (function(){
    return {
        'detectHeight' : function(content, width_arg){
            var unit = 'px';
            if(width_arg == null)unit = '%';
            var width = width_arg || 100;
                
            var testBlock = $('<div style="width:' + width + unit +'; position:absolute; top:-2500px; left:-2500px;"></div>')
            $('body').append(testBlock);
            
            var clonedObj = content.clone();
            
            // fix if content have css attribute height
            if(clonedObj.css('height') != 'auto'){
                clonedObj.css('height', 'auto');
            }
            
            testBlock.append(clonedObj);
            
            var height = testBlock.height();            
            testBlock.remove();
            return height;
       },
       
       'loadbar' : function(msg){
           var message = msg || 'Loading, please wait...';
           return '<p style="color:#2BD809; font-size:12px; font-weight:bold;">' + message + '</p>';
       },
       'error' : function(msg){
           var message = msg || 'Error occured while make AJAX request...';
           return '<p style="color:#D95509; font-size:12px; font-weight:bold;">' + message + '</p>';
       }
    }
})();


var Auth = (function(){
    var user = null;
    return {
        'auth_required' : function(f){

            var AUTHORIZED = document.AUTHORIZED || null;
            if(AUTHORIZED == null || AUTHORIZED == false){
                $(document).data('unauth_trigger', f);
                try{
                    $(document).trigger('UNAUTHORIZED_ACTION');
                }catch(e){
                    //
                }
                return;
            }                        
            return f();
        },
        'is_authenticated' : function(){
            var AUTHORIZED = document.AUTHORIZED || null;
            return AUTHORIZED || false;
        },
        'login' : function(data){
            document.AUTHORIZED = true;
            $('.auth-deny').hide();
            $('.noauth-deny').show();
            
            var trigger = $(document).data('auth_trigger');                    
            if(trigger)trigger(data);
        },
        'logout' : function(){
            document.AUTHORIZED = false;
            $('.auth-deny').show();
            $('.noauth-deny').hide();
        },
        'get_user' : function(){
            return user || null;
        }
    }
})();


/**
 * A singleton object to manipulate and
 * confirm relation based on html elements dimension
 */
var Dimension = (function(){
	return {
	    dimensionOfElements : function(selector){
	        var minTop = -1, minLeft = -1, maxTop = 0, maxLeft = 0;	        
    	    $(selector).each(function(){			
    			var srcElement = $(this);
    			var dim = Dimension.get(srcElement);

    			if(minTop == -1)minTop = dim.top;
    			if(minLeft == -1)minLeft = dim.left;

    			minTop = Math.min(minTop, dim.top);
    			maxTop = Math.max(maxTop, dim.top + dim.height);
    			minLeft = Math.min(minLeft, dim.left);
    			maxLeft = Math.max(maxLeft, dim.left + dim.width);
    			return true;
    		});
    		return {
    		    'min' : {
    		        'top' : minTop,
    		        'left' : minLeft
    		    },
    		    'max' : {
    		        'top' : maxTop,
    		        'left' : maxLeft
    		    }
    		}
    	},
		'get' : function(e){
			var offset = e.offset();
			return {
				top : offset.top,
				left : offset.left, 
				width : e.outerWidth(),
				height : e.outerHeight()
			}
		},
		'is_equal' : function(e1, e2){
			if(e1.top == e2.top && e1.left == e2.left && 
			   e1.width == e2.width && e1.height == e2.height)return true;
			return false;
		},
		'in_area' : function(obj, pos){
			var e = Dimension.get(obj);
			
			if(pos.x > e.left && pos.y > e.top && 
			   pos.x < e.left + e.width && 
			   pos.y < e.top + e.height)return true;
			return false;
		}
	}
})();