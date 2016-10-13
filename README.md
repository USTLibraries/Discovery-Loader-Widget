# Discovery-Widget
Generate a search box for your library discovery layer. Currently available for Summon but additional services/customizations may be added.

Be sure to change static.stthomas.edu/libraries to point to your own code
Also be sure to change instances of stthomas.summon.serialssolutions.com

Note that there is a deploy feature that you may ignore.
To keep it simple just update the discovery.js and discovery.css (might be called summon.js and summon.css) files.
In fact, you don't even need to worry about versioning if you aren't updating the files beyond your initial URL customizations.

Advanced Uses:
See documentation for launching/deploying new code.
For example you can have discovery-20161201.js expire and discovery-20161215.js take over at 6am Dec 15, 2016.
Maybe, you are using summon-20161201.js and are launching primo-20170531.js at a specified time.

Eventually we'll make the whole "use it out of the box" thing simpler but the code is still evolving. Stable, but evolving.
