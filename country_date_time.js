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

// when the user selects a different timezone from the dropdown, update the selected time and the timezone information displayed on the webpage
timezoneSelect.addEventListener("change", () => {
    var selectedTimezone = (timezoneSelect.value !== "LT") ? timezoneSelect.value : undefined;
    var selectedTime = new Date().toLocaleTimeString("en-US", { timeZone: selectedTimezone });
    currentTime.innerHTML = `Current Time: ${selectedTime}`;
    timezoneInfo.innerHTML = `${(!selectedTimezone) ? "Local Time" : timezonesMap.get(selectedTimezone)}`;
});

// update the current time every second
setInterval(() => {
    var selectedTimezone = (timezoneSelect.value !== "LT") ? timezoneSelect.value : undefined;
    var selectedTime = new Date().toLocaleTimeString("en-US", { timeZone: selectedTimezone });
    currentTime.innerHTML = `Current Time: ${selectedTime}`;
}, 1000);

var travelNowButton = document.getElementById("travel-now");
travelNowButton.addEventListener("click", () => {
    window.location.href = "book_now.html";
});

function bookNow() {
    window.location.href = "book_now.html";
}