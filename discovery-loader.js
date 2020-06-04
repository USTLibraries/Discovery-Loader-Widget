/*
	Discovery Widget Loader
	University of St. Thomas Libraries
	February 27, 2018

	Full Code and Documentation available at:
	https://github.com/USTLibraries/Discovery-Loader-Widget

	Loads javascript, css, and set custom variables. If you need different custom variables for different sites, you can make several versions of this file.
		
	This file may load multiple times, but will only execute the main content ONCE! This is because we could have the
	<script src=""></script> included in the HTML after every widget DIV. For instance, if there are multiple search boxes
	on the same page the this script could be called mutiple times. However, the files it loads only need to
	be loaded once. Therefore it detects if it has been loaded and executed by checking the global discovery_loaded variable.
*/

/*  HTML USAGE:

	<div class="discovery-search-widget">
		<a href="https://static.stthomas.edu/libraries/discovery">Search Library Resources</a>
	</div>
	<script type="text/javascript" src="//[yourdomain.edu]/[yourpath]/discovery-loader.js"></script>

	See example.html for more options
*/

/*
 * ==============================================================================
 * GLOBAL VARIABLES
 * 
 * discovery_widget_loader_loaded
 * discovery_widget_loader_custom_settings
 * 
 */

if ( typeof( discovery_widget_loader_loaded) === "undefined") {
	discovery_widget_loader_loaded = false;
}

if ( typeof( discovery_widget_loader_custom_settings) === "undefined") {
	discovery_widget_loader_custom_settings = null;
}

/*
 * ==============================================================================
 * ADD WIDGET SCRIPTS TO PAGE
 * 
 * First, check to make sure we haven't already requested the widget script.
 * Once this script runs then 
 * 
 */

if ( !discovery_widget_loader_loaded ) {	// We haven't loaded, go ahead and load

	/*
	****************************************************************************
	* Custom settings for Discovery-Loader-Widget
	*
	* discoveryCustomSettings will be passed to the Discovery-Loader-Widget function in primo[.min].js
	*/

	// Wondering what some of these values should be?
	// Do a search in Primo and look at the query string in the URL of the results page
	discovery_widget_loader_custom_settings = {
        primo_ve: false,
        css: 'https://example.com/assets/js/discovery/primo.css', // location of search box css file
        url: 'https://myprimo.myinstitution.example.edu', // base URL to your primo instance
        button_colors: '#510c76,#FFFFFF', // background and text hex color separated by comma '#FFFFFF,#000000'
        // primo values - many will be found in your query string or in Back Office
        instituion: 'YOUR_INSTITUTION',  // Even for VE, put this in
        vid: 'YOURVIEW', // from vid parameter in your search query url For VE it will be like INST:VIEW
        tab: 'default_tab',
        search_scope: 'yourscope',
        bulkSize: '10',
        // look at this in the query string: facet=local1,include,My University Library
        localParam: 'local2', // for a localized search, what is the param? local1, local2?
        localDesc: 'Example University', // the descriptor used for local resources
        // customized mapping
        facet_books: 'books', // can only include one material type, what type should BOOKS return?
        facet_audio: 'audios', // can only include one material type, what type should AUDIO return?
        facet_video: 'videos', // can only include one material type, what type should VIDEO return?
        facet_music: 'scores', // can only include one material type, what type should MUSIC return?
        facet_media: 'media', // can only include one material type, what type should AUVIS return?
		default_target: '_parent',
        default_tagline: 'Search the library catalog',
        default_placeholder: 'Find books, articles, movies, and more',
        default_placeholder_short: 'Keywords',
        default_advanced: 'More search options',
        default_login: 'My Account',
        default_button: 'Search', // Text for search button (there is no data- attr for this)
        default_label: 'Search', // Accessible label for screen readers (there is no data- attr for this)
        // custom link to place under search box
        custom_link_url: 'https://www.example.com/feedback',
        custom_link_text: 'Feedback',
        // define narrow width - at what point does search box move from being a wide format to a narrow format when in tight places/columns?
        // goes by space allowed for search box, not screen width. Perfect for narrow columns
        // it resizes automatically if the browser window is resized (responsive)
        // wide format: search icon in left side of text search field, Search text in button
        // narrow format: no search icon in left side, but button becomes square with icon, no text. Perfect in small spaces/columns or screens
        narrow_max: 380 // Always want a mag icon for search button? set this extremly high! 9999
    };

	// OPTIONAL
	let ver = "20200407-0942"; // Debug use only. Just an indicator that shows in the Browser Console. Does nothing to affect the running of the code.
	console.log("DISCOVERY LOADER: "+ver);

    /* *******************************************************************************************************
	 * Add the JavaScript and CSS files to the page
	 */

	// add the JS to the page
	console.log("DISCOVERY LOADER: Adding js to page: " + discovery_widget_loader_custom_settings['js'] );
	let sc=document.createElement('script');
	sc.type='text/javascript';
	sc.src= discovery_widget_loader_custom_settings['js'];
	document.getElementsByTagName('body')[0].appendChild(sc);

	// add the CSS to the page
	if(discovery_widget_loader_custom_settings['css'] !== "") {
		console.log("DISCOVERY LOADER: Adding css to page: " + discovery_widget_loader_custom_settings['css'] );
		let css=document.createElement('link');
		css.type='text/css';
		css.rel='stylesheet';
		css.href= discovery_widget_loader_custom_settings['css'];
		document.getElementsByTagName('head')[0].appendChild(css);
	}

    /* *******************************************************************************************************
	 * Finish up
	 */

	// set the loaded flag to true
	discovery_widget_loader_loaded = true;
	console.log("DISCOVERY LOADER: Done");
}