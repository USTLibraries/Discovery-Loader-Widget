/*
	Discovery Loader Widget (Primo New UI or Primo VE)
	University of St. Thomas Libraries

	Full Code and Documentation available at:
	https://github.com/USTLibraries/Discovery-Loader-Widget

    Working Examples At:
    https://static.assets.libraries.stthomas.edu/widget/discovery/examples/

	Primo Search Box Documentation:
	https://knowledge.exlibrisgroup.com/Primo/Product_Documentation/New_Primo_User_Interface/New_UI_Customization_-_Best_Practices#Creating_a_Search_Box_With_Deep_Links_to_the_New_UI


*/

(function () {
	'use strict';

	/*
    ***************************************************************************
	* HOUSEKEEPING
	*/

	const info = {
        version: '0.2.1-20230217', // Just something to check for in the Browser Console
	    code: 'github.com/USTLibraries/Discovery-Loader-Widget',
	    handle: 'DISCOVERY',
	    name: 'Discovery Loader Widget (Primo New UI or Primo VE)',
	    silent: false,
    };

    // Update ! - Custom CSS File Location
    const cssFile = 'https://static.assets.libraries.stthomas.edu/widget/discovery/primo.css';

    const load = function (options, search) {
        /* ********************************************************************
         * CUSTOM CONFIG - modify configSettings and configAttributes
         * Only use defaultSettings and defaultAttributes as examples of available properties */

        /* Required ! - update to your settings */
        const configSettings = {
            primo_ve: true,
            url: 'https://librarysearch.stthomas.edu',
            institution: '01CLIC_STTHOMAS',
            vid: '01CLIC_STTHOMAS:MNPALS',
            tab: 'UST_MNPALS',
            search_scope: 'UST_MNPALS_PROFILE',
        };

        /* Optional ! - update to your settings */
        const configAttributes = {
            'data-target': '_parent',
            'data-advanced-text': 'More search options',
            'data-login-text': 'My Account',
            'data-custom-link-text': 'Feedback',
            'data-custom-link-url': 'https://library.stthomas.edu/ask/',
        };

        /* ********************************************************************
         * DEFAULTS - modify above, not below */

        /* These are default settings which will be over-ridden by configSettings 
         * ! Update configSettings, don't update here ! */
        const defaultSettings = {
            primo_ve: false,
            url: 'https://myprimo.myinstitution.example.edu', // base URL to your primo instance

            // primo values - many will be found in your query string or in Back Office
            instituion: 'YOUR_INSTITUTION', // Even for VE, put this in
            vid: 'YOURVIEW', // from vid parameter in your search query url For VE it will be like INST:VIEW
            tab: 'default_tab',
            search_scope: 'yourscope',

            // bulksize
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
        };


        /* These are default settings which will be over-ridden by configAttributes 
         * ! Update configAttributes, don't update here ! */
        const defaultAttributes = {
            'data-target': '_blank',
            'data-tagline': '',
            'data-tagline-text': 'Search the library catalog',
            'data-placeholder': 'true',
            'data-placeholder-text': 'Find books, articles, films, and more',
            'data-placeholder-short': 'Keywords',
            'data-advanced': '',
            'data-advanced-text': 'Advanced Search',
            'data-login': '',
            'data-login-text': 'Login',
            'data-button': 'Search', // Text for search button
            'data-label': 'Search', // Accessible label for screen readers
            'data-scope-content-type': '',
            'data-scope-subj-terms': '',
            'data-scope-discipline': '',
            'data-scope-language': '',
            'data-scope-date': '',
            'data-scope-fulltext': '',
            'data-scope-local': '',
            'data-scope-scholarly': '',
            'data-scope': '',
            'data-custom-link': '',
            'data-custom-link-url': 'https://www.example.com/feedback',
            'data-custom-link-text': 'Feedback',
        };

        /* searchby is only used in the Vue.js version */
        if (!('searchby' in options) || !('attributes' in options.searchby)) {
            options.searchby = {attributes: {}};
        }

        console.log("optionsAttributes", options.attributes);
        /* Combine attributes and settings with passed attributes and settings */
        const attr = Object.assign(defaultAttributes, configAttributes, options.attributes, options.searchby.attributes);
        const settings = Object.assign(defaultSettings, configSettings, options.settings); // supplied options overwrite configSettings, which overwrite default

        /* Build the form */
        build(attr, settings, search); // the search parameter is not used in Vue.js version
    };

    const thisUtilCreateHiddenField = function(name, value) {
        const hiddenField = document.createElement('input');
        hiddenField.setAttribute('type', 'hidden');
        hiddenField.setAttribute('name', name);
        hiddenField.setAttribute('value', value);
        return hiddenField;
    };
    
    const create = function() {
        
        const isUniqueID = function (d) { return (document.querySelectorAll(`div#${d}`).length < 2); };

        const placeholders = document.querySelectorAll('div.discovery-search-widget');
        placeholders.forEach( function (searchDiv) {

            let searchId = searchDiv.getAttribute('id');

            // make sure the ID on the element is unique, change it if not
            if ( (searchId === '' || searchId === null || typeof searchId === 'undefined') || !isUniqueID(searchId)) {
                debug(`Search Widget with no-ID/non-unique ID detected (${searchId})... assigning a unique ID`);
                if (searchId === '' || searchId === null || typeof searchId === 'undefined') { searchId = 'discoverySearch'; }

                // select a new id
                let newId = '';
                do { newId = searchId + "_" + Math.floor((Math.random() * 1000) + 1);
                } while (!isUniqueID(newId));

                // assign the new id
                searchId = newId;
                searchDiv.setAttribute('id', searchId);

                debug(`Search Widget id reassigned: ${searchId}`);

            }

            /* *****************************************************************
             * Create the form element
             */

            const search = {
                searchDiv: searchDiv,
                form: document.createElement("form"),
                keywords: document.createElement("input"),
                hidden: document.createElement("div"),
                submit: document.createElement("input"),
                label: document.createElement("label"),
            };

            search.form.setAttribute('id', `${searchId}-form`);

            search.keywords.setAttribute('id', `${searchId}-primoQueryTemp`);
            search.keywords.setAttribute('type', 'search');

            search.hidden.setAttribute('id', `${searchId}-hidden`);
            search.hidden.style.visibility = 'hidden';

            search.submit.setAttribute('id', `${searchId}-submit`);
            
            search.label.setAttribute('for', `${searchId}-primoQueryTemp`);
            search.label.setAttribute('id', `${searchId}-label`);
            search.label.innerText = 'Search'; // TODO: data-label

            /* searchDiv.dataset returns all data- attributes but changes keys to camel case, 
            but we want to keep them as-is
            https://www.geeksforgeeks.org/how-to-replace-the-names-of-multiple-object-keys-with-the-values-provided-using-javascript/
            https://stackoverflow.com/questions/47836390/how-to-convert-a-camel-case-string-to-dashes-in-javascript
            */
            let renameKeys = (object) =>
            Object.keys(object).reduce(
              (acc, key) => ({
                ...acc,
                ...{ [`data-${(key.replace(/[A-Z]/g, m => "-" + m.toLowerCase()))}`] : object[key] },
              }),
              {}
            );
            const options = { attributes: renameKeys(searchDiv.dataset) };

            searchDiv.innerHTML = '';
            search.form.appendChild(search.label);
            search.form.appendChild(search.keywords);
            search.form.appendChild(search.hidden);
            search.form.appendChild(search.submit);
            searchDiv.appendChild(search.form);

            load(options, search);

            
        });
    
    };

    const debug = function( text, obj = null ) {
		const pad = function (num, size = 2) { num = num.toString(); while (num.length < size) num = "0" + num; return num; }
		// as long as we aren't silenced (silent === false)...
		if( !info.silent ) { let d = new Date(); let ts = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(),3)}`; const s = `${info.handle} [${ts}] : ${text}`; (obj !== null) ? console.log(s, obj) : console.log(s); }
	};

	const cssCheck = function() {

		// load in the css, but check first to make sure it isn't already loaded
		// we do this rather than check for the file because the search box css could have been merged into another file, so we check css properties instead
		// just so long as ".discovery-search-widget label { left: -10022px; }" doesn't change!
		var elem = document.getElementsByClassName("discovery-search-widget");

		if (elem.length > 0) {

			var myTempStyle = elem[0].getElementsByTagName("label")[0];
			var theCSSprop = window.getComputedStyle(myTempStyle,null).getPropertyValue("left");

			if ( theCSSprop !== "-10022px" ) {
				debug("Adding css: " + cssFile );
				var css=document.createElement('link');
				css.type='text/css';
				css.rel='stylesheet';
				css.href= cssFile;
				document.getElementsByTagName('head')[0].appendChild(css);
			} else {
				debug("Discovery css detected");
			}
		}

	};

    const build = function (attr, settings, thisSearch) {
        /* Perform any calculated settings */
        const discoPath = (settings.primo_ve) ? 'discovery' : 'primo-explore';

        /* Transform existing template to a Primo starting template */
        /* Form */
        thisSearch.form.setAttribute('method', 'GET');
        thisSearch.form.setAttribute('target', attr['data-target']);
        thisSearch.form.setAttribute('action', `${settings.url}/${discoPath}/search`);
        thisSearch.form.setAttribute('enctype', 'application/x-www-form-urlencoded; charset=utf-8');
        thisSearch.form.classList.add('discovery-search-box');

        /* Keyword Field */
        console.log("DATA: ",attr);
        console.log("ATTR PLACEHOLDER: "+attr['data-placeholder']);
        if (attr['data-placeholder'].toLowerCase() === 'true') {
            thisSearch.keywords.setAttribute('placeholder', attr['data-placeholder-text']);
            console.log("PLACEHOLDER-TEXT: "+attr['data-placeholder-text'])
        }
        thisSearch.keywords.setAttribute('type', 'search');
        thisSearch.keywords.setAttribute('name', 'primoQueryTemp');
        thisSearch.keywords.setAttribute('autocomplete', 'off');
        thisSearch.keywords.classList.add('discovery-search-field');

        /* Hidden fields */
        const hiddenFields = []; // we use an array

        // primoQueryField - this is the real field sent to Primo search - we need to register it for submit
        const primoQueryField = thisUtilCreateHiddenField('query', ''); // , { id: `${thisSearch.id}-primoQuery` }

        // primoQueryjournals - this is an extra field required for journals - we won't add to hidden until needed
        const primoQueryJournals = thisUtilCreateHiddenField('journals', ''); // , { id: `${thisSearch.id}-primoQueryJournals` }

        // hidden fields
        hiddenFields.push(primoQueryField);
        hiddenFields.push(thisUtilCreateHiddenField('tab', settings.tab));
        hiddenFields.push(thisUtilCreateHiddenField('search_scope', settings.search_scope));
        hiddenFields.push(thisUtilCreateHiddenField('vid', settings.vid));

        if (!settings.primo_ve) {
            hiddenFields.push(thisUtilCreateHiddenField('institution', settings.instituion));
            hiddenFields.push(thisUtilCreateHiddenField('mode', 'Basic'));
            hiddenFields.push(thisUtilCreateHiddenField('displayMode', 'full'));
            hiddenFields.push(thisUtilCreateHiddenField('highlight', 'true'));
            hiddenFields.push(thisUtilCreateHiddenField('dum', 'true'));
            hiddenFields.push(thisUtilCreateHiddenField('bulkSize', settings.bulkSize));
            hiddenFields.push(thisUtilCreateHiddenField('displayField', 'all'));
            hiddenFields.push(thisUtilCreateHiddenField('pcAvailabiltyMode', 'true'));
        }

        if (settings.primo_ve) {
            hiddenFields.push(thisUtilCreateHiddenField('offset', 0));
        }

        // material/content type scoping
        // 20190820 - clk - added ability to search multiple types
        // IF BOOK|MUSIC|FILM|other
        if (attr['data-scope-content-type']) {
            let temp = attr['data-scope-content-type'];
            temp = temp.toLowerCase();

            const myTypes = (temp.trim()).split(','); // we trim in case it gets messy " param,aasdf,asdf "
            myTypes.forEach((item) => {
                const type = item.trim();

                let fv = '';

                switch (type) {
                case 'book':
                    fv = settings.facet_books;
                    break;
                case 'books':
                    fv = settings.facet_books;
                    break;
                case 'audio':
                    fv = settings.facet_audio;
                    break;
                case 'video':
                    fv = settings.facet_video;
                    break;
                case 'music':
                    fv = settings.facet_music;
                    break;
                case 'media':
                    fv = settings.facet_media;
                    break;
                default:
                    fv = item;
                }

                hiddenFields.push(thisUtilCreateHiddenField('mfacet', `rtype,include,${fv},1`));
            });
        }

        // subject scoping
        if (attr['data-scope-subj-terms']) {
            let temp = attr['data-scope-subj-terms'];
            temp = temp.toLowerCase();

            const myTypes = (temp.trim()).split(','); // we trim in case it gets messy " param,aasdf,asdf "
            // eslint-disable-next-line no-plusplus
            for (let i = 0, len = myTypes.length; i < len; i++) {
                hiddenFields.push(thisUtilCreateHiddenField('mfacet', `topic,include,${myTypes[i].trim()}`)); // we trim for asdf, asdf , asdf
            }
        }

        // discipline scoping
        // facet=topic,include,philosophy,history
        if (attr['data-scope-discipline']) {
            let temp = attr['data-scope-discipline'];
            temp = temp.toLowerCase();

            const myTypes = (temp.trim()).split(','); // we trim in case it gets messy " param,aasdf,asdf "
            // eslint-disable-next-line no-plusplus
            for (let i = 0, l = myTypes.length; i < l; i++) {
                hiddenFields.push(thisUtilCreateHiddenField('mfacet', `topic,include,${myTypes[i].trim()}`)); // we trim for asdf, asdf , asdf
            }
        }

        // language scoping
        // facet=lang,exact,fre
        if (attr['data-scope-language']) {
            let temp = attr['data-scope-language'];
            temp = temp.toLowerCase();

            const myTypes = (temp.trim()).split(','); // we trim in case it gets messy " param,aasdf,asdf "
            // eslint-disable-next-line no-plusplus
            for (let i = 0, len = myTypes.length; i < len; i++) {
                hiddenFields.push(thisUtilCreateHiddenField('mfacet', `lang,exact,${myTypes[i].trim()}`)); // we trim for asdf, asdf , asdf
            }
        }

        // date scoping
        // facet=searchcreationdate,include,1700|,|2017
        if (attr['data-scope-date']) {
            let temp = attr['data-scope-date'];
            temp = temp.toLowerCase().replace(/-/g, ''); // remove "-" in dates as they were used in summon

            const myTypes = (temp.trim()).split(':');

            if (myTypes[0] === '') { myTypes[0] = 0; }
            if (myTypes[1] === '') { myTypes[1] = (new Date()).getFullYear(); }

            const v = `searchcreationdate,include,${myTypes[0].substring(0, 4)}|,|${myTypes[1].substring(0, 4)}`;
            // Primo only takes 4 digit year as facet

            hiddenFields.push(thisUtilCreateHiddenField('mfacet', v));
        }

        // full text scoping
        // &facet=tlevel,include,online_resources
        if (attr['data-scope-fulltext']) {
            hiddenFields.push(thisUtilCreateHiddenField('mfacet', 'tlevel,include,online_resources,1'));
        }

        // available locally
        // facet=local1,include,My University Library
        if (attr['data-scope-local']) {
            hiddenFields.push(thisUtilCreateHiddenField('mfacet', `${settings.localParam},include,${settings.localDesc}`));
        }

        // scholarly scoping
        // facet=tlevel,include,peer_reviewed
        if (attr['data-scope-scholarly']) {
            hiddenFields.push(thisUtilCreateHiddenField('mfacet', 'tlevel,include,peer_reviewed'));
        }

            
        /* ********************************************************************
         * Tag line and links */

        let searchTagline = null;
        let discoveryLinks = null;
        let searchAdvanced = null;
        let myAccountLink = null;
        let myCustomLink = null;

        // tagline above the box
        if (attr['data-tagline'].toLowerCase() === 'true') {
            searchTagline = document.createElement('p');
            searchTagline.classList.add('discovery-tagline');
            searchTagline.innerText = attr['data-tagline-text'];
        }

        // advanced search link below
        if (attr['data-advanced'].toLowerCase() === 'true') {
            searchAdvanced = document.createElement('li');
            let a = document.createElement('a');
            a.setAttribute('href', `${settings.url}/${discoPath}/search?mode=advanced&vid=${settings.vid}`);
            a.innerText = attr['data-advanced-text'];
            searchAdvanced.appendChild(a);
        }

        // my account link below
        if (attr['data-login'].toLowerCase() === 'true') {
            myAccountLink = document.createElement('li');
            let a = document.createElement('a');
            a.setAttribute('href', `${settings.url}/${discoPath}/account?section=overview&vid=${settings.vid}`);
            a.innerText = attr['data-login-text'];
            myAccountLink.appendChild(a);
        }

        // custom link below
        if (attr['data-custom-link'].toLowerCase() === 'true') {
            myCustomLink = document.createElement('li');
            let a = document.createElement('a');
            a.setAttribute('href', attr['data-custom-link-url']);
            a.innerText = attr['data-custom-link-text'];
            myCustomLink.appendChild(a);
        }

        if (myAccountLink !== null || searchAdvanced !== null || myCustomLink !== null) {

            discoveryLinks = document.createElement('ul');
            discoveryLinks.classList.add('discovery-links');

            if (searchAdvanced !== null) { discoveryLinks.appendChild(searchAdvanced); } // add Advanced link
            if (myAccountLink !== null) { discoveryLinks.appendChild(myAccountLink); } // add Account link
            if (myCustomLink !== null) { discoveryLinks.appendChild(myCustomLink); } // add Custom link

        }


        /* *****************************************************************
            Generate the search button
        */

        thisSearch.submit.setAttribute('type', 'submit');
        thisSearch.submit.setAttribute('name', 'search');
        thisSearch.submit.setAttribute('value', attr['data-button']);
        thisSearch.submit.setAttribute('title', attr['data-label']);
        thisSearch.submit.setAttribute('alt', 'Search');
        thisSearch.submit.classList.add('discovery-search-button');

        /* Search button event */
        /*
        $(searchField).keydown(function (event) {
            if (event.keyCode === 13) {
                $(this).trigger("keyup"); // make sure it gets sent!**
                searchPrimoEnhanced(searchId, discoveryCustom.primo_ve); // this.form.submit();
                return false;
            }
        });
        */
        thisSearch.submit.addEventListener('click', () => {
            // this here looks to see if we are doing a search on author, title, journal, or course field
            let field = 'any';
            const scope = attr['data-scope'];
            if (scope) {
                // set the field of query=[field],contains,[keywords]
                switch (scope.toLowerCase()) {
                case 'author':
                    field = 'creator';
                    break;

                case 'journal':
                    field = 'any';
                    // journal search has an extra field: journals
                    primoQueryJournals.value = `any,${thisSearch.keywords.value.replace(/[,]/g, ' ')}`;
                    break;

                /* Naming got better in VE */
                case 'course_name':
                    field = settings.primo_ve ? 'course_name' : 'crsname';
                    break;

                case 'course_instr':
                case 'course_instructor':
                    field = settings.primo_ve ? 'course_instructor' : 'crsinstrc';
                    break;

                case 'course_id':
                case 'course_code':
                    field = settings.primo_ve ? 'course_code' : 'crsid';
                    break;

                case 'course_dept':
                case 'course_department':
                    field = settings.primo_ve ? 'course_department' : 'crsdept';
                    break;

                default:
                    field = scope.toLowerCase();
                }
            }
            primoQueryField.value = `${field},contains,${thisSearch.keywords.value.replace(/[,]/g, ' ')}`;

            thisSearch.form.submit();
        });

        /* *****************************************************************
        Put it all together */

        // assemble the search form
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < hiddenFields.length; i++) {
            thisSearch.hidden.appendChild(hiddenFields[i]);
        }
        
        // assemble the discovery box
        if (searchTagline !== null) { thisSearch.searchDiv.prepend(searchTagline); } // before form
        if (discoveryLinks !== null) { thisSearch.searchDiv.appendChild(discoveryLinks); } // after form

        // adjust scope
        if (attr['data-scope']) {
            const temp = attr['data-scope'].toLowerCase();

            if (temp === 'journal') {
                // if it is a journal box, modify it.... just easier to do it all here (just takes a millisecond)
                const rm1 = thisSearch.hidden.querySelector("input[name='search_scope']"); // remove the scope - search_scope
                if (rm1) { rm1.remove(); }
                const rm2 = thisSearch.hidden.querySelector("input[name='mode']"); // remove the mode
                if (rm2) { rm2.remove(); }
                thisSearch.hidden.querySelector("input[name='tab']").setAttribute('value', 'jsearch_slot'); // switch tab over to journal
                thisSearch.form.setAttribute('action', `${settings.url}/${discoPath}/jsearch`);
                thisSearch.hidden.appendChild(primoQueryJournals);// add journals
            } else if (temp.substr(0, 6) === 'course') {
                const scopeCode = settings.primo_ve ? 'CourseReserves' : `${settings.search_scope}_course`;
                thisSearch.hidden.querySelector("input[name='search_scope']").setAttribute('value', scopeCode);
                const tabCode = settings.primo_ve ? 'CourseReserves' : 'course_tab';
                thisSearch.hidden.querySelector("input[name='tab']").setAttribute('value', tabCode);
            }
        }
    };
    
    /* *****************************************************************
     * EXECUTE: This is what we call when document is ready
     */

    // capture the execution start time
    const initStart = new Date();

    debug(`Loaded ${info.name} (${info.code}) [ver${info.version}]`);
    debug('Starting...');

    // call the function that goes through the page and transforms all the div.discovery-search-widget tags
    create();

    // now that we've transformed the divs, load the style sheet if it isn't already
    cssCheck();

    // calculate the milliseconds it took to transform all <div> tags
    const diff = Math.abs((new Date()) - initStart);

    // put it in the console.log for devs to check execution time
    debug(`Done. Completed in ${diff} milliseconds`);

    /*
     * END EXECUTE
     ***************************************************************** */

})();
