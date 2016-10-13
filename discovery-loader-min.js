/*
	Discovery Loader Widget
	University of St. Thomas
	September 22, 2016
	
	Full Code (including non-minified) and Documentation available at:
	https://github.com/USTLibraries/Discovery-Loader-Widget
	
	https://jscompress.com/ was used to create minified version
	
*/

if("undefined"==typeof discovery_loaded){var launch=202009191500,myFile={OLD:{js:"//static.stthomas.edu/libraries/js/discovery/summon-20160919.js",css:"//static.stthomas.edu/libraries/js/discovery/summon-20160919.css"},NEW:{js:"//static.stthomas.edu/libraries/js/discovery/summon.js",css:"//static.stthomas.edu/libraries/js/discovery/summon.css"}},ver="0.1.1",getV=function(){var b=function(a){return a<10?"0"+a:a},c=new Date,d=c.getFullYear()+""+b(c.getMonth()+1)+b(c.getDate())+b(c.getHours())+b(c.getMinutes());return d},currentTimestamp=getV();console.log("DISCOVERY LOADER: Version is: "+ver+" w/ TIMESTAMP: "+currentTimestamp),"undefined"==typeof discovery_load&&(launch>currentTimestamp?discovery_load="OLD":discovery_load="NEW"),console.log("DISCOVERY LOADER: Adding js: "+myFile[discovery_load].js);var sc=document.createElement("script");sc.type="text/javascript",sc.src=myFile[discovery_load].js+"?v="+currentTimestamp,document.getElementsByTagName("body")[0].appendChild(sc),console.log("DISCOVERY LOADER: Adding css: "+myFile[discovery_load].css);var css=document.createElement("link");css.type="text/css",css.rel="stylesheet",css.href=myFile[discovery_load].css+"?v="+currentTimestamp,document.getElementsByTagName("head")[0].appendChild(css),discovery_loaded=!0,console.log("DISCOVERY LOADER: Done")}