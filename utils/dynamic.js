/**
 *checksum of the string
 */
function checksum(str){	
	var csum = 0;
	var j = 1;	
	for(var i = 0; i < str.length; i++){
		csum += str.charCodeAt(i) * j;
		j++;
	}
	return csum;
}

/**
 * loaded methos. If mark is null just check loading state. Else - mark as loaded
 */
function loaded(prefix, path, mark){
	var csum = checksum(path);
	if(mark != null){
		document[prefix + '_' + csum] = true;
	}

	if(document[prefix + '_' + csum])return true;
	return false;
}


/**
 * Load style dinamically
 * @param path path to css file
 * @return true or false, if true than css already loaded
 */
function load_css(path){		
	// if script already loaded
	if(loaded('style', path) == true)return true;

	var fileref = document.createElement("link")
	fileref.setAttribute("rel", "stylesheet")
	fileref.setAttribute("type", "text/css")
	fileref.setAttribute("href", path)
	document.getElementsByTagName("head")[0].appendChild(fileref)

	// flag as loaded
	loaded('style', path, true);	
	return false;
}


/**
 * Load script
 * @param path path to script
 * @param load onload callback function
 */
function load_script(path, load){
	var onloadCallbackHandler = function(){
		// hanlde onload event by user method
		if(load != null){
			var onloadCount = 1;
			var onloadFunc = function(){
				if(load() == true){
					return;
				}
				setTimeout(onloadFunc, 100 * onloadCount++);
			}
			setTimeout(onloadFunc, 100);
		}
	}
	// if script already loaded
	if(loaded('script', path) == true){
		onloadCallbackHandler();
		return true;
	}
	
	var script = document.createElement('script');
	script.src = path;
	script.type = 'text/javascript';
	document.getElementsByTagName("head")[0].appendChild(script); 
	
	// flag script as loaded	
	loaded('script', path, true);
	onloadCallbackHandler();
	return false;
}

/**
 * Wait for some object existance
 * @param obj name of expected object
 * @param callback_func function which will be evaluted after object will be exists
 * @param timeout first shake timeout. Every shake it will be increased by formula timeout*2
 * @return null
 */
function wait_for(obj, callback_func, timeout){
    document.waiting_for_chain = document.waiting_for_chain || {};    
    var chain_staus = document.waiting_for_chain[obj] || false;
    
    if(chain_staus == true){ // skip checkings
        return;
    }
    
    try{
        eval('var arg = ' + obj + ';');
        document.waiting_for_chain[obj] = true;
        callback_func(arg);        
    }catch(e){
        if(timeout == null)timeout = 300;
        setTimeout(function(){ wait_for(obj, callback_func, timeout * 2); }, timeout);
    }    
}
