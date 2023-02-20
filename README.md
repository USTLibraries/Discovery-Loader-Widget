# Discovery-Widget

Generate a search box for Primo (Either New UI or VE)

Uses plain JavaScript (no jQuery or other framework needed). Just fill in the custom settings in the JS file, and add a DIV placeholder and SCRIPT src to your page. It is also accessibility compliant, and works across browsers, is responsive, and even takes into account the "search" keyboard button in iOS.

## Get Started

1. Use a DIV tag from one of the example HTML files
2. Customize the custom variables in primo.js
3. Then add a script source to primo.js
4. Either include a `<link>` to the primo.css file in `HEAD` or include the contents of the primo.css file in your main css

## Installation

1. Download and customize the primo.js file (see JavaScript Customization below. Only update `cssFile`, `configSettings`, and `configAttributes`)
2. Download and customize the primo.css file (basically the color of the button at the very least unless you like purple)
3. Place primo.js and primo.css on your server
4. Add DIV HTML, JavaScript src, and CSS link to your pages
5. Be sure the links in your DIV tags point to your main discovery search page (not results)

### Customize primo.js

The block of code below is an example of all you need to customize the basic features. You can add additional settings from the `defaultSettings` and `defaultAttributes`. You may also add `data-` attributes in the DIV tag to customize on-the-fly.

```javascript
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
```

Do not make changes to the `defaultSettings` or `defaultAttributes`, instead add the proper key/value pairs to `configSettings` and `configAttributes`. These are here, and included in the code, as examples.

```javascript
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

```

### Add HTML

Basic format to use is:

```HTML
    <div class="discovery-search-widget">
        <a href="https://your-primo.hosted.exlibrisgroup.com/primo-explore/search?vid=YOURVIEW">Search Library Resources</a>
    </div>
    <script type="text/javascript" src="primo.js" defer></script>
```

The script tag can go in the head, body, or end of the page as long as it has the `defer` attribute.

The above HTML DIV gives a very basic out of the box search box. You can add attributes for scoping and text such as:

```HTML
    <div class="discovery-search-widget"
        id="discoverySearch001"
        data-scope="title"
        data-scope-content-type="BOOKS"
        data-tagline="true"
        data-tagline-text="Type as much or as little of the title as you want:"
        data-placeholder="true"
        data-placeholder-text="Title keywords"
    ><a href="https://your-primo.hosted.exlibrisgroup.com/primo-explore/search?vid=YOURVIEW">Search Library Resources</a></div>
```

More examples are listed in [examples](examples/index.html)

## Summon

The files `summon.js` and `summon.css` are for reference only and are not currently supported. They utilize the same `DIV` placeholder standard, but will not load properly as-is. With updated coding you could make them work.
