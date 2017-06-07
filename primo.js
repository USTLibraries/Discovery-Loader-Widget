/*
	Discovery Loader Widget (Primo)
	University of St. Thomas Libraries
	May 12, 2017
	
	Full Code (including non-minified) and Documentation available at:
	https://github.com/USTLibraries/Discovery-Loader-Widget
	
	https://jscompress.com/ was used to create minified js version
	https://cssminifier.com/ was used to create the minified css version
	
	Primo Search Box Documentation:
	https://knowledge.exlibrisgroup.com/Primo/Product_Documentation/New_Primo_User_Interface/New_UI_Customization_-_Best_Practices#Creating_a_Search_Box_With_Deep_Links_to_the_New_UI

	
*/

(function () {
	"use strict";


	/* *****************************************************************
	 * CUSTOM VARIABLES
	 */
	
	var ver = "0.0.23-20170607"; // Just something to check for in the Browser Console
	                             // Does nothing else except keep you from pulling your hair out when you wonder if the code changes 
								 // you made are loaded or cached or not deployed or as an indicator that you really are going crazy
								 // and should take a break


	var discoveryCustom = { css: 'primo.css', // location of search box css file
							url: 'https://yoursite.primo.exlibrisgroup.com', // base URL to your primo instance
							instituion: 'YOUR_INSTITUTION',
							vid: 'YOURVIEW',
							tab: 'default_tab',
							search_scope: 'yourscope',
							bulkSize: '10',
							// facet=local1,include,My University Library
							localParam: 'local1', // for a localized search, what is the param? local1, local2?
							localDesc: 'University of Me', // the descriptor used for local resources
							facet_books: 'books', // can only include one material type, what type should BOOKS return?
							facet_audio: 'audio', // can only include one material type, what type should AUDIO return?
							facet_video: 'video', // can only include one material type, what type should VIDEO return?
							facet_music: 'score' // can only include one material type, what type should MUSIC return?
						};
	
	/* 
	 * END CUSTOM VARIABLES
	 * Yep, that's it. No other code changes are necessary in this .js file
	 ***************************************************************** */

	console.log("DISCOVERY: Loading Discovery search box (Primo: ver "+ver+")...");
	
	var cssCheck = function() {

		// load in the css, but check first to make sure it isn't already loaded
		// we do this rather than check for the file because the search box css could have been merged into another file, so we check css properties instead
		// just so long as ".discovery-search-widget label { left: -10000px; }" doesn't change!
		var elem = document.getElementsByClassName("discovery-search-widget");

		if (elem.length > 0 && elem[0].getElementsByTagName("label")[0].style.left !== "-10000px" ) {
			console.log("DISCOVERY: Adding css: " + discoveryCustom.css );
			var css=document.createElement('link');
			css.type='text/css';
			css.rel='stylesheet';
			css.href= discoveryCustom.css;
			document.getElementsByTagName('head')[0].appendChild(css);
		}

	};


	// check for jQuery, if not exist, just place a plain javascripted search box (no scoping)
	// this entire script could be re-written so as to not use jQuery, but it serves my purpose
	if (  typeof($) !== "undefined" ) {
		$(document).ready( function(){

			(function( $ ) {

				$.fn.discoverySearchWidget = function() {

					return this.each( function() {

						var isTrue = function (d) {
							return ( typeof(d) !== "undefined" && d !==  null && d !==  "" && d.toLowerCase() !== "false" && d.toLowerCase() !== "no");
						};

						var isDefault = function (d) {
							return (d.toLowerCase() === "default");
						};

						var isUniqueID = function (d) {
							return ( $("div#"+d).length < 2 );
						};

						var createHiddenField = function(name, value, pAttr) {
							var f = document.createElement("input");
							$(f).attr({
								type: 'hidden',
								name: name,
								value: value
							});
							if ( typeof(pAttr) !== "undefined") {
								$(f).attr(pAttr);
							}
							return f;
						};

						// get the div's ID
						var searchId = $(this).attr("id");

						// make sure the ID on the element is unique, change it if not
						if( !isTrue(searchId) || !isUniqueID(searchId) ) {
							console.log("DISCOVERY: Search Widget with no-ID/non-unique ID detected ("+searchId+")... assigning a unique ID");
							if( !isTrue(searchId) ) { searchId = "discoverySearch"; }

							// select a new id
							var newId = "";
							do {
								newId = searchId + "_" + Math.floor((Math.random() * 1000) + 1); 
							} while (!isUniqueID( newId ) );

							// assign the new id
							searchId = newId;
							$(this).attr("id",searchId);

							console.log("DISCOVERY: Search Widget id reassigned: " + searchId);

						}

						var temp = "";	// a holder when we evaluate data- attribute defaults		


						/* *****************************************************************
						 * Create the form element
						 */


						var searchForm = document.createElement("form");
						$(searchForm).attr({
							id: searchId+'-searchForm',
							method: 'GET',
							name: 'primoSearch',
							target: '_blank',
							action: discoveryCustom.url + '/primo-explore/search',
							class: 'discovery-search-box',
							enctype: 'application/x-www-form-urlencoded; charset=utf-8',
							onsubmit: 'searchPrimoEnhanced(\''+searchId+'\')'
						});


						/* *****************************************************************
						 * Create the search field
						 */


						var searchField = document.createElement("input");
						$(searchField).attr({
							id: searchId+'-primoQueryTemp',
							type: 'search',
							name: 'primoQueryTemp',
							autocomplete: 'off',
							class: 'discovery-search-field'
						});

						temp = $(this).attr("data-placeholder");
						if( isTrue(temp) ){

							// default placeholder text (if placeholder text is true
							var s = "Find books, articles, movies, and more"; 

							if ( !isDefault(temp) ) { s = temp;	}

							$(searchField).attr("placeholder", s);
						}

						// allow enter key to search (iOS, Android, Mac, PC, Firefox, Chrome, etc)
						$(searchField).keydown(function(event) {
							if (event.keyCode === 13) {
								$(this).trigger("keyup"); // make sure it gets sent!**
								searchPrimoEnhanced(searchId); // this.form.submit();
								return false;
							 }
						});

						/* *****************************************************************
						 * Create the label for search field
						 */

						var searchLabel = document.createElement("label");
						$(searchLabel).attr("for", searchId+"-primoQueryTemp").html("Search");			


						/* *****************************************************************
						 * Generate the hidden fields
						 */


						// we use an array
						var hiddenFields = [];

						// the custom hidden fields
						hiddenFields.push( createHiddenField("institution",discoveryCustom.instituion) );
						hiddenFields.push( createHiddenField("vid",discoveryCustom.vid) );
						hiddenFields.push( createHiddenField("tab",discoveryCustom.tab) );
						hiddenFields.push( createHiddenField("search_scope",discoveryCustom.search_scope) );
						hiddenFields.push( createHiddenField("bulkSize",discoveryCustom.bulkSize) );

						// the fixed hidden fields
						hiddenFields.push( createHiddenField("mode","Basic") );
						hiddenFields.push( createHiddenField("displayMode","full") );
						hiddenFields.push( createHiddenField("highlight","true") );
						hiddenFields.push( createHiddenField("dum","true") );
						hiddenFields.push( createHiddenField("query","",{id: searchId+"-primoQuery"}) );
						hiddenFields.push( createHiddenField("displayField","all") );
						hiddenFields.push( createHiddenField("pcAvailabiltyMode","true") );

						// material/content type scoping
						// IF BOOK|MUSIC|FILM|other
						temp = $(this).attr("data-scope-content-type");
						if( isTrue(temp) ) {

							temp = temp.toLowerCase();

							if ( temp === "book" || temp === "books" ) {
								hiddenFields.push( createHiddenField("facet","rtype,include,"+discoveryCustom.facet_books) );
							} else if ( temp === "audio" ) {
								hiddenFields.push( createHiddenField("facet","rtype,include,"+discoveryCustom.facet_audio) );
							} else if ( temp === "video" ) {
								hiddenFields.push( createHiddenField("facet","rtype,include,"+discoveryCustom.facet_video) );
							} else if ( temp === "music" ) {
								hiddenFields.push( createHiddenField("facet","rtype,include,"+discoveryCustom.facet_music) );
							} else {
								var myTypes = (temp.trim()).split(','); // we trim in case it gets messy " param,aasdf,asdf "
								hiddenFields.push( createHiddenField("facet", "rtype,include,"+myTypes[0].trim() ) ); // we can only include 1
							}

						}

						// subject scoping
						temp = $(this).attr("data-scope-subj-terms");
						if( isTrue(temp) ) {

							temp = temp.toLowerCase();

							var myTypes = (temp.trim()).split(','); // we trim in case it gets messy " param,aasdf,asdf "
							for (var i = 0, len = myTypes.length; i < len; i++) {
								hiddenFields.push( createHiddenField("facet", "topic,include,"+myTypes[i].trim() ) ); // we trim for asdf, asdf , asdf
							}

						}

						// discipline scoping
						// facet=topic,include,philosophy,history
						temp = $(this).attr("data-scope-discipline");
						if( isTrue(temp) ) {

							temp = temp.toLowerCase();

							var myTypes = (temp.trim()).split(','); // we trim in case it gets messy " param,aasdf,asdf "
							for (var i = 0, len = myTypes.length; i < len; i++) {
								hiddenFields.push( createHiddenField("facet", "topic,include,"+myTypes[i].trim() ) ); // we trim for asdf, asdf , asdf
							}

						}

						// language scoping
						// facet=lang,exact,fre
						temp = $(this).attr("data-scope-language");
						if( isTrue(temp) ) {

							temp = temp.toLowerCase();

							var myTypes = (temp.trim()).split(','); // we trim in case it gets messy " param,aasdf,asdf "
							for (var i = 0, len = myTypes.length; i < len; i++) {
								hiddenFields.push( createHiddenField("facet", "lang,exact,"+myTypes[i].trim() ) ); // we trim for asdf, asdf , asdf
							}

						}

						// date scoping
						// facet=searchcreationdate,include,1700|,|2017
						temp = $(this).attr("data-scope-date");
						if( isTrue(temp) ) {
							temp = temp.toLowerCase().replace(/-/g,""); // remove "-" in dates as they were used in summon

							var myTypes = (temp.trim()).split(':');

							if(myTypes[0] === "") {myTypes[0] = 0; }
							if(myTypes[1] === "") {	myTypes[1] = (new Date()).getFullYear(); }

							var v = "searchcreationdate,include,"+myTypes[0].substring(0, 4)+"|,|"+myTypes[1].substring(0, 4);
							// Primo only takes 4 digit year as facet

							hiddenFields.push( createHiddenField("facet", v) );
						}

						// full text scoping
						//&facet=tlevel,include,online_resources
						temp = $(this).attr("data-scope-fulltext");
						if( isTrue(temp) ) {
							hiddenFields.push( createHiddenField("facet", "tlevel,include,online_resources") );
						}


						// available locally
						// facet=local1,include,My University Library
						temp = $(this).attr("data-scope-local");
						if( isTrue(temp) ) {
							hiddenFields.push( createHiddenField("facet", discoveryCustom.localParam+",include,"+discoveryCustom.localDesc) );
						}


						// scholarly scoping
						// facet=tlevel,include,peer_reviewed
						temp = $(this).attr("data-scope-scholarly");
						if( isTrue(temp) ) {
							hiddenFields.push( createHiddenField("facet", "tlevel,include,peer_reviewed") );
						}


						/* *****************************************************************
						 * Generate the search button
						 */	

						var searchButton = document.createElement("input");
						$(searchButton).attr({
							type: 'submit',
							name: 'search',
							value: 'Search',
							class: 'discovery-search-button',
							id: 'go',
							title: 'Search',
							onclick: 'searchPrimoEnhanced(\''+searchId+'\')',
							alt: 'Search'
						});


						/* *****************************************************************
						 * Create the tagline
						 */


						var searchTagline = null;
						temp = $(this).attr("data-tagline"); // grab the data attribute
						if( isTrue(temp) ){

							// default tagline text (if data-tagline is "default")
							var s = "Search the library catalog"; 

							// Use default or do we have something in data-tagline attribute?
							if ( !isDefault(temp) ) { s = temp;	}

							// Create the tagline HTML tag
							searchTagline = document.createElement("p");
							$(searchTagline).addClass("discovery-tagline");
							$(searchTagline).html(s);
						}


						/* *****************************************************************
						 * Create the advanced search link
						 */


						var searchAdvanced = null;
						temp = $(this).attr("data-advanced"); // grab the data attribute
						if( isTrue(temp) ){

							// default advanced search link text (if data-advanced is "default")
							var s = "More search options";

							// Use default or do we have something in data-advanced attribute?
							if ( !isDefault(temp) ) { s = temp;	}

							// Create the advanced search HTML tag
							searchAdvanced = document.createElement("p");
							$(searchAdvanced).addClass("discovery-advanced");	

							var a = document.createElement("a");
							$(a).attr("href",discoveryCustom.url + "/primo-explore/search?mode=advanced&vid=" + discoveryCustom.vid);
							$(a).html(s);
							$(a).appendTo(searchAdvanced);
						}

						/* *****************************************************************
						 * Add an element to contain autosuggest
						 */

						/* The default spot for autocomplete to put it's UL and LI tags are at the end of the body,
						   however CSS styling may conflict if there are several autocompletes on the page such as
						   university searches, database finders, etc. So we create our own little "namespace"
						   and direct our CSS to only style within that name space so we are not affecting other
						   autocomplete UIs. Our discovery CSS won't override other autocomplete UIs but will still 
						   inherit CSS from those unless their CSS is also scoped in their CSS

						   For Example the default UI would be like:
						   .ui-autocomplete {}

						   And our scoped CSS for our UI would be like:
						   .discovery-search-widget .ui-autocomplete {}

						   Ours would still inherit .ui-autocomplete {} unless we explicitly override using !important
						   or load it after the main style sheet (which isn't always guaranteed)
						*/

						// Create the div tag that will hold the auto suggest ul list
						var myAutosuggest = document.createElement("div");
						$(myAutosuggest).attr({
							id: searchId+'-autosuggest',
							class: "discovery-search-autosuggest"
						});

						/* *****************************************************************
						 * Put it all together
						 */


						// assemble the search form
						$(searchForm).append(searchLabel);
						$(searchForm).append(searchField);
						$(searchForm).append(hiddenFields);
						$(searchForm).append(searchButton);

						// assemble the discovery box
						$(this).html(searchForm); // replace placeholder a tag with form
						if( searchTagline !== null ) { $(this).prepend(searchTagline); } // before form
						if( searchAdvanced !== null ) { $(this).append(searchAdvanced); } // after form
						if( myAutosuggest !== null ) { $(this).append(myAutosuggest); } // after form
						
						temp = $(this).attr("data-scope");
						if ( isTrue(temp) && temp.toLowerCase() === "journal") {
							// if it is a journal box, modify it.... just easier to do it all here (just takes a millisecond)
							$(searchForm).find("input[name='search_scope']").detach(); // remove the scope - search_scope
							$(searchForm).find("input[name='mode']").detach();// remove the mode
							// TODO, MAYBE: there's a few more to detach
							$(searchForm).find("input[name='tab']").attr("value","jsearch_slot"); // switch tab over to journal
							$(searchForm).attr("action", discoveryCustom.url + "/primo-explore/jsearch");
							$(searchForm).append(createHiddenField("journals", "", {id: searchId+"-primoQueryjournals"}));// add journals	
						}				



						/* *****************************************************************
						 * Add autosuggest if jQuery UI available
						 */

						/* 2016-09-22 
						   We put this last because LibGuides uses a version of jQuery UI that
						   throws a "TypeError: this.menu is undefined" error if we point
						   the "appendTo" to something that doesn't yet exist on the page. So
						   we add all the elements first, and then go back and attach the 
						   autosuggest (if jQuery UI is detected)					   
						 */

						// See if autocomplete is available and attach the function
						if ( typeof($.fn.autocomplete) !== "undefined" ) {

							$( searchField ).autocomplete({
								source: function( request, response ) {
									$.ajax({
										url: discoveryCustom.url + "/metadata/suggest/suggest", /* TODO: what is auto complete data url for primo? */
										dataType: "jsonp",
										data: {
											type_strict: 'should',
											all_types: 'true',
											prefix: request.term
										},
										success: function( data ) {
											response( $.map(data.result,function( item ) {
												return {
												label: item.name,
												value: item.name
												};
											}));
										}
									});
								},
								minLength: 2,
								delay: 300,
								appendTo: $(myAutosuggest)
							});

							console.log("DISCOVERY: jQuery ui AVAILABLE, autosuggest ENABLED for: #" + $(this).attr("id"));

						} else {
							console.log("DISCOVERY: jQuery ui NOT available, autosuggest NOT enabled for: #" + $(this).attr("id"));
						}	

						/* 
						 * AND WE'RE DONE!
						 ***************************************************************** */
					});
					/* 
					 * END this.each
					 ***************************************************************** */	

				};
				/* 
				 * END $.fn.discoverySearchWidget 
				 ***************************************************************** */	

			}( jQuery ));
			/* 
			 * END function( $ )
			 ***************************************************************** */			

			/* *****************************************************************
			 * EXECUTE: This is what we call when document is ready
			 */

			$(".discovery-search-widget").discoverySearchWidget();
			cssCheck();

			/* 
			 * END EXECUTE
			 ***************************************************************** */
		});
		/* 
		 * END document ready 
		 ***************************************************************** */
	} else {

		/* *****************************************************************
		 * jQuery Not Detected: Generate a SIMPLE search box using pure Javascript
		 * (data attributes for scoping ignored!)
		 */

		/* *****************************************************************
		 * If we don't detect jQuery on the page, create a generic search box using plain
		 * JavaScript. It will just be a form with a search box and button. No scoping 
		 * will be used.
		 *
		 * It could be rewritten so that the data-attributes are brought in without the need
		 * of jQuery, but so few examples exist on the University of St. Thomas Libraries sites 
		 * that this isn't worth development effort at this time. We only include it as an option
		 * just in case. If the effort for creating a pure JavaScript implementation is necessary,
		 * then it should really be brought into the script above. Of course, autocomplete wouldn't
		 * work without jQuery UI
		 */

		console.log("DISCOVERY: jQuery and jQuery UI required to generate dynamic discovery search box. Generic search box generated instead.");

		var divs = document.getElementsByClassName("discovery-search-widget");

		// Go through all .discovery-search-widgets and replace the inner HTML of the div
		for( var i = 0, len = divs.length; i < len; i++ ) {
			var sbID = divs[i].getAttribute("id");

			var nl = "\n";

			// This is the plain HTML that will be placed in the document
			var html = "<form class='discovery-search-box' action='" + discoveryCustom.url + "/primo-explore/search' " + nl
					 + "      target='_blank' enctype='application/x-www-form-urlencoded; charset=utf-8' onsubmit=\"searchPrimo('"+sbID+"')\" " + nl
					 + "      name='primoSearch' method='GET' id='"+sbID+"-form'>" + nl
					 + "   <label for='"+sbID+"-primoQueryTemp'>Search</label>" + nl
					 + "   <input placeholder='Search for articles, books, and more' class='discovery-search-field' " + nl
					 + "      autocomplete='off' name='primoQueryTemp' id='"+sbID+"-primoQueryTemp' type='search'> " + nl
					 + "   <input type='hidden' name='institution' value='"+ discoveryCustom.instituion +"'> " + nl
					 + "   <input type='hidden' name='vid' value='"+ discoveryCustom.vid +"'> " + nl
					 + "   <input type='hidden' name='tab' value='"+ discoveryCustom.tab +"'> " + nl
					 + "   <input type='hidden' name='search_scope' value='"+ discoveryCustom.search_scope +"'> " + nl
					 + "   <input type='hidden' name='mode' value='Basic'> " + nl
					 + "   <input type='hidden' name='displayMode' value='full'> " + nl
					 + "   <input type='hidden' name='bulkSize' value='"+ discoveryCustom.bulkSize +"'> " + nl
					 + "   <input type='hidden' name='highlight' value='true'> " + nl
					 + "   <input type='hidden' name='dum' value='true'> " + nl
					 + "   <input type='hidden' name='query' id='"+sbID+"-primoQuery'> " + nl
					 + "   <input type='hidden' name='displayField' value='all'> " + nl
					 + "   <input type='hidden' name='pcAvailabiltyMode' value='true'> " + nl
					 + "   <input id='go' title='Search' onclick=\"searchPrimo('"+sbID+"')\" alt='Search' class='discovery-search-button' value='Search' name='search' type='submit'> " + nl
					 + "</form>" + nl;

			divs[i].innerHTML = html;
		}

		cssCheck();
	}

})();


