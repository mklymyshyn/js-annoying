/**
 * Humanize file size
 */
function filesizeFormat(filesize){    
	if (filesize >= 1073741824) {
	     filesize = number_format(filesize / 1073741824, 2, '.', '') + ' Gb';
	} else { 
		if (filesize >= 1048576) {
     		filesize = number_format(filesize / 1048576, 2, '.', '') + ' Mb';
   	} else { 
			if (filesize >= 1024) {
    		filesize = number_format(filesize / 1024, 0) + ' Kb';
  		} else {
    		filesize = number_format(filesize, 0) + ' bytes';
			};
 		};
	};
  return filesize;
};