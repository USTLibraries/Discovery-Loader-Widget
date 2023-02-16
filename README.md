# Discovery-Widget

Generate a search box for Primo (Either New UI or VE)

Uses plain JavaScript (no jQuery or other framework needed). Just fill in the custom settings in the JS file, and add a DIV placeholder and SCRIPT src to your page. It is also accessibility compliant, and works across browsers, is responsive, and even takes into account the "search" keyboard button in iOS.

## Get Started

1. Use a DIV tag from one of the example HTML files.
2. Customize the custom variables in primo.js
3. Then add a script source to primo.js
4. CSS will be included automatically! But if you wish to load the css into a main css file, go ahead (it checks so it won't do it twice!)

## Installation

1. Download and customize the primo.js file (see JavaScript Customization below)
2. Download and customize the primo.css file (basically the color of the button at the very least unless you like purple)
3. Place primo.js and primo.css on your server
4. Add DIV HTML, JavaScript src, and (optional) CSS link to your pages.
5. Be sure the links in your DIV tags point to your main discovery search page (not results)

Basic format to use is:

```HTML
    <div class="discovery-search-widget">
        <a href="https://your-primo.hosted.exlibrisgroup.com/primo-explore/search?vid=YOURVIEW">Search Library Resources</a>
    </div>
    <script type="text/javascript" src="primo.js" defer></script>
```

(The script tag can go at the end of the page. It can do anywhere as long as it follows the last search widget)

The above HTML DIV gives a very basic out of the box search box. You can add attributes for scoping and text such as:

```HTML
    <div class="discovery-search-widget"
        id="discoverySearch001"
        data-scope="title"
        data-scope-content-type="BOOKS"
        data-tagline="Type as much or as little of the title as you want:"
        data-placeholder="Title keywords"
    ><a href="https://your-primo.hosted.exlibrisgroup.com/primo-explore/search?vid=YOURVIEW">Search Library Resources</a></div>
```

More examples are listed in [examples](examples/example-primo.html)

## Summon

summon.js is also included, however it requires jQuery. See the [Summon examples](examples/example-summon.html) page for more information.
