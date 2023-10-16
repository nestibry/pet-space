// Global Variables
console.log("Testing Petfinder API...");
var testApiSectionEl = $(".test-api-section");
var bearerToken = "";

// Search parameters
//      Type of animal
//      Age of animal baby, young, adult, senior Accepts multiple values, e.g. age=baby,senior.
//      Size of animal small, medium, large, xlarge Accepts multiple values, e.g. size=large,xlarge.
//      City, State, Zip
//      Distance-from

var queryType = "dog";
var queryAge = "";
var querySize = "";
var queryCityFrom = "";
var queryDistanceFrom = "";






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
    fetch("https://api.petfinder.com/v2/animals", {
        headers: {
        "Authorization": `Bearer ${bearerToken}`,
        "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}
