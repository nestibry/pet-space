// Global Variables
var bearerToken = "";
var queryString = "";
var storeString = "";
var savedSearches = [];
var animalData = [];
var petFinderFormEl = $('#pet-finder-form');
var dropdownMenuEl = $(".dropdown-menu");


// New Technology => Popper => https://popper.js.org/
// Needed to add style.css...so doesn't really work as advertised
const popcorn = $('#popcorn');
const tooltip = $('#tooltip');

Popper.createPopper(popcorn, tooltip, {
    placement: 'left',
});




// Local Storage Functions and Render Saved Searches
function readFromLocalStorage() {  
    savedSearches = JSON.parse(localStorage.getItem('petspace-saved-searches')) || [];
}

function saveToLocalStorage() {
    readFromLocalStorage();
    
    // new search string
    var newItem = {
        displayStr: storeString,
        queryStr: queryString,
    }

    // Compare to existing and only add new unique searches
    var isNewSearch = (savedSearches.filter(savedSearches => savedSearches.queryStr == newItem.queryStr).length === 0);
    if(isNewSearch){
        savedSearches.push(newItem);
        localStorage.setItem('petspace-saved-searches', JSON.stringify(savedSearches)); 
    } else {
        console.log("Not a new search parameters...");
    }
}
readFromLocalStorage();

function renderSavedSearches() {

    // Read the saved searches from localStorage => "savedSearches" global variable
    readFromLocalStorage();

    // Clear the Dropdown Menu
    dropdownMenuEl.empty();

    // Iterates over all the savedSearches to add to the dropdown menu
    for(var i = 0; i < savedSearches.length; i++){
        var listEl = $('<li>');
        var anchorEl = $('<a>');
        anchorEl.addClass('dropdown-item');
        anchorEl.attr('href', '#');
        anchorEl.attr('data-query-str', savedSearches[i].queryStr);
        anchorEl.text(savedSearches[i].displayStr);
        listEl.append(anchorEl);
        dropdownMenuEl.append(listEl);
    }
}
renderSavedSearches();




// Get Bearer Token from Petfinder API then fetchAnimals()
function searchPetfinderAPI() {
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
    .catch(error => {
        console.error(error);
        alert("Error connecting to Petfinder API. Please try your search again.");
    });
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
        saveToLocalStorage(); // saves the query string to local storage
        renderSavedSearches(); // re-render the saved search options

    })
    .catch(error => console.error(error));
}

// Recieved Animal Data from API, Displaying data on website
function renderAnimalData() {
    var animalListEl = $(".animal-list");
    var welcomeContainerEl = $(".welcome-container");

    // Clear out old elements
    animalListEl.empty()
    welcomeContainerEl.empty();
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

        var animalSizeEl = $('<li>');
        animalSizeEl.text(animalData.animals[i].size);

        var animalUrlEl = $('<li>');
        var urlLinkEl = $('<a>');
        urlLinkEl.attr('href', animalData.animals[i].url);
        urlLinkEl.text("Link to Animal in Petfinder");
        animalUrlEl.append(urlLinkEl);

        //Append everything togther
        cardBodyEl.append(cardTitleEl);
        cardBodyEl.append(cardTextEl);
        cardBodyEl.append(animalAgeEl);
        cardBodyEl.append(animalSizeEl);
        cardBodyEl.append(animalUrlEl);
        animalBioEl.append(cardBodyEl);

        imgSection.append(imgEl);

        animalRowEl.append(imgSection);
        animalRowEl.append(animalBioEl);
        animalCardEl.append(animalRowEl);
        animalListEl.append(animalCardEl);
    }
}



petFinderFormEl.on("submit", function(event) {

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
    storeString = `${queryType}, ${queryAge}, ${querySize}`;

    // If Location is entered, combine the location and distance selected to query  
    // Making sure the user only enters a Postal Code of 5 digits in length
    if (!isNaN(parseInt($('#animal-location-input').val())) && ($('#animal-location-input').val().length == 5)) {
        queryString += `&location=${queryLocation}&distance=${queryDistance}`;
        storeString += `, ${queryLocation}, ${queryDistance}`;
    }

    console.log(`Query String: ${queryString}`);
    console.log(`Store String: ${storeString}`);

    searchPetfinderAPI();

});

var eventInput = "";

dropdownMenuEl.on('click', '.dropdown-item', function(event){

    event.preventDefault();
    event.stopPropagation();

    // Get query string from the chosen dropdown-item
    eventInput = $(this);
    queryString = eventInput.attr('data-query-str');
    storeString = eventInput.text();
    console.log(`Query String: ${queryString}`);
    console.log(`Store String: ${storeString}`);

    searchPetfinderAPI();
});

