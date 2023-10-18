// Global Variables
// console.log("Testing Petfinder API...");
// var testApiSectionEl = $(".test-api-section");
var bearerToken = "";
var animalData = [];
// var petFinderFormEl = $('#pet-finder-form');

// Search parameters
//      Type of animal
//      Age of animal baby, young, adult, senior Accepts multiple values, e.g. age=baby,senior.
//      Size of animal small, medium, large, xlarge Accepts multiple values, e.g. size=large,xlarge.
//      City, State, Zip
//      Distance-from


// Query String
var queryType = "dog";
var queryAge = "";
var querySize = "";
var queryLocation = "";
var queryDistance = "";

var queryString = `type=${queryType}&age=${queryAge}&size=${querySize}`;

if (queryLocation !== "") { queryString += `&location=${queryLocation}`; }
if (queryDistance !== "") { queryString += `&distance=${queryDistance}`; }


// Handshake with Petfinder API
function searchPetfinderAPI(){
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
}


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
      animalData = data;


      renderAnimalData();

    })
    .catch(error => console.error(error));
}

function renderAnimalData() {
  var animalListEl = $(".animal-list");



  // Clear out old elements
  animalListEl.empty()
  console.log("made it to render animal data");

  // Creating each animal card
  for (var i = 0; i < animalData.animals.length; i++) {

    var animalCardEl = $('<div>');
    animalCardEl.addClass("card row justify-content-center mx-auto animal-card");

    var animalRowEl = $('<div>');
    animalRowEl.addClass("row d-flex justify-content-center g-0");

    var imgSection = $('<div>');
    imgSection.addClass("col-md-4");
    var imgEl = $('<img>');
    imgEl.addClass("img-fluid rounded-start")

    if (animalData.animals[i].photos.length === 0) {

      imgEl.attr('src', "./assets/images/photocomingsoon.png");
    }
    else {
      imgEl.attr('src', animalData.animals[i].photos[0].medium)
    }


    var animalBioEl = $('<div>');
    animalBioEl.addClass("col-md-8");

    var cardBodyEl = $('<div>');
    cardBodyEl.addClass("card-body");

    var cardTitleEl = $('<h5>');
    cardTitleEl.addClass("card-title");
    cardTitleEl.text(animalData.animals[i].name);

    var cardTextEl = $('<p>');
    cardTextEl.addClass("card-text");
    cardTextEl.text(animalData.animals[i].description);

    var animalAgeEl = $('<li>');
    animalAgeEl.text(animalData.animals[i].age);
    // animalAgeEl.addClass("li");

    var animalSizeEl = $('<li>');
    animalSizeEl.text(animalData.animals[i].size);
    // animalSizeEl.addClass("col-md-8");

    // var animalDistanceEl = $('<li>');
    // animalDistanceEl.text(animalData.animals[i].contact.distance);
    // animalDistanceEl.addClass("col-md-8");

    var animalUrlEl = $('<li>');
    var urlLinkEl = $('<a>');
    urlLinkEl.attr('href', animalData.animals[i].url);
    urlLinkEl.text("Link to Animal in Petfinder");
    animalUrlEl.append(urlLinkEl);
    // animalUrlEl.text(animalData.animals[i].url);
    // animalUrlEl.addClass("col-md-8");


    //Append everything togther
    cardBodyEl.append(cardTitleEl);
    cardBodyEl.append(cardTextEl);
    cardBodyEl.append(animalAgeEl);
    cardBodyEl.append(animalSizeEl);
    // cardBodyEl.append(animalDistanceEl);
    cardBodyEl.append(animalUrlEl);
    animalBioEl.append(cardBodyEl);


    imgSection.append(imgEl);

    animalRowEl.append(imgSection);
    animalRowEl.append(animalBioEl);
    animalCardEl.append(animalRowEl);
    animalListEl.append(animalCardEl);
  }
}

var petFinderFormEl = $('#pet-finder-form');

petFinderFormEl.on("submit", function(event){

    event.preventDefault();
    event.stopPropagation();
    console.log("Submitted Petfinder Form");

    // Get the user's inputs and add to Query String
    var queryType = $('#animal-type-input').val();
    var queryAge = $('#animal-age-input').val();
    var querySize = $('#animal-size-input').val();
    var queryLocation = $('#animal-location-input').val();
    var queryDistance = $('#animal-distance-input').val();

    queryString = `type=${queryType}&age=${queryAge}&size=${querySize}`;
    
    // If Location is entered, combine the location and distance selected to query  
    // Making sure the user only enter a Postal Code of lenghth 5 digits
    if( !isNaN(parseInt($('#animal-location-input').val())) && ($('#animal-location-input').val().length == 5)){
        queryString += `&location=${queryLocation}&distance=${queryDistance}`;
    }

    console.log(`Query String: ${queryString}`);

    searchPetfinderAPI();


});

