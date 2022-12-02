class SPARQLQueryDispatcher {
	constructor( endpoint ) {
		this.endpoint = endpoint;
	}

	query( sparqlQuery ) {
		const fullUrl = this.endpoint + '?query=' + encodeURIComponent( sparqlQuery );
		const headers = { 'Accept': 'application/sparql-results+json' };

		return fetch( fullUrl, { headers } ).then( body => body.json() );
	}
}

const endpointUrl = 'https://query.wikidata.org/sparql';
const sparqlQuery = `SELECT DISTINCT ?item ?itemLabel ?awardLabel ?date WHERE {
  ?item (wdt:P106/(wdt:P279*)) wd:Q3455803; 
  p:P166 ?awardStat.
  ?awardStat pq:P805 
  ?award; ps:P166 wd:Q103360.
  ?award wdt:P585 ?date.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en,[AUTO_LANGUAGE]". }
}
ORDER By (?date)`;

const queryDispatcher = new SPARQLQueryDispatcher( endpointUrl );
queryDispatcher.query( sparqlQuery ).then( function(data){
    var results = data.results.bindings;
    for(var result in results){
        console.log(results[result]);
        var dest = "https://fr.wikipedia.org/wiki/".concat(results[result].itemLabel.value);
        document.querySelector("#results").innerHTML += '<li>'+"La "
        + results[result].awardLabel.value+'<span style = "color:red;"> a été lancée en </span>'+results[result].date.value.substring(0,10)+'<br></br>'
        +'<a href="'+dest+'">'+' PRIS par '+ results[result].itemLabel.value +'</a>'
        +'<br></br>'
        +'</li>';
    }    
});
