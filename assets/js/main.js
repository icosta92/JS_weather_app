$(document).ready(function() {
  $(".search").val("");
  $(".search").focus();
});

const API_KEY = "f255015b7323ccb82c1b4a71b0a9f996"
const UNITS = "metric" // TODO: Check what the user selected and pass it to the url
const LANG = "it"
const URL_ICON = "http://openweathermap.org/img/wn/"
const X_ICON = "@2x.png"
//const URL =

$(".search").on("change keyup paste", function() {
  let SEARCH_TERM = $(".search").val();
  const SEARCH_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${SEARCH_TERM}&units=${UNITS}&lang=${LANG}&appid=${API_KEY}`

  if (!SEARCH_TERM && !LAT && !LOG) {
    $(".custom-field input").removeClass("is-loading");
  }
  takeData(SEARCH_URL);
});

$(".submit").click(function() {

  document.getElementById("search").value = "";

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(searchPosition);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  function searchPosition(position) {
    const LAT = position.coords.latitude;
    const LON = position.coords.longitude;
    const SUBMIT_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=${UNITS}&lang=${LANG}&appid=${API_KEY}`
    takeData(SUBMIT_URL);
  }

  getLocation();
});

function takeData(file) {
  $.getJSON(file, function(res) {
    if (res) {
      $(".custom-field input").addClass("is-loading");
      document.getElementById("weather_location").innerHTML = "@" + res['city']['name'] + ", " + res['city']['country'];
      let today = res.list[0];
      document.getElementById("weather_temperature").innerHTML = today.main.temp.toFixed() + "°C";
      document.getElementById("weather_pression").innerHTML = "pressione : " + today['main']['pressure'] + " mbar";
      document.getElementById("weather_humidity").innerHTML = "umidità : " + today['main']['humidity'] + "%";
      document.getElementById("weather_cloudy").innerHTML = "nuvolosità : " + today['clouds']['all'] + "%";
      let weather = today.weather[0];
      document.getElementById("weather_description").innerHTML = weather.description;
      $("#icon_day0").attr("src", URL_ICON + weather["icon"] + X_ICON);
      $("#icon_day0").attr("width", 70);
      $("#icon_day0").attr("heighth", 70);

      for (let i = 1; i < 5; i++) {
        let k = i * 8;
        let list = res.list[k];
        document.getElementById("temp_day" + i).innerHTML = list.main.temp.toFixed() + "°C";
        let weather = list.weather[0];
        $("#icon_day" + i).attr("src", URL_ICON + weather["icon"] + X_ICON);
      }
      $(".custom-field input").removeClass("is-loading");
    } else {
      $(".custom-field input").addClass("is-loading");
    }
  });
}

function dayOftheWeek(day) {
  switch (day) {
    case 0: return("Domenica");
    case 1: return("Lunedì");
    case 2: return("Martedì");
    case 3: return("Mercoledì");
    case 4: return("Giovedì");
    case 5: return("Venerdì");
    case 6: return("Sabato");
      break;
  }
}

function monthOftheYear(month) {
  switch (month) {
    case 0: return("Gennaio");
    case 1: return("Febbraio");
    case 2: return("Marzo");
    case 3: return("Aprile");
    case 4: return("Maggio");
    case 5: return("Giugno");
    case 6: return("Luglio");
    case 7: return("Agosto");
    case 8: return("Settembre");
    case 9: return("Ottobre");
    case 10: return("Novembre");
    case 11: return("Dicembre");
      break;
  }
}

let date = new Date();
let giorno = date.getDate();
let mese = monthOftheYear(date.getMonth());
let anno = date.getFullYear();
let data = giorno + " " + mese + " " + anno;

document.getElementById("weather_date").innerHTML = data;
for (let i = 0; i < 5; i++) {
  document.getElementById("day" + i).innerHTML = dayOftheWeek(date.getDay() + i);
}

document.getElementById("copyright").innerHTML = new Date().getFullYear();
