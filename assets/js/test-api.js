console.log("Testing Petfinder API...");

var testApiSectionEl = $(".test-api-section");

var bearerToken = "";


// Handshake with Petfinder API
fetch("https://api.petfinder.com/v2/oauth2/token", {
    body: JSON.stringify({
        grant_type:"client_credentials",
        client_id: "kc4h16jXNYvrs7zpk5mCcsXSpoFhyi9MzWT4vBKEKAJBH7AvCo",
        client_secret: "RakCkcJcS940lvljgmdeU4wkvkJpveHmSWg0cCvo"
    }),
    method: "POST",
    headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
})
.then(response => response.json())
.then(data => {
    console.log(data);
    bearerToken = data.access_token;
    console.log(bearerToken);
    fetchAnimals();
})
.catch(error => console.error(error));


function fetchAnimals() {
    fetch("https://api.petfinder.com/v2/animals?type=dog&page=2", {
        headers: {
        "Authorization": `Bearer ${bearerToken}`,
        "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}
