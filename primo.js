/*
	Discovery Loader Widget (Primo New UI or Primo VE)
	University of St. Thomas Libraries
	0.1.1-20200807

	Full Code and Documentation available at:
	https://github.com/USTLibraries/Discovery-Loader-Widget

	Primo Search Box Documentation:
	https://knowledge.exlibrisgroup.com/Primo/Product_Documentation/New_Primo_User_Interface/New_UI_Customization_-_Best_Practices#Creating_a_Search_Box_With_Deep_Links_to_the_New_UI


*/


/*
****************************************************************************
* Code for Discovery-Loader-Widget
*
* The code below can be minimized separately from the code above
*/

(function (customSettings) {
	"use strict";

	/*
    ***************************************************************************
	* HOUSEKEEPING
	*/

	var version = "0.1.2-20200603"; // Just something to check for in the Browser Console
	                                 // Does nothing else except keep you from pulling your hair out when you wonder if the code changes
									 // you made are loaded or cached or not deployed or as an indicator that you really are going crazy
								 	 // and should take a break

    // Copy this out, change the variable name of the copy from customTemplate to 
    // the discovery_widget_loader_custom_settings variable in discovery-loader.js
    // customTemplate itself is never used except to check to make sure it was overriden.
    // Wondering what some of these values should be?
    // Do a search in Primo and look at the query string in the URL of the results page
    var customTemplate = {
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

    const discoveryCustom = customSettings;
    const discoPath = (discoveryCustom.primo_ve) ? "discovery" : "primo-explore";

	var code    = "github.com/USTLibraries/Discovery-Loader-Widget";
	var handle  = "DISCOVERY";
	var name    = "Discovery Loader Widget (Primo New UI or Primo VE)";
	var silent  = false;

		/* =====================================================================
		debug()

		If not silenced, outputs text pased to it to console.log

		Need a line number? In your code use debug(yourmessage + " - Line:"+ (new Error()).lineNumber );

		This function has a companion variable: silent
	*/
	var debug = function( text ) {

		// as long as we aren't silenced (silent === false)...
		if( !silent ) {
			var d = new Date();
			var ts = d.getHours() +":"+ d.getMinutes() +":"+ d.getSeconds() +"."+ d.getMilliseconds();
			console.log(handle+" ["+ts+"] : " + text);
		}
	};

	var cssCheck = function() {

		// load in the css, but check first to make sure it isn't already loaded
		// we do this rather than check for the file because the search box css could have been merged into another file, so we check css properties instead
		// just so long as ".discovery-search-widget label { left: -10022px; }" doesn't change!
		var elem = document.getElementsByClassName("discovery-search-widget");

		if (elem.length > 0) {

			var myTempStyle = elem[0].getElementsByTagName("label")[0];
			var theCSSprop = window.getComputedStyle(myTempStyle,null).getPropertyValue("left");

			if ( theCSSprop !== "-10022px" ) {
				debug("Adding css: " + discoveryCustom.css );
				var css=document.createElement('link');
				css.type='text/css';
				css.rel='stylesheet';
				css.href= discoveryCustom.css;
				document.getElementsByTagName('head')[0].appendChild(css);
			} else {
				debug("Discovery css detected");
			}
		}

	};

    debug("Loaded "+name+" ("+code+") [ver"+version+"]");
    debug("Primo VE: "+ customSettings.primo_ve);
    debug("Path: " + discoPath);

    // Check to make sure the custom settings are defined.
    if (discoveryCustom !== null && discoveryCustom.instituion !== customTemplate.instituion) {

        // check for jQuery, if it does not exist, just place a plain javascripted search box (no scoping)
        // this entire script could be re-written so as to not use jQuery, but it serves my purpose
        if (typeof ($) !== "undefined") {
            $(document).ready(function () {

                (function ($) {

                    /* ========================================================================
                     * ************************************************************************
                     *  $.fn.discoverySearchWidget
                     * ************************************************************************
                     */

                    $.fn.discoverySearchWidget = function () {

                        return this.each(function () {

                            var isTrue = function (d) {
                                return (typeof (d) !== "undefined" && d !== null && d !== "" && d.toLowerCase() !== "false" && d.toLowerCase() !== "no");
                            };

                            var isDefault = function (d) {
                                return (d.toLowerCase() === "default");
                            };

                            var isUniqueID = function (d) {
                                return ($("div#" + d).length < 2);
                            };

                            var createHiddenField = function (name, value, pAttr) {
                                var f = document.createElement("input");
                                $(f).attr({
                                    type: 'hidden',
                                    name: name,
                                    value: value
                                });
                                if (typeof (pAttr) !== "undefined") {
                                    $(f).attr(pAttr);
                                }
                                return f;
                            };

                            // get the div's ID
                            var searchId = $(this).attr("id");

                            // make sure the ID on the element is unique, change it if not
                            if (!isTrue(searchId) || !isUniqueID(searchId)) {
                                debug("Search Widget with no-ID/non-unique ID detected (" + searchId + ")... assigning a unique ID");
                                if (!isTrue(searchId)) { searchId = "discoverySearch"; }

                                // select a new id
                                var newId = "";
                                do {
                                    newId = searchId + "_" + Math.floor((Math.random() * 1000) + 1);
                                } while (!isUniqueID(newId));

                                // assign the new id
                                searchId = newId;
                                $(this).attr("id", searchId);

                                debug("Search Widget id reassigned: " + searchId);

                            }

                            var temp = "";	// a holder when we evaluate data- attribute defaults


                            /* *****************************************************************
                             * Create the form element
                             */

                            let resultTarget = discoveryCustom.default_target;
                            temp = $(this).attr("data-target");
                            debug("Target: "+temp);
                            if (isTrue(temp) && !isDefault(temp)) {
                                resultTarget = temp;
                                debug("Target set: "+resultTarget);
                            }

                            var searchForm = document.createElement("form");
                            $(searchForm).attr({
                                id: searchId + '-searchForm',
                                method: 'GET',
                                name: 'primoSearch',
                                target: resultTarget,
                                action: discoveryCustom.url + '/' + discoPath + '/search',
                                class: 'discovery-search-box',
                                enctype: 'application/x-www-form-urlencoded; charset=utf-8',
                                onsubmit: 'searchPrimoEnhanced(\'' + searchId + '\', \''+discoveryCustom.primo_ve+'\')'
                            });


                            /* *****************************************************************
                             * Create the search field
                             */


                            var searchField = document.createElement("input");
                            $(searchField).attr({
                                id: searchId + '-primoQueryTemp',
                                type: 'search',
                                name: 'primoQueryTemp',
                                autocomplete: 'off',
                                class: 'discovery-search-field'
                            });

                            temp = $(this).attr("data-placeholder");
                            if (isTrue(temp)) {

                                // default placeholder text (if placeholder text is true
                                var s = discoveryCustom.default_placeholder;

                                if (!isDefault(temp)) { s = temp; }

                                $(searchField).attr("placeholder", s);
                            }

                            // allow enter key to search (iOS, Android, Mac, PC, Firefox, Chrome, etc)
                            $(searchField).keydown(function (event) {
                                if (event.keyCode === 13) {
                                    $(this).trigger("keyup"); // make sure it gets sent!**
                                    searchPrimoEnhanced(searchId, discoveryCustom.primo_ve); // this.form.submit();
                                    return false;
                                }
                            });

                            /* *****************************************************************
                             * Create the label for search field
                             */

                            var searchLabel = document.createElement("label");
                            $(searchLabel).attr("for", searchId + "-primoQueryTemp").html(discoveryCustom.default_label);


                            /* *****************************************************************
                             * Generate the hidden fields
                             */


                            // we use an array
                            var hiddenFields = [];

                            // the custom hidden fields
                            hiddenFields.push(createHiddenField("institution", discoveryCustom.instituion));
                            hiddenFields.push(createHiddenField("vid", discoveryCustom.vid));
                            hiddenFields.push(createHiddenField("tab", discoveryCustom.tab));
                            hiddenFields.push(createHiddenField("search_scope", discoveryCustom.search_scope));
                            hiddenFields.push(createHiddenField("bulkSize", discoveryCustom.bulkSize));

                            // the fixed hidden fields
                            hiddenFields.push(createHiddenField("mode", "Basic"));
                            hiddenFields.push(createHiddenField("displayMode", "full"));
                            hiddenFields.push(createHiddenField("highlight", "true"));
                            hiddenFields.push(createHiddenField("dum", "true"));
                            hiddenFields.push(createHiddenField("query", "", { id: searchId + "-primoQuery" }));
                            hiddenFields.push(createHiddenField("displayField", "all"));
                            hiddenFields.push(createHiddenField("pcAvailabiltyMode", "true"));

                            // material/content type scoping
                            // 20190820 - clk - added ability to search multiple types
                            // IF BOOK|MUSIC|FILM|other
                            temp = $(this).attr("data-scope-content-type");
                            if (isTrue(temp)) {

                                temp = temp.toLowerCase();

                                var myTypes = (temp.trim()).split(','); // we trim in case it gets messy " param,aasdf,asdf "
                                myTypes.forEach(function (item) {

                                    item = item.trim();

                                    var fv = "";

                                    switch (item) {
                                        case "book":
                                            fv = discoveryCustom.facet_books;
                                            break;
                                        case "books":
                                            fv = discoveryCustom.facet_books;
                                            break;
                                        case "audio":
                                            fv = discoveryCustom.facet_audio;
                                            break;
                                        case "video":
                                            fv = discoveryCustom.facet_video;
                                            break;
                                        case "music":
                                            fv = discoveryCustom.facet_music;
                                            break;
                                        case "media":
                                            fv = discoveryCustom.facet_media;
                                            break;
                                        default:
                                            fv = item;
                                    }

                                    hiddenFields.push(createHiddenField("mfacet", "rtype,include," + fv + ",1"));

                                });

                            }

                            // subject scoping
                            temp = $(this).attr("data-scope-subj-terms");
                            if (isTrue(temp)) {

                                temp = temp.toLowerCase();

                                var myTypes = (temp.trim()).split(','); // we trim in case it gets messy " param,aasdf,asdf "
                                for (var i = 0, len = myTypes.length; i < len; i++) {
                                    hiddenFields.push(createHiddenField("mfacet", "topic,include," + myTypes[i].trim())); // we trim for asdf, asdf , asdf
                                }

                            }

                            // discipline scoping
                            // facet=topic,include,philosophy,history
                            temp = $(this).attr("data-scope-discipline");
                            if (isTrue(temp)) {

                                temp = temp.toLowerCase();

                                var myTypes = (temp.trim()).split(','); // we trim in case it gets messy " param,aasdf,asdf "
                                for (var i = 0, len = myTypes.length; i < len; i++) {
                                    hiddenFields.push(createHiddenField("mfacet", "topic,include," + myTypes[i].trim())); // we trim for asdf, asdf , asdf
                                }

                            }

                            // language scoping
                            // facet=lang,exact,fre
                            temp = $(this).attr("data-scope-language");
                            if (isTrue(temp)) {

                                temp = temp.toLowerCase();

                                var myTypes = (temp.trim()).split(','); // we trim in case it gets messy " param,aasdf,asdf "
                                for (var i = 0, len = myTypes.length; i < len; i++) {
                                    hiddenFields.push(createHiddenField("mfacet", "lang,exact," + myTypes[i].trim())); // we trim for asdf, asdf , asdf
                                }

                            }

                            // date scoping
                            // facet=searchcreationdate,include,1700|,|2017
                            temp = $(this).attr("data-scope-date");
                            if (isTrue(temp)) {
                                temp = temp.toLowerCase().replace(/-/g, ""); // remove "-" in dates as they were used in summon

                                var myTypes = (temp.trim()).split(':');

                                if (myTypes[0] === "") { myTypes[0] = 0; }
                                if (myTypes[1] === "") { myTypes[1] = (new Date()).getFullYear(); }

                                var v = "searchcreationdate,include," + myTypes[0].substring(0, 4) + "|,|" + myTypes[1].substring(0, 4);
                                // Primo only takes 4 digit year as facet

                                hiddenFields.push(createHiddenField("mfacet", v));
                            }

                            // full text scoping
                            //&facet=tlevel,include,online_resources
                            temp = $(this).attr("data-scope-fulltext");
                            if (isTrue(temp)) {
                                hiddenFields.push(createHiddenField("mfacet", "tlevel,include,online_resources,1"));
                            }


                            // available locally
                            // facet=local1,include,My University Library
                            temp = $(this).attr("data-scope-local");
                            if (isTrue(temp)) {
                                hiddenFields.push(createHiddenField("mfacet", discoveryCustom.localParam + ",include," + discoveryCustom.localDesc));
                            }


                            // scholarly scoping
                            // facet=tlevel,include,peer_reviewed
                            temp = $(this).attr("data-scope-scholarly");
                            if (isTrue(temp)) {
                                hiddenFields.push(createHiddenField("mfacet", "tlevel,include,peer_reviewed"));
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
                                onclick: 'searchPrimoEnhanced(\'' + searchId + '\', \''+discoveryCustom.primo_ve+'\')',
                                alt: 'Search'
                            });

                            // set the custom color of the button if listed in custom rather than css
                            if (discoveryCustom.button_colors !== "") {
                                var c = discoveryCustom.button_colors.split(",");
                                if (c.length > 1) {
                                    $(searchButton).css({
                                        "background-color": c[0],
                                        color: c[1]
                                    });
                                }
                            }

                            // https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
                            // add a small width class for magnifying glass color


                            /* *****************************************************************
                             * Create the tagline
                             */


                            var searchTagline = null;
                            temp = $(this).attr("data-tagline"); // grab the data attribute
                            if (isTrue(temp)) {

                                // default tagline text (if data-tagline is "default")
                                var s = discoveryCustom.default_tagline;

                                // Use default or do we have something in data-tagline attribute?
                                if (!isDefault(temp)) { s = temp; }

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
                            if (isTrue(temp)) {

                                // default advanced search link text (if data-advanced is "default")
                                var s = discoveryCustom.default_advanced;

                                // Use default or do we have something in data-advanced attribute?
                                if (!isDefault(temp)) { s = temp; }

                                // Create the advanced search HTML tag
                                searchAdvanced = document.createElement("li");

                                var a = document.createElement("a");
                                $(a).attr("href", discoveryCustom.url + "/"+discoPath+"/search?mode=advanced&vid=" + discoveryCustom.vid);
                                $(a).html(s);
                                $(a).appendTo(searchAdvanced);
                            }

                            /* *****************************************************************
                             * Create the account login link
                             */

                            var myAccountLink = null;
                            temp = $(this).attr("data-login"); // grab the data attribute
                            if (isTrue(temp)) {

                                // default advanced search link text (if data-advanced is "default")
                                var s = discoveryCustom.default_login;

                                // Use default or do we have something in data-advanced attribute?
                                if (!isDefault(temp)) { s = temp; }

                                // Create the advanced search HTML tag
                                myAccountLink = document.createElement("li");

                                var a = document.createElement("a");
                                $(a).attr("href", discoveryCustom.url + "/"+discoPath+"/account?section=overview&vid=" + discoveryCustom.vid);
                                $(a).html(s);
                                $(a).appendTo(myAccountLink);
                            }

                            /* *****************************************************************
                             * Create the custom link
                             */

                            var myCustomLink = null;
                            temp = $(this).attr("data-custom-link"); // grab the data attribute
                            if (isTrue(temp)) {

                                // default custom-link search link text (if data-custom-link is "default")
                                var s = discoveryCustom.custom_link_text;

                                // Use default or do we have something in data-custom-link attribute?
                                if (!isDefault(temp)) { s = temp; }

                                // default custom-link-url, do we use default or do we have something else?
                                var u = discoveryCustom.custom_link_url;
                                temp = $(this).attr("data-custom-link-url");
                                if (isTrue(temp)) { u = temp; }

                                // Create the custom link HTML tag
                                myCustomLink = document.createElement("li");

                                var a = document.createElement("a");
                                $(a).attr("href", u);
                                $(a).html(s);
                                $(a).appendTo(myCustomLink);
                            }

                            /* *****************************************************************
                             * Create the discovery links for Advanced Search and My Account
                             * These show up under the search box
                             */

                            var discoveryLinks = null;
                            if (myAccountLink !== null || searchAdvanced !== null || myCustomLink !== null) {

                                discoveryLinks = document.createElement("ul");
                                $(discoveryLinks).addClass("discovery-links");

                                if (searchAdvanced !== null) { $(searchAdvanced).appendTo(discoveryLinks); } // add Advanced link
                                if (myAccountLink !== null) { $(myAccountLink).appendTo(discoveryLinks); } // add Account link
                                if (myCustomLink !== null) { $(myCustomLink).appendTo(discoveryLinks); } // add Custom link

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
                                id: searchId + '-autosuggest',
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
                            if (searchTagline !== null) { $(this).prepend(searchTagline); } // before form
                            if (discoveryLinks !== null) { $(this).append(discoveryLinks); } // after form
                            if (myAutosuggest !== null) { $(this).append(myAutosuggest); } // after form

                            temp = $(this).attr("data-scope");
                            if (isTrue(temp)) {
                                if (temp.toLowerCase() === "journal") {
                                    debug("Morphing [" + searchId + "] into a Journal Title search box");
                                    // if it is a journal box, modify it.... just easier to do it all here (just takes a millisecond)
                                    $(searchForm).find("input[name='search_scope']").detach(); // remove the scope - search_scope
                                    $(searchForm).find("input[name='mode']").detach();// remove the mode
                                    // TODO, MAYBE: there's a few more to detach
                                    $(searchForm).find("input[name='tab']").attr("value", "jsearch_slot"); // switch tab over to journal
                                    $(searchForm).attr("action", discoveryCustom.url + "/"+discoPath+"/jsearch");
                                    $(searchForm).append(createHiddenField("journals", "", { id: searchId + "-primoQueryjournals" }));// add journals
                                } else if (temp.toLowerCase().substr(0, 6) === "course") {
                                    debug("Morphing [" + searchId + "] into a Course Reserve search box");
                                    let scopeCode = discoveryCustom.primo_ve ? "CourseReserves" : discoveryCustom.search_scope + "_course";
                                    $(searchForm).find("input[name='search_scope']").attr("value", scopeCode);
                                    let tabCode = discoveryCustom.primo_ve ? "CourseReserves" : "course_tab";
                                    $(searchForm).find("input[name='tab']").attr("value", tabCode);
                                }
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
                            if (typeof ($.fn.autocomplete) !== "undefined") {

                                $(searchField).autocomplete({
                                    source: function (request, response) {
                                        $.ajax({
                                            url: discoveryCustom.url + "/metadata/suggest/suggest", /* TODO: what is auto complete data url for primo? */
                                            dataType: "jsonp",
                                            data: {
                                                type_strict: 'should',
                                                all_types: 'true',
                                                prefix: request.term
                                            },
                                            success: function (data) {
                                                response($.map(data.result, function (item) {
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

                                debug("jQuery ui AVAILABLE, autosuggest ENABLED for: #" + $(this).attr("id"));

                            } else {
                                debug("jQuery ui NOT available, autosuggest NOT enabled for: #" + $(this).attr("id"));
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


                    /* ========================================================================
                     * ************************************************************************
                     *  $.fn.discoverySearchCheckWidth
                     * ************************************************************************
                     *
                     * This calculates the width of the search box
                     * If the width is too narrow we want to remove the search icon
                     * from the search field and make the search button smaller so
                     * there is more room inside the search box
                     *
                     */

                    $.fn.discoverySearchCheckWidth = function () {

                        return this.each(function () {

                            var minWidthPx = discoveryCustom.narrow_max; // what is the minimum width before switching to narrow styles?

                            var cWidth = $(this).outerWidth(true); // get the outer width of the search box

                            var wOkay = true;
                            if (cWidth < minWidthPx) { wOkay = false; } // check the width

                            // for testing, place the width in a data attribute
                            $(this).attr("data-calc-width", "Needed: " + minWidthPx + " | Current: " + cWidth + " | Enough Room?: " + wOkay);

                            if (wOkay) { // wide
                                $(this).removeClass("discovery-narrow-width").addClass("discovery-wide-width");
                            } else { // narrow
                                $(this).removeClass("discovery-wide-width").addClass("discovery-narrow-width");
                            }


                        });
                        /*
                         * END this.each
                         ***************************************************************** */

                    };
                    /*
                     * END $.fn.discoverySearchCheckWidth
                     ***************************************************************** */


                }(jQuery));
                /*
                 * END function( $ )
                 ***************************************************************** */

                /* *****************************************************************
                 * EXECUTE: This is what we call when document is ready
                 */

                // capture the execution start time
                var initStart = new Date();

                debug("Starting...");

                // call the function that goes through the page and transforms all the div.discovery-search-widget tags
                $("div.discovery-search-widget").discoverySearchWidget();

                // now that we've transformed the divs, load the style sheet if it isn't already
                cssCheck();

                // call the function that goes through the pages and calculates the width of each search box to see if they are narrow
                $("div.discovery-search-widget").discoverySearchCheckWidth();

                // and check width every time window is resized
                $(window).resize(function () {
                    $("div.discovery-search-widget").discoverySearchCheckWidth();
                });

                // calculate the milliseconds it took to transform all <div> tags
                var diff = Math.abs((new Date()) - initStart);

                // put it in the console.log for devs to check execution time
                debug("Done. Completed in " + diff + " milliseconds");

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

            debug("jQuery and jQuery UI required to generate dynamic discovery search box. Generic search box generated instead.");
            debug("Starting...");

            // capture the execution start time
            var initStart = new Date();

            var divs = document.getElementsByClassName("discovery-search-widget");

            // Go through all .discovery-search-widget tags and replace the inner HTML of the div
            for (var i = 0, len = divs.length; i < len; i++) {
                var sbID = divs[i].getAttribute("id") + "-js" + i; // number to make unique

                // This is the plain HTML that will be placed in the document
                var html = " \
<form class='discovery-search-box' action='" + discoveryCustom.url + "/" + discoPath + "/search' \n \
      target='_blank' enctype='application/x-www-form-urlencoded; charset=utf-8' onsubmit=\"searchPrimo('"+ sbID + "')\" \
      name='primoSearch' method='GET' id='"+ sbID + "-searchform'> \
    <label for='"+ sbID + "-primoQueryTemp'>" + discoveryCustom.default_label + "</label> \
    <input placeholder='"+ discoveryCustom.default_placeholder + "' class='discovery-search-field' \
       autocomplete='off' name='primoQueryTemp' id='"+ sbID + "-primoQueryTemp' type='search'> \
    <input type='hidden' name='institution' value='"+ discoveryCustom.instituion + "'> \
    <input type='hidden' name='vid' value='"+ discoveryCustom.vid + "'> \
    <input type='hidden' name='tab' value='"+ discoveryCustom.tab + "'> \
    <input type='hidden' name='search_scope' value='"+ discoveryCustom.search_scope + "'> \
    <input type='hidden' name='mode' value='Basic'> \
    <input type='hidden' name='displayMode' value='full'> \
    <input type='hidden' name='bulkSize' value='"+ discoveryCustom.bulkSize + "'> \
    <input type='hidden' name='highlight' value='true'> \
    <input type='hidden' name='dum' value='true'> \
    <input type='hidden' name='query' id='"+ sbID + "-primoQuery'> \
    <input type='hidden' name='displayField' value='all'> \
    <input type='hidden' name='pcAvailabiltyMode' value='true'> \
    <input id='go' title='"+ discoveryCustom.default_button + "' onclick=\"searchPrimo('" + sbID + "')\" \
           alt='"+ discoveryCustom.default_button + "' class='discovery-search-button' \
           value='"+ discoveryCustom.default_button + "' name='search' type='submit'> \
</form> \
		";

                divs[i].innerHTML = html;

            }

            cssCheck();

            // calculate the milliseconds it took to transform all <div> tags
            var diff = Math.abs((new Date()) - initStart);

            // put it in the console.log for devs
            debug("Done. Completed in " + diff + " milliseconds");

        }

    } else {
        debug("discovery_widget_loader_custom_settings not properly set in discovery-loader.js");
    }

})(discovery_widget_loader_custom_settings);


// from primo documentation, used by javascript only version
function searchPrimo(myId) {
	"use strict";

	document.getElementById(myId+"-primoQuery").value = "any,contains," + document.getElementById(myId+"-primoQueryTemp").value.replace(/[,]/g, " ");
	document.forms[myId+"-searchform"].submit();
}

// from primo documentation, modified to allow multiple search boxes (used by code below if jQuery available)
function searchPrimoEnhanced(myId, ve) {
	"use strict";

	// this here looks to see if we are doing a search on author, title, journal, or course field
	var field = "any";
	var scope = document.getElementById(myId).getAttribute("data-scope");
	if ( scope !== null ) {

		// set the field of query=[field],contains,[keywords]
        switch (scope.toLowerCase()) {
			case "author":
				field = "creator";
				break;

			case "title":
				field = "title";
				break;

			case "journal":
				field = "any";
				// journal search has an extra field: journals
				var tval = document.getElementById(myId+"-primoQueryTemp").value.replace(/[,]/g, " ");
				document.getElementById(myId+"-primoQueryjournals").value = "any," + tval;
				break;

            /* Naming got better in VE */
			case "course_name":
                field = ve ? "course_name" : "crsname";
				break;

			case "course_instr":
            case "course_instructor":
				field = ve ? "course_instructor" : "crsinstrc";
				break;

			case "course_id":
            case "course_code":
                field = ve ? "course_code" : "crsid";
				break;

			case "course_dept":
            case "course_department":
                field = ve ? "course_department" : "crsdept";
				break;

			// default is already "any"
		}
	}

	document.getElementById(myId+"-primoQuery").value = field+",contains," + document.getElementById(myId+"-primoQueryTemp").value.replace(/[,]/g, " ");

	document.forms[myId+"-searchForm"].submit();
}
