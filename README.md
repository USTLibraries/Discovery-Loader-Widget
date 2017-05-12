# Discovery-Widget
Generate a search box for your library discovery layer. Currently available for Summon and Primo but additional services/customizations may be added. Just look at the primo.js and summon.js and see how they differ and generate to learn how.

## Get Started

1. Use a DIV tag from one of the example HTML files.
2. Customize the custom variables in the .js files.
3. Then add a call to the [summon/primo].js file.
4. CSS will be included automatically! But if you wish to load the css into a main css file, go ahead (it checks so it won't do it twice!)

## Summon Search

Use the summon.js and summon.css files

## Primo Search

New! May 2017! Now Primo Search boxes are supported!

Just use primo.js and primo.css files

Uses the same DIV tag structure as before so switching to Primo from Summon (or vice versa) is easy! (More documentation coming soon)

## Installation

1. Download and customize the primo.js (or summon.js) file (see JavaScript Customization below)
2. Download and customize the primo.css (or summon.css) file (basically the color of the button at the very least unless you like purple)
3. Place primo.js and primo.css or summon.js and summon.css files on your server
4. Add DIV HTML, JavaScript src, and (optional) CSS link to your pages.
5. Be sure the links in your DIV tags point to your main discovery search page (not results)

Basic format that we copy and paste into your CMS is:

JavaScript in HEAD (or at end of BODY, or immediately following DIV):

    <script type="text/javascript" src="primo.js"></script>

CSS in HEAD (or include CSS within your main css, or not at all since the script will check for it an include it automatically):

    <link href="primo.css" type="text/css">

HTML in BODY:

    <div class="discovery-search-widget">
        <a href="https://your-primo.hosted.exlibrisgroup.com/primo-explore/search?vid=YOURVIEW">Search Library Resources</a>
    </div>

The above HTML DIV gives a very basic out of the box search box. You can add attributes for scoping and text such as:

    <div class="discovery-search-widget"
        id="discoverySearch001"
        data-scope="title"
        data-scope-content-type="BOOKS"
        data-tagline="Type as much or as little of the title as you want:"
        data-placeholder="Title keywords"
    ><a href="https://your-primo.hosted.exlibrisgroup.com/primo-explore/search?vid=YOURVIEW">Search Library Resources</a></div>

More examples are listed in the example-summon.html and example-primo.html

The DIV format for either Primo or Summon are the same.
