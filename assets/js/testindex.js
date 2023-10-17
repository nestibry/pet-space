// Global Variables
console.log("Testing Petfinder API...");
var testApiSectionEl = $(".test-api-section");
var bearerToken = "";
var animialData = [];

// Search parameters
//      Type of animal
//      Age of animal baby, young, adult, senior Accepts multiple values, e.g. age=baby,senior.
//      Size of animal small, medium, large, xlarge Accepts multiple values, e.g. size=large,xlarge.
//      City, State, Zip
//      Distance-from

var queryType = "dog";
var queryAge = "";
var querySize = "";
var queryLocation = "";
var queryDistance = "";

var queryString = `type=${queryType}&age=${queryAge}&size=${querySize}`;

if (queryLocation !== "") { queryString += `&location=${queryLocation}`; }
if (queryDistance !== "") { queryString += `&distance=${queryDistance}`; }


// Handshake with Petfinder API
fetch("https://api.petfinder.com/v2/oauth2/token", {
  body: JSON.stringify({
    grant_type: "client_credentials",
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
  fetch(`https://api.petfinder.com/v2/animals?${queryString}`, {
    headers: {
      "Authorization": `Bearer ${bearerToken}`,
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      animialData = data;

      renderAnimalData();

    })
    .catch(error => console.error(error));
}

function renderAnimalData() {
  var testApiSectionEl = $(".test-api-section");

  // Clear the testApiSection to get ready for the new rendering
  for (var j = (testApiSectionEl.children().length - 1); j > 0; j--) {
    testApiSectionEl.children().eq(j).remove();
  }


  for (var i = 0; i < animialData.animals.length; i++) {
    var nameEl = $('<h3>');
    nameEl.text(animialData.animals[i].name);
    testApiSectionEl.append(nameEl);
  }



}
