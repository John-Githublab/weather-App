// variable dec;lare
const mainIcon = document.querySelector(".main__icon");
const mainForecast = document.querySelector(".main__forecast");
const mainPlace = document.querySelector(".main__place");
const mainTime = document.querySelector(".main__timedate");
const mainDegree = document.querySelector(".main__degree");
const cloudy = document.querySelector("#cloudy");
const humidity = document.querySelector("#humidity");
const wind = document.querySelector("#wind");
const search = document.querySelector(".data__search");
const famousLocation = document.querySelector(".data__flocation");
const body = document.querySelector("#body");
const time = document.querySelector(".main__timedate");
body.style.opacity = 0;
let dayWeek = function (day) {
  switch (day) {
    case 0:
      return "sunday";
    case 1:
      return "monday";
    case 2:
      return "tuesday";
    case 3:
      return "wednesday";
    case 4:
      return "thursday";
    case 5:
      return "friday";
    case 6:
      return "saturday";
  }
};

//function area
let dateUpdate = function (todaydate) {
  let date = new Date(todaydate);
  console.log(todaydate);
  let today = dayWeek(date.getDay());
  let time = date.toLocaleTimeString();
  let dateNumber = date.getDate();

  dateNumber = dateNumber < 10 ? `0${dateNumber} ` : dateNumber;

  // am or pm check if time <12 its am other is pm
  let amORpm = time < 12 ? "am" : "pm";
  //time = time.slice(0, 2) > 12 ? time.slice(0, 2) - 12 : time;
  var hrs = time.slice(0, 2);
  if (time.slice(0, 2) > 12) {
    var hrs = time.slice(0, 2) - 12;
  }
  var sec = time.slice(3, 5);
  time = hrs + ":" + sec;
  let todaysdatetime = `${time} - ${today},${dateNumber}`;
  console.log(todaysdatetime);
  return todaysdatetime;
};
// update ui
let weatherUI = function (day, weather) {
  if (day) {
    if (weather === "Mist")
      body.style.backgroundImage = `url(https://images.unsplash.com/photo-1543968996-ee822b8176ba?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1528&q=80)`;
    if (weather === "Moderate rain")
      body.style.backgroundImage = `url(https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80)`;
  }
  if (!day) {
    if (weather === "Clear")
      body.style.backgroundImage = `url(https://images.unsplash.com/photo-1572162522099-7a0c28d7691b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80)`;
  }
};
let updateUI = function (prom) {
  search.focus();
  prom.then((val) => {
    console.log(val);
    let weather = val.current.condition.text;
    let day = val.current.is_day;
    body.setAttribute("style", "opacity: 1");
    weatherUI(day, weather);

    let todaysDate = dateUpdate(val.location.localtime);
    mainIcon.setAttribute("src", val.current.condition.icon);
    time.textContent = todaysDate;
    mainForecast.textContent = val.current.condition.text;
    mainPlace.textContent = val.location.name;
    mainDegree.textContent = `${val.current.temp_c}`;
    cloudy.textContent = `${val.current.cloud}%`;
    humidity.textContent = `${val.current.humidity}%`;
    wind.textContent = `${val.current.wind_degree}%`;
    // resetting everything
    search.value = "";
  });
};

let fetchMethod = function (userInput) {
  let prom = fetch(
    `https://api.weatherapi.com/v1/current.json?key=344e04bdc4154bccbde102217220406&q=${userInput}&aqi=no`
  );
  prom.then((val) => {
    if (!val.ok) return;
    // only update UI if the data is available
    updateUI(val.json());
  });
};

search.addEventListener("keypress", (e) => {
  if (e.key !== "Enter") return;
  // get the input data and pass to fetch method
  let inputData = search.value.toLowerCase();
  fetchMethod(inputData);
});

famousLocation.addEventListener("click", function (e) {
  let targetlocation = e.target;
  if (!targetlocation.classList.contains("data__famousplace")) return;
  // else we need to find the text n d pass to props
  fetchMethod(targetlocation.textContent);
});

// finding the location using navigator bom

// starting function
let start = function () {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      // fetching the coords fro position object
      let { latitude, longitude } = position.coords;
      //  fetching from coords
      let prom =
        fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=ab0d0f5bad02442da6d0dfcd3fb7afe5
        `);
      let prom2 = await prom;
      let promjson = await prom2.json();
      let [userDestination] = promjson.results;
      fetchMethod(userDestination.city);
    },
    () => {
      fetchMethod("india");
      console.log("error");
    }
  );
};

start();
