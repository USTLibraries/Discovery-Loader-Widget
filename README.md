# Discovery-Widget
Generate a search box for your library discovery layer. Currently available for Summon and Primo but additional services/customizations may be added. Just look at the primo.js and summon.js to learn how.

Runs with jQuery but falls back to a regular search if only javascript is available. (And if plain JavaScript isn't available, it will just show a link to your discovery instance so it is pretty fail safe). It is also accessibility compliant, and works across browsers, is responsive, and even takes into account the "search" keyboard button in iOS.

Right now the JavaScript version doesn't do scoping and customization is limited. primo.js _could_ be re-written to provide the same functionality to both jQuery and non JQuery implementations... but hasn't... yet. No timeframe.

## Get Started

1. Use a DIV tag from one of the example HTML files.
2. Customize the custom variables in discovery-loader.js
3. Then add a call to the discovery-loader.js
4. CSS will be included automatically! But if you wish to load the css into a main css file, go ahead (it checks so it won't do it twice!)

## Summon Search

Use the summon.js and summon.css files

Uses the same DIV tag structure as the Primo DIV. See example-summon.html for documentation.

Set the discovery_widget_loader_custom_settings variable to use summon.js and summon.css

No plans on adding additional features to summon.js

## Primo Search

New! May 2017! Now Primo Search boxes are supported!

New! June 2017! Now Primo Journal Title Search boxes are supported!

New! June 2017! Course Reserve searches are in beta (I don't have data to fully test against yet)

New! September 2017! CSS enhancements for small widths (like if the search box is placed in a narrow column) and ability to add a custom link.

New! August 2019: Multi select material type facets!

New! June 2020: Primo VE support and custom tab/window target.

Set the discovery_widget_loader_custom_settings js and css variable to use primo.js and primo.css

Uses the same DIV tag structure as before so switching to Primo from Summon (or vice versa) is easy! See example-primo.html for documentation.

## Installation

1. Download and customize the discovery-loader.js file (see JavaScript Customization below)
2. Download and customize the primo.css (or summon.css) file (basically the color of the button at the very least unless you like purple)
3. Place primo.js and primo.css or summon.js and summon.css along with the discovery-loader.js files on your server
4. Add DIV HTML, JavaScript src, and (optional) CSS link to your pages.
5. Be sure the links in your DIV tags point to your main discovery search page (not results)

Basic format to use is:

    <div class="discovery-search-widget">
        <a href="https://your-primo.hosted.exlibrisgroup.com/primo-explore/search?vid=YOURVIEW">Search Library Resources</a>
    </div>
    <script type="text/javascript" src="discovery-loader.js"></script>

(The script tag can go at the end of the page. It can do anywhere as long as it follows the last search widget)

The above HTML DIV gives a very basic out of the box search box. You can add attributes for scoping and text such as:

    <div class="discovery-search-widget"
        id="discoverySearch001"
        data-scope="title"
        data-scope-content-type="BOOKS"
        data-tagline="Type as much or as little of the title as you want:"
        data-placeholder="Title keywords"
    ><a href="https://your-primo.hosted.exlibrisgroup.com/primo-explore/search?vid=YOURVIEW">Search Library Resources</a></div>

More examples are listed in the [examples/example-summon.html] and [examples/example-primo.html]

The DIV format for Primo and Summon are the same.
