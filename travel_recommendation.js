var searchInput = document.getElementById("search-input");
var searchButton = document.getElementById("search-button");
var clearButton = document.getElementById("clear-button");
var searchResults = document.getElementById("search-results");

var homeDiv = document.getElementById("home");

var timezoneSelect = document.getElementById("time-zone-select");
var timezoneInfo = document.getElementById("time-zone-info");
var currentTime = document.getElementById("current-time");

var timezonesMap = new Map();
timezonesMap.set("LT", "Local Time");
timezonesMap.set("UTC", "Coordinated Universal Time");
timezonesMap.set("Pacific/Honolulu", "Hawaii Standard Time");
timezonesMap.set("America/Phoenix", "Mountain Standard Time");
timezonesMap.set("America/Cancun", "Eastern Standard Time");
timezonesMap.set("America/Sao_Paulo", "Brasília Time");
timezonesMap.set("Asia/Kolkata", "India Standard Time");
timezonesMap.set("Asia/Bangkok", "Indochina Time");
timezonesMap.set("Asia/Tokyo", "Japan Standard Time");
timezonesMap.set("Australia/Sydney", "Australian Eastern Standard Time");

var currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
console.log(currentTimezone);
var selectedTime = new Date().toLocaleTimeString("en-US", { timeZone: currentTimezone });


timezoneInfo.innerHTML = `${timezonesMap.get(timezoneSelect.value)}`;
console.log(timezoneSelect.value);
currentTime.innerHTML = `Current Time: ${selectedTime}`;

fetch("travel_recommendation_api.json")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        var theData = Object.values(data);
        console.log(theData);

        var countriesArr = data.countries.reduce((acc, country) => {
            // push returns the new length of the array, so we can't use it to build our new array of country names, since we need to return the array itself, not the new length of the array
            // acc.push(country.name.toLowerCase());
            // fastest parformance, but mutates the original array, which is not ideal in functional programming
            // return acc;
            
            // concat returns a copy of the original array with the new value added to the end of the array
            // return acc.concat(country.name.toLowerCase());
            
            // creates a new array with the country name added to the end of the array, then returns that new array, which is then used as the accumulator (initially empty) for the next iteration of the reduce function
            return [...acc, country.name.toLowerCase()];
        }, []);
        console.log(countriesArr);

        // make a new array of places (e.g. cities, temples, beaches, etc.)
        var placesArr = []
            .concat(data.countries.map(country => country.cities.map(city => city)).flat())
            .concat(data.temples.map(temple => temple))
            .concat(data.beaches.map(beach => beach))
            .concat(data.biomes.map(biome => biome));
        console.log(placesArr);
        
        // make a new array of place names, which will be used to determine if the search query is a specific place name
        var placesNames = placesArr.map(place => place.name.toLowerCase());
        console.log(placesNames);

        searchButton.addEventListener("click", () => {
            // convert the search input to lowercase to make the search case-insensitive (use trim to remove surrounding whitespaces, or else an empty input will result in all the places listed)
            var query = searchInput.value.toLowerCase().trim();
            // leave results blank for now
            var results;
            /*
                determine the results based on the search query
                if the search query is "country" or "countries", then the results should be all the cities in all the countries
                if the search query is a specific country name, then the results should be all the cities in that country
                if the search query is "temple" or "temples", then the results should be all the temples
                if the search query is "beach" or "beaches", then the results should be all the beaches
                if the search query is a specific place name, then the results should be all the places that include that name in their name
                otherwise, there are no results to display
            */
            if (["country", "countries", "city", "cities"].includes(query)) {
                results = data.countries.map(country => country.cities).flat();
            } else if (countriesArr.includes(query)) {
                // since filter returns an array, we need to access the first element of the array to get the country object, then we can access the cities property of that object
                results = data.countries.filter(country => country.name.toLowerCase() === query)[0].cities;
                // console.log(results, results.cities);
            } else if (["temple", "temples"].includes(query)) {
                results = data.temples;
            } else if (["beach", "beaches"].includes(query)) {
                results = data.beaches;
            } else if (["biome", "biomes"].includes(query)) {
                results = data.biomes;
            } else if (placesNames.some(name => name.includes(query))) {
                // results = data.countries.reduce((acc, country) => {
                //     var matchingCities = country.cities.filter(city => city.name.toLowerCase().split(',')[0].includes(query));
                //     return [...acc, ...matchingCities];
                // }, []);

                // use && query.length > 0 to prevent the search results from showing all the places when the search input is empty, since an empty string is included in every string, which would cause all the places to be included in the search results when the search input is empty
                results = placesArr.filter(place => place.name.toLowerCase().includes(query) && query.length > 0);
                console.log(results);
            } else {
                results = [];
            }

            // after the results have been determined, display them onto the webpage, if there are results to display, otherwise display a message indicating that no results were found, or that the search input cannot be empty
            searchResults.innerHTML = (results.length > 0) ? 
            results.map(item => `
                <div style="border: 1px solid #ccc; border-radius: 8px; padding: 16px; text-align: center; width: 300px;">
                    <img src="${item.imageUrl}" alt="${item.name}" style="width: 300px; height: 200px; object-fit: cover;">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                </div>
            `).join("") 
            : (query.length != "") ? 
            "No results found! Please try a destination."
            : "Search bar cannot be empty! Please enter a destination.";

            // homeDiv.removeAttribute("visible");
            // homeDiv.setAttribute("visibility", "hidden");

            // hide the home div when search results are displayed
            homeDiv.style.display = "none";
        });

        // when user clicks on the clear button, clear the search input and the search results, and show the home div again
        clearButton.addEventListener("click", () => {
            searchInput.value = "";
            searchResults.innerHTML = "";

            // homeDiv.removeAttribute("hidden");
            // homeDiv.setAttribute("visibility", "visible");

            //show the home div when the search results are cleared
            homeDiv.style.display = "block";
        });

        // when the user selects a different timezone from the dropdown, update the selected time and the timezone information displayed on the webpage
        timezoneSelect.addEventListener("change", () => {
            var selectedTimezone = (timezoneSelect.value !== "LT") ? timezoneSelect.value : undefined;
            var selectedTime = new Date().toLocaleTimeString("en-US", { timeZone: selectedTimezone });
            currentTime.innerHTML = `Current Time: ${selectedTime}`;
            timezoneInfo.innerHTML = `${(!selectedTimezone) ? "Local Time" : timezonesMap.get(selectedTimezone)}`;
        });
    })
    .catch(error => {
        console.log(error);
        alert("An error occurred while fetching the data. Please try again later.");
    });