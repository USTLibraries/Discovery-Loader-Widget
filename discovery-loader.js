/*
	Discovery Loader Widget
	University of St. Thomas
	September 22, 2016
	
	Full Code (including non-minified) and Documentation available at:
	https://github.com/USTLibraries/Discovery-Loader-Widget
	
	https://jscompress.com/ was used to create minified js version
	https://cssminifier.com/ was used to create the minified css version
	
*/

/*  HTML USAGE:


	<div class="discovery-search-widget">
		<a href="https://static.stthomas.edu/libraries/discovery">Search Library Resources</a>
	</div>
	<script type="text/javascript" src="//[yourdomain.edu]/[yourpath]/discovery-loader.js"></script>
	
	
	See example.html for more options
*/


/*  EXPLAINER:
 
    This loader is basically versioning/development/launch tool
    The main intention is to provide an unchanging script tag like <script src="discovery-loader.js"></script> that can evolve
    It checks for requirements and dynamically brings in the JavaScript and CSS necessary
	
	There are launch and file[] variables that aide in development and deploying the currect version of the script 
	at a specified time.
	
	You can preload the script to be deployed by setting the myFile]NEW}[js/css values and then setting the launch timer.
	
	If you wish to ignore the launch/deployment concept just set launch to 0 and myFile[NEW][js/css], don't worry about [OLD]
	
	TO SET UP A LAUNCH/DEPLOY: (ignore this if you don't care)
	   1. set myFile[OLD][js/css] to the current script and css file
	   2. set myFile[NEW][js/css] to the script and file you wish to deploy
	   3. set launch to the date and time you want it to deploy in YYYYMMDDHHMM format
	   
	   Until the date/time passes the OLD files will be loaded. Once the launch date passes the NEW files will be loaded.
	   You don't have to worry about rotating the new to old until you are getting ready for your next deploy
	   (just move the myFile[NEW][js/css] values to OLD, reset the launch date/time, and fill in the new NEW values)
	   
	TO USE IT AS A TEST/DEVELOPMENT INSTANCE: (ignore this if you don't care)
	   1. Follow the same steps as above where:
	       - OLD is the current, live file in production and 
		   - NEW is the file you are developing/testing, and 
		   - launch is something way in the future like 202012312359 or 999999999999 (make sure you get a high enough number!)
	   2. On your TEST/DEV html page add a piece of code to override the launch:
	       <script>discovery_load = "NEW"</script>
		   
	   This will override the launch and force the NEW files to be loaded for pre-launch testing/development purposes
	   Note: You can also override a post launch by setting discovey_load = "OLD" but that's hard to wrap your head around

	A VERSIONING TIP:
	   I always name my files with dates as version numbers (summon-20160913.js, summon-20160913.css)
	   So that when I come up with a new version (summon-20160919.js, summon-20160913.css) they are easy to visually manage
	   
			EXAMPLE:
				var myFile = { 
				   OLD:{ js:"//static.stthomas.edu/libraries/js/discovery/summon-20160913.js",
						 css:"//static.stthomas.edu/libraries/js/discovery/summon-20160913.css" 
				   },
				   NEW:{ js:"//static.stthomas.edu/libraries/js/discovery/summon-20160919.js",
						 css:"//static.stthomas.edu/libraries/js/discovery/summon-20160919.css" 
				   }
			
			ALTERNATE EXAMPLE: However, if you are not using the launch function you can use a single file name, or just change it as needed:
			
				var launch = 0;
				var myFile = { 
				   OLD:{ js:"",
						 css:"" 
				   },
				   NEW:{ js:"//static.stthomas.edu/libraries/js/discovery/summon.js",
						 css:"//static.stthomas.edu/libraries/js/discovery/summon.css" 
				   }		
		
    NOTE: This file may load multiple times, but will only execute the main content ONCE! This is because we have the
	    <script src=""></script> included in the HTML after every widget DIV. For instance, if there are multiple search boxes
		on the same page the this script could be called mutiple times. However, the files it loads only need to
		be loaded once. Therefore it detects if it has been loaded and executed by checking the global discovery_loaded variable.
*/