// from primo documentation, used by javascript only version
function searchPrimo(myId) {
	"use strict";

	document.getElementById(myId+"-primoQuery").value = "any,contains," + document.getElementById(myId+"-primoQueryTemp").value.replace(/[,]/g, " ");
	document.forms[myId+"-searchForm"].submit();
}

// from primo documentation, modified to allow multiple search boxes (used by code below if jQuery available)
function searchPrimoEnhanced(myId) {
	"use strict";
	
	console.log("myId: "+myId);

	// this here looks to see if we are doing a search on author or title (subject might also come here)
	var field = "any";
	var scope = document.getElementById(myId).getAttribute("data-scope");
	if ( scope !== null ) {
		if (scope.toLowerCase() === "author") { field = "creator"; }
		else if (scope.toLowerCase() === "title") { field = "title"; }
		else if (scope.toLowerCase() === "journal") { // perform a journal title search
			field = "any";
			document.getElementById(myId+"-primoQueryjournals").value = "any," + document.getElementById(myId+"-primoQueryTemp").value.replace(/[,]/g, " "); 
		} 
	} 

	document.getElementById(myId+"-primoQuery").value = field+",contains," + document.getElementById(myId+"-primoQueryTemp").value.replace(/[,]/g, " ");
	
	document.forms[myId+"-searchForm"].submit();
}
