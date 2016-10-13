/*
	Discovery Search Box Generator
	University of St. Thomas
	September 22, 2016
*/

								
/* *****************************************************************
 * CUSTOM VARIABLES
 */
 
var discoveryBaseURL = "https://stthomas.summon.serialssolutions.com"; //update for your instance
var ver = "1.0"; // just something to check for in the Browser Console, does nothing else

/* 
 * END CUSTOM VARIABLES
 * Yep, that's it. No other code changes are necessary in this .js file
 ***************************************************************** */
		
if (  typeof($) != "undefined" ) {
	$(document).ready( function(){
		
		console.log("DISCOVERY: Loading Discovery search box (ver "+ver+")...");

		(function( $ ) {
		
			$.fn.discoverySearchWidget = function() {
				
				return this.each( function() {
					
					var isTrue = function (d) {
						return (d !=  null && d !=  "" && d.toLowerCase() != "false" && d.toLowerCase() != "no");
					}
					
					var isDefault = function (d) {
						return (d.toLowerCase() === "default");
					}
					
					var isUniqueID = function (d) {
						return ( $("div#"+d).length < 2 );
					}
					
					var createHiddenField = function(name, value) {
						var f = document.createElement("input");
						$(f).attr({
							type: 'hidden',
							name: name,
							value: value
						});
						return f;
					}
					
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
						id: searchId+'-form',
						method: 'GET',
						name: 'summonSearch',
						target: '_blank',
						action: discoveryBaseURL + '/search',
						class: 'discovery-search-box'
					});
		
								
					/* *****************************************************************
					 * Create the search field
					 */
		
		
					var searchField = document.createElement("input");
					$(searchField).attr({
						id: searchId+'-searchfield',
						type: 'search',
						name: 's.q',
						autocomplete: 'off',
						class: 'discovery-search-field'
					});
					
					temp = $(this).attr("data-placeholder");
					if( isTrue(temp) ){
						
						// default placeholder text (if placeholder text is true
						var s = "Search for articles, books, and more"; 
						
						if ( !isDefault(temp) ) { s = temp;	}
						
						$(searchField).attr("placeholder", s);
					}
		
					// allow enter key to search (iOS, Android, Mac, PC, Firefox, Chrome, etc)
					$(searchField).keydown(function(event) {
						if (event.keyCode == 13) {
							$(this).trigger("keyup"); // make sure it gets sent!**
							this.form.submit();
							return false;
						 }
					});
					
					/* 
					   ** NOTE: if it is a TITLE or AUTHOR where the hidden field serves the purpose
					       of s.q then this field needs to update the s.q hidden field before submission
						   otherwise if a user selects "Stephen King" from auto complete, only "Step" will
						   be submitted. We must trigger the update of s.q before submission!
						   There may be ways to incorporate this in the actual submission if there
						   are other issues that crop up.
					   
					*/
											
					/* *****************************************************************
					 * Create the label for search field
					 */
		
					var searchLabel = document.createElement("label");
					$(searchLabel).attr("for", searchId+"-searchfield").html("Search Summon");			
		
		
					/* *****************************************************************
					 * Generate the hidden fields
					 */
		
		
					// we use an array
					var hiddenFields = [];
					
					// the basic hidden fields
					hiddenFields.push( createHiddenField("spellcheck","true") );
					hiddenFields.push( createHiddenField("keep_r","true") );
					hiddenFields.push( createHiddenField("utf8","?") );
		
					
					// title or author scoped search
					temp = $(this).attr("data-scope");
					if( isTrue(temp) ) {
						
						// "author" or "AUTHOR" to Author // "title" or "TITLE" to Title
						var scope = temp.charAt(0).toUpperCase() + temp.substr(1).toLowerCase(); 
						
						// create a hidden data field for s.q submission
						var dataField  = createHiddenField("s.q","");
						$(dataField).attr("id",searchId+"-datafield");
						
						// relabel the user's search field as it is now only for data entry
						$(searchField).attr("name", "sqInputOnly");
						$(searchField).attr("data-datafield",searchId+"-datafield");
						$(searchField).attr("data-scope",scope);

						$(searchField).on('keyup blur', function () {
							var d = "#"+$(this).attr("data-datafield");
							var s = $(this).attr("data-scope");
							$(d).val(  s+"Combined:("+$(this).val()+")" );
						} );
						
						hiddenFields.push( dataField );
					}
					
					// material/content type scoping
					// IF BOOK|MUSIC|FILM|other
					temp = $(this).attr("data-scope-content-type");
					if( isTrue(temp) ) {
						
						var type = $(this).attr("data-scope-content-type"); // not normalized (lower case)
						
						if ( type === "BOOK" || type === "BOOKS" ) {
							hiddenFields.push( createHiddenField("s.fvf[]","ContentType,Book / eBook") );
							hiddenFields.push( createHiddenField("s.fvf[]","ContentType,Book Chapter") );
						} else if ( type === "MUSIC" ) {
							// Future expansion
						} else if ( type === "FILM" || type === "FILMS" ) {
							hiddenFields.push( createHiddenField("s.fvf[]","ContentType,Video Recording") );
							hiddenFields.push( createHiddenField("s.fvf[]","ContentType,Streaming Video") );
						} else {
							var myTypes = (type.trim()).split(','); // we trim in case it gets messy " param,aasdf,asdf "
							for (var i = 0, len = myTypes.length; i < len; i++) {
								hiddenFields.push( createHiddenField("s.fvf[]", "ContentType,"+myTypes[i].trim() ) ); // we trim for asdf, asdf , asdf
							}

						}
						
					}
		
					// subject term scoping
					temp = $(this).attr("data-scope-subj-terms");
					if( isTrue(temp) ) {
						
						var type = $(this).attr("data-scope-subj-terms"); // not normalized (lower case)
						
						hiddenFields.push( createHiddenField("s.fvgf[]", "SubjectTerms,or,"+type.trim() ));
						
					}

					// discipline scoping
					temp = $(this).attr("data-scope-discipline");
					if( isTrue(temp) ) {
						
						var type = $(this).attr("data-scope-discipline"); // not normalized (lower case)
						
						var myTypes = (type.trim()).split(','); // we trim in case it gets messy " param,aasdf,asdf "
						for (var i = 0, len = myTypes.length; i < len; i++) {
							hiddenFields.push( createHiddenField("s.fvf[]", "Discipline,"+myTypes[i].trim() ) ); // we trim for asdf, asdf , asdf
						}
						
					}
					
					// language scoping
					temp = $(this).attr("data-scope-language");
					if( isTrue(temp) ) {
						
						var type = $(this).attr("data-scope-language"); // not normalized (lower case)
						
						var myTypes = (type.trim()).split(','); // we trim in case it gets messy " param,aasdf,asdf "
						for (var i = 0, len = myTypes.length; i < len; i++) {
							hiddenFields.push( createHiddenField("s.fvf[]", "Language,"+myTypes[i].trim() ) ); // we trim for asdf, asdf , asdf
						}
						
					}

					// date scoping
					temp = $(this).attr("data-scope-date");
					if( isTrue(temp) ) {
						var type = $(this).attr("data-scope-date"); // not normalized (lower case)
						hiddenFields.push( createHiddenField("s.rf", "PublicationDate,"+type) );
					}

					// full text scoping
					temp = $(this).attr("data-scope-fulltext");
					if( isTrue(temp) ) {
						hiddenFields.push( createHiddenField("s.fvf[]", "IsFullText,true") );
					}

					// scholarly scoping
					temp = $(this).attr("data-scope-scholarly");
					if( isTrue(temp) ) {
						hiddenFields.push( createHiddenField("s.fvf[]", "IsScholarly,true") );
					}
					
					// full text scoping
					temp = $(this).attr("data-scope-local");
					if( isTrue(temp) ) {
						hiddenFields.push( createHiddenField("s.fq[]", "SourceType:(\"Library Catalog\")") );
					}
		
					/* *****************************************************************
					 * Generate the search button
					 */	
					 
					var searchButton = document.createElement("input");
					$(searchButton).attr({
						type: 'submit',
						name: 'search',
						value: 'Search Summon',
						class: 'discovery-search-button'
					});
		
		
					/* *****************************************************************
					 * Create the tagline
					 */
		
		
					var searchTagline = null;
					temp = $(this).attr("data-tagline"); // grab the data attribute
					if( isTrue(temp) ){
						
						// default tagline text (if data-tagline is "default")
						var s = "Summon searches across the library collections"; 
						
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
						$(a).attr("href",discoveryBaseURL + "/#!/advanced");
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
					if( searchTagline != null ) { $(this).prepend(searchTagline); }; // before form
					if( searchAdvanced != null ) { $(this).append(searchAdvanced); }; // after form
					if( myAutosuggest != null ) { $(this).append(myAutosuggest); }; // after form
					
					
					
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
					if ( typeof($.fn.autocomplete) != "undefined" ) {
							
						$( searchField ).autocomplete({
							source: function( request, response ) {
								$.ajax({
									url: discoveryBaseURL + "/metadata/suggest/suggest",
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
											}
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
		var html = "<form class='discovery-search-box' action='" + discoveryBaseURL + "/search' target='_blank' "
		         + "      name='summonSearch' method='GET' id='"+sbID+"-form'>" + nl
				 + "   <label for='"+sbID+"-searchfield'>Search Summon</label>" + nl
				 + "   <input placeholder='Search for articles, books, and more' class='discovery-search-field' "
				 + "      autocomplete='off' name='s.q' id='"+sbID+"-searchfield' type='search'> " + nl
				 + "   <input value='true' name='spellcheck' type='hidden'> " + nl
				 + "   <input value='true' name='keep_r' type='hidden'> " + nl
				 + "   <input value='?' name='utf8' type='hidden'> " + nl
				 + "   <input class='discovery-search-button' value='Search Summon' name='search' type='submit'> " + nl
				 + "</form>" + nl;
		
		divs[i].innerHTML = html;
	}
}