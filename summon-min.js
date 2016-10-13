/*
	Discovery Loader Widget
	University of St. Thomas
	September 22, 2016
	
	Full Code (including non-minified) and Documentation available at:
	https://github.com/USTLibraries/Discovery-Loader-Widget
	
	https://jscompress.com/ was used to create minified js version
	https://cssminifier.com/ was used to create the minified css version
	
*/
								
var discoveryBaseURL="https://stthomas.summon.serialssolutions.com",ver="1.0";if("undefined"!=typeof $)$(document).ready(function(){console.log("DISCOVERY: Loading Discovery search box (ver "+ver+")..."),function(a){a.fn.discoverySearchWidget=function(){return this.each(function(){var b=function(a){return null!=a&&""!=a&&"false"!=a.toLowerCase()&&"no"!=a.toLowerCase()},c=function(a){return"default"===a.toLowerCase()},d=function(b){return a("div#"+b).length<2},e=function(b,c){var d=document.createElement("input");return a(d).attr({type:"hidden",name:b,value:c}),d},f=a(this).attr("id");if(!b(f)||!d(f)){console.log("DISCOVERY: Search Widget with no-ID/non-unique ID detected ("+f+")... assigning a unique ID"),b(f)||(f="discoverySearch");var g="";do g=f+"_"+Math.floor(1e3*Math.random()+1);while(!d(g));f=g,a(this).attr("id",f),console.log("DISCOVERY: Search Widget id reassigned: "+f)}var h="",i=document.createElement("form");a(i).attr({id:f+"-form",method:"GET",name:"summonSearch",target:"_blank",action:discoveryBaseURL+"/search",class:"discovery-search-box"});var j=document.createElement("input");if(a(j).attr({id:f+"-searchfield",type:"search",name:"s.q",autocomplete:"off",class:"discovery-search-field"}),h=a(this).attr("data-placeholder"),b(h)){var k="Search for articles, books, and more";c(h)||(k=h),a(j).attr("placeholder",k)}a(j).keydown(function(b){if(13==b.keyCode)return a(this).trigger("keyup"),this.form.submit(),!1});var l=document.createElement("label");a(l).attr("for",f+"-searchfield").html("Search Summon");var m=[];if(m.push(e("spellcheck","true")),m.push(e("keep_r","true")),m.push(e("utf8","?")),h=a(this).attr("data-scope"),b(h)){var n=h.charAt(0).toUpperCase()+h.substr(1).toLowerCase(),o=e("s.q","");a(o).attr("id",f+"-datafield"),a(j).attr("name","sqInputOnly"),a(j).attr("data-datafield",f+"-datafield"),a(j).attr("data-scope",n),a(j).on("keyup blur",function(){var b="#"+a(this).attr("data-datafield"),c=a(this).attr("data-scope");a(b).val(c+"Combined:("+a(this).val()+")")}),m.push(o)}if(h=a(this).attr("data-scope-content-type"),b(h)){var p=a(this).attr("data-scope-content-type");if("BOOK"===p||"BOOKS"===p)m.push(e("s.fvf[]","ContentType,Book / eBook")),m.push(e("s.fvf[]","ContentType,Book Chapter"));else if("MUSIC"===p);else if("FILM"===p||"FILMS"===p)m.push(e("s.fvf[]","ContentType,Video Recording")),m.push(e("s.fvf[]","ContentType,Streaming Video"));else for(var q=p.trim().split(","),r=0,s=q.length;r<s;r++)m.push(e("s.fvf[]","ContentType,"+q[r].trim()))}if(h=a(this).attr("data-scope-subj-terms"),b(h)){var p=a(this).attr("data-scope-subj-terms");m.push(e("s.fvgf[]","SubjectTerms,or,"+p.trim()))}if(h=a(this).attr("data-scope-discipline"),b(h))for(var p=a(this).attr("data-scope-discipline"),q=p.trim().split(","),r=0,s=q.length;r<s;r++)m.push(e("s.fvf[]","Discipline,"+q[r].trim()));if(h=a(this).attr("data-scope-language"),b(h))for(var p=a(this).attr("data-scope-language"),q=p.trim().split(","),r=0,s=q.length;r<s;r++)m.push(e("s.fvf[]","Language,"+q[r].trim()));if(h=a(this).attr("data-scope-date"),b(h)){var p=a(this).attr("data-scope-date");m.push(e("s.rf","PublicationDate,"+p))}h=a(this).attr("data-scope-fulltext"),b(h)&&m.push(e("s.fvf[]","IsFullText,true")),h=a(this).attr("data-scope-scholarly"),b(h)&&m.push(e("s.fvf[]","IsScholarly,true")),h=a(this).attr("data-scope-local"),b(h)&&m.push(e("s.fq[]",'SourceType:("Library Catalog")'));var t=document.createElement("input");a(t).attr({type:"submit",name:"search",value:"Search Summon",class:"discovery-search-button"});var u=null;if(h=a(this).attr("data-tagline"),b(h)){var k="Summon searches across the library collections";c(h)||(k=h),u=document.createElement("p"),a(u).addClass("discovery-tagline"),a(u).html(k)}var v=null;if(h=a(this).attr("data-advanced"),b(h)){var k="More search options";c(h)||(k=h),v=document.createElement("p"),a(v).addClass("discovery-advanced");var w=document.createElement("a");a(w).attr("href",discoveryBaseURL+"/#!/advanced"),a(w).html(k),a(w).appendTo(v)}var x=document.createElement("div");a(x).attr({id:f+"-autosuggest",class:"discovery-search-autosuggest"}),a(i).append(l),a(i).append(j),a(i).append(m),a(i).append(t),a(this).html(i),null!=u&&a(this).prepend(u),null!=v&&a(this).append(v),null!=x&&a(this).append(x),"undefined"!=typeof a.fn.autocomplete?(a(j).autocomplete({source:function(b,c){a.ajax({url:discoveryBaseURL+"/metadata/suggest/suggest",dataType:"jsonp",data:{type_strict:"should",all_types:"true",prefix:b.term},success:function(b){c(a.map(b.result,function(a){return{label:a.name,value:a.name}}))}})},minLength:2,delay:300,appendTo:a(x)}),console.log("DISCOVERY: jQuery ui AVAILABLE, autosuggest ENABLED for: #"+a(this).attr("id"))):console.log("DISCOVERY: jQuery ui NOT available, autosuggest NOT enabled for: #"+a(this).attr("id"))})}}(jQuery),$(".discovery-search-widget").discoverySearchWidget()});else{console.log("DISCOVERY: jQuery and jQuery UI required to generate dynamic discovery search box. Generic search box generated instead.");for(var divs=document.getElementsByClassName("discovery-search-widget"),i=0,len=divs.length;i<len;i++){var sbID=divs[i].getAttribute("id"),nl="\n",html="<form class='discovery-search-box' action='"+discoveryBaseURL+"/search' target='_blank'       name='summonSearch' method='GET' id='"+sbID+"-form'>"+nl+"   <label for='"+sbID+"-searchfield'>Search Summon</label>"+nl+"   <input placeholder='Search for articles, books, and more' class='discovery-search-field'       autocomplete='off' name='s.q' id='"+sbID+"-searchfield' type='search'> "+nl+"   <input value='true' name='spellcheck' type='hidden'> "+nl+"   <input value='true' name='keep_r' type='hidden'> "+nl+"   <input value='?' name='utf8' type='hidden'> "+nl+"   <input class='discovery-search-button' value='Search Summon' name='search' type='submit'> "+nl+"</form>"+nl;divs[i].innerHTML=html}}