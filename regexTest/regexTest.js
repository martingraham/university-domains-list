
var regexString = '\\b[\\w\\.-]+@([\\w\\.-]+(edu|ac.uk|edu.\\w{2}|ac.\\w{2})|(tu|campus-tu|campus.tu|uni|hs|fh|efh|ph|mdc|leibniz|mpi)[\\w-]+.(de|at)|uni\\w{2,7}.(it|hr|ch)|embl.\\w{2}|[\\w]+.(mpg|fraunhofer).de|dfkz.de|uni[\\w]+.br|[\\w.]*u[\\w.]+(ca|cl|ci)|univ-[\\w]+.(dz|fr)|uni-[\\w]+.bg)\\b';

var regexp = new RegExp (regexString, 'i');

$(document).ready(function() {
    // should poke local version reallu
  //$.getJSON("https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json", function (json) {
  $.getJSON("../world_universities_and_domains.json", function (json) {
   
  $("#input").text(json.length+" Institutions in total");
    
   var domains = {};
   var repeatedDomains = {};
   json.forEach (function (inst) {
   		if (domains[inst.domain]) {
      		repeatedDomains[inst.domain] = (repeatedDomains[inst.domain] || 0) + 1;
      }
   		domains[inst.domain] = true;
   });
   var domains = Object.keys(domains);
   console.log ("uniqueDomains", domains);
   console.log ("repeatedDomains", repeatedDomains);
   $("#uniqueDomain").text(domains.length+" Unique domains.");

    var pretendEmails = domains.map (function (domain) {
    		return "john@"+domain;
    });
    //pretendEmails.push("john@madeupuni.hotmail.com");
    console.log (pretendEmails);
    
    var failedEmails = pretendEmails.filter (function (email) {
    		return !regexp.test(email);
    });
     $("#output").text(failedEmails.length+" Domains failed pattern regex");
    console.log (failedEmails, regexp);
    
    var countries= {};
    failedEmails.forEach (function (email) {
    	var end = email.slice(email.lastIndexOf(".") + 1);
      countries[end] = (countries[end] || 0) + 1;
    });
    
    var sortCountries = [];
    Object.keys(countries).forEach (function (country) {
        sortCountries.push ({"country": country, "fails": countries[country]});
    });
    console.log (sortCountries);
    
    sortCountries.sort (function(a,b) {
    	return b.fails - a.fails;
    });
    var str = "";
    sortCountries.forEach (function (country) {
    	str += country.country+"&#0009;"+country.fails+"<br>";
    });
    $("#fails").html(str);
    
    var failedDomains = failedEmails.map (function (email) {
    	return email.slice(email.indexOf("@") + 1);
    });
    var failedRegex = new RegExp ("[.]*"+failedDomains.join("|")+"$", "i");
    console.log (failedRegex);
    
    var twiceFailedEmails = failedEmails.filter (function (email) {
    		return !failedRegex.test(email);
    });
    $("#refry").html(twiceFailedEmails.length+" of these "+failedEmails.length+" Domains failed a long list regex specially made for them.");

    var failedAlternatives = "|("+failedDomains.join("|")+")";
    // slice last bracket and word boundary off regex, insert failedALternatives, reinstate last bracket and word boundary
    var almightyRegexString = regexString.slice(0,-3)+failedAlternatives+')\\b';
    var almightyRegex = new RegExp (almightyRegexString, 'i');
    console.log ("almighty regex", almightyRegex);
    var ms = window.performance.now();
    var almightyFailedEmails = pretendEmails.filter (function (email) {
    		return !almightyRegex.test(email);
    });
    var ms = window.performance.now() - ms;
    $("#almighty").html(almightyFailedEmails.length+" of all "+pretendEmails.length+" Domains failed almighty regex in "+(ms/1000)+" seconds.");
    $("#theregex").text(JSON.stringify(almightyRegexString));
    });
});
