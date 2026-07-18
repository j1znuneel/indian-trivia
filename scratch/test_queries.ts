async function testQuery() {
  const query = `SELECT DISTINCT ?item ?itemLabel ?itemDescription ?date WHERE {
    ?item wdt:P31 ?type.
    VALUES ?type { wd:Q3918 wd:Q1205341 wd:Q35257 } # university, research institute, observatory
    ?item wdt:P17 wd:Q668.   # country: India
    ?item wdt:P571 ?date.    # inception date
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  } LIMIT 50`;

  const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}&format=json`;
  try {
    const start = Date.now();
    const res = await fetch(url, {
      headers: {
        "User-Agent": "BharatChrono/1.0 (contact@example.com)",
        "Accept": "application/sparql-results+json"
      }
    });
    console.log(`Duration: ${Date.now() - start}ms`);
    if (res.ok) {
      const json = await res.json();
      console.log(`Success! Returned ${json.results?.bindings?.length || 0} results.`);
      if (json.results?.bindings?.length > 0) {
        console.log("Sample:", json.results.bindings[0].itemLabel?.value, "at date", json.results.bindings[0].date?.value);
      }
    } else {
      console.log(`Failed: ${res.status}`);
    }
  } catch (e: any) {
    console.log(`Error: ${e.message}`);
  }
}

await testQuery();