/* ******************************************************************************************************
 * PERFORM LOAD CHECK
 * If the discovery_loaded global variable exists, we've already loaded our scripts and just won't do anything this time around 
 */

if ( typeof( discovery_loaded ) === "undefined" ) {	// We haven't loaded, go ahead and load

	/* ******************************************************************************************************
	 * CUSTOM VARIABLES
	 *
	 * Update your OLD and NEW css/js files and launch date/time here (refer to comments at beginning of file)
	 *
	 * If you don't care to use the deploay/launch functionality, just set NEW and launch = 0
	 */
	
	// REQUIRED: YYYYMMDDHHMM - or 0 if you strictly want to use myFile[NEW]
	var launch = 0;
		
	// REQUIRED: Only NEW is required as long as launch is set to 0
	var myFile = { 
	   OLD:{ js:"",
			 css:"" 
		   },
	   NEW:{ js:"//static.stthomas.edu/libraries/js/discovery/summon-20161013-min.js",
			 css:"//static.stthomas.edu/libraries/js/discovery/summon-20161013-min.css" 
		   }
	};

	// OPTIONAL
	var ver = "0.1.2"; // Debug use only. Just an indicator that shows in the Browser Console. Does nothing to affect the running of the code.
	
	/* END CUSTOM VARIABLES
	 * The rest of the code doesn't really need to be touched unless you want to change/break functionality
	 * HOWEVER: be sure to set the discoveryBaseURL in the loaded script (new.js or whatever you named it)
	 ******************************************************************************************************* */

    /* *******************************************************************************************************
	 * FUNCTION to generate a timestamp in YYYYMMDDHHSS format
	 */
    var getV = function getV() {
		var pad = function(n){ return (n < 10) ? ("0" + n) : n;  }; // inner helper function
		var today = new Date();	// get today's date
		
		// create a string in YYYYMMDDHHSS format
		var v = today.getFullYear() +""
		      + pad(today.getMonth()+1) +""
			  + pad(today.getDate()) +""
			  + pad(today.getHours()) +""
			  + pad(today.getMinutes());

		return v;
	}
	
	
    /* *******************************************************************************************************
	 * Get the timestamp (YYYYMMDDHHSS)
	 */
	var currentTimestamp = getV();
	console.log("DISCOVERY LOADER: Version is: "+ver+" w/ TIMESTAMP: "+currentTimestamp);

    /* *******************************************************************************************************
	 * Check launch date and set whether we are loading OLD or NEW
	 *
	 * If discovery_load is not set (which in production it won't be) determine if a new script has launched
	 * This is typically already set if there was an override (<script>discovery_load = "NEW";</script>
	 *
	 * In a dev/testing environment we can preset discovery_load to "NEW" or "OLD" to force one over the other
	 */
	if ( typeof( discovery_load ) === "undefined" ) {  // if no override:
		 if ( launch > currentTimestamp ) { discovery_load = "OLD"; }  // launch date not yet hit
		 else { discovery_load = "NEW"; } // launch date passed
	}

    /* *******************************************************************************************************
	 * Add the JavaScript and CSS files to the page
	 */
	 
	// add the JS to the page
	console.log("DISCOVERY LOADER: Adding js: " + myFile[discovery_load]['js'] );
	var sc=document.createElement('script');
	sc.type='text/javascript';
	sc.src= myFile[discovery_load]['js'] + "?v=" + currentTimestamp;
	document.getElementsByTagName('body')[0].appendChild(sc);
	
	// add the CSS to the page
	console.log("DISCOVERY LOADER: Adding css: " + myFile[discovery_load]['css'] );
	var css=document.createElement('link');
	css.type='text/css';
	css.rel='stylesheet';
	css.href= myFile[discovery_load]['css'] + "?v=" + currentTimestamp;
	document.getElementsByTagName('head')[0].appendChild(css);	

    /* *******************************************************************************************************
	 * Finish up
	 */
	 
	// set the loaded flag to true
	discovery_loaded = true;
	console.log("DISCOVERY LOADER: Done");
}