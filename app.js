/*WINDY 0.9.9 Beta*/

let userlocation = {
    autocomplete: false
};
let data;
var fetchedloc = [];

form = document.getElementById('subform');
form.addEventListener("click", function(){
    userlocation.type = 'Manual';
    userlocation.input = document.getElementById('inputloc').value;
    requestBack(userlocation);
    document.getElementById('search_form').reset();
});

function getGPSLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(geoloc, error);
    }
    else{
        alert("Geolocation is not supported by your browser.");
    }
}

function geoloc(position){
    userlocation.latitude = position.coords.latitude;
    userlocation.longitude = position.coords.longitude;
    userlocation.type= 'GPS';
    requestBack(userlocation);
}

function error(){
    alert("Unable to retrieve your location.");
}

async function autocompleteInput(text){        //getLocation feeds backend with user input and implements autocomplete.
    userlocation.input = text;
    userlocation.autocomplete = true;
    userlocation.type= 'Suggestions';
    const data = await requestBack(userlocation);
}

/*function requestBack2(location){
    let url = 'https://autocomplete.search.hereapi.com/v1/autocomplete?q='+ location.text + '&in=countryCode:IND&types=city&limit=4&apiKey=WjU2LPBQ7lrHN6GtqwhIbtfEPqr1ASjRLcdm0S7MC9s';
    fetch(url,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => console.log(res))
        .then(data => {
            fetchedloc = [];
            fetchedloc = fetchedloc.concat(data.city_data.items);
            console.log(fetchedloc);
        })
        .catch(error => console.log(error));
}*/


async function requestBack(location){
    let url = 'main.php';
    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(location)
    }).then(res => res.json())
        .then(async function(data){
            console.log(data);
            if(data.suggestions){
                await pushIntoArray(data);
            }
            else
                update(data);
        })
        .catch(error => console.log(error));
}

async function pushIntoArray(data){

    fetchedloc = [];
    let boxItems = [];
    data.city_data.items.forEach(function(array){
        boxItems.push(array.address.city);
    });
    fetchedloc = fetchedloc.concat(boxItems);
    console.log(fetchedloc);
}

function update(data){
    console.log(data);
    document.getElementById('state').innerHTML = data.current_data.weather[0].main;
    document.getElementById('city').innerHTML = data.current_data.name;
    document.getElementById('temp').innerHTML = Math.floor(data.current_data.main.temp) + "&#176;c";
    document.getElementById('wind_speed').innerHTML = Math.floor(data.current_data.wind.speed) + " kmph";
    document.getElementById('cloud_cover').innerHTML = data.current_data.clouds.all + " %";
    document.getElementById('pressure').innerHTML = data.current_data.main.pressure + " mb";
    document.getElementById('day_1').innerHTML = getWeekDay(data.forecast_data.daily[1].dt);
    document.getElementById('day_2').innerHTML = getWeekDay(data.forecast_data.daily[2].dt);
    document.getElementById('day_3').innerHTML = getWeekDay(data.forecast_data.daily[3].dt);
    document.getElementById('maxtemp_1').innerHTML = Math.floor(data.forecast_data.daily[0].temp.max) + "&#176;c";
    document.getElementById('maxtemp_2').innerHTML = Math.floor(data.forecast_data.daily[1].temp.max) + "&#176;c";
    document.getElementById('maxtemp_3').innerHTML = Math.floor(data.forecast_data.daily[2].temp.max) + "&#176;c";
    document.getElementById('mintemp_1').innerHTML = Math.floor(data.forecast_data.daily[0].temp.min) + "&#176;c";
    document.getElementById('mintemp_2').innerHTML = Math.floor(data.forecast_data.daily[1].temp.min) + "&#176;c";
    document.getElementById('mintemp_3').innerHTML = Math.floor(data.forecast_data.daily[2].temp.min) + "&#176;c";
    document.getElementById('state_1').innerHTML = data.forecast_data.daily[0].weather[0].main;
    document.getElementById('state_2').innerHTML = data.forecast_data.daily[1].weather[0].main;
    document.getElementById('state_3').innerHTML = data.forecast_data.daily[2].weather[0].main;
}

function getWeekDay(time){
    let weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let date = new Date(time * 1000);
    let day = date.getDay();
    console.log(date);
    return(weekday[day]);
}


async function autocomplete(inp) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input",async function(e) {

        /*changing border radius on expanding*/
        document.getElementById("inputloc").style.borderRadius = "18px 0 0 0";
        document.getElementById("subform").style.borderRadius = "0 18px 0 0";

        var a, b, i, val = this.value;
        await autocompleteInput(val);
        arr = fetchedloc;

        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);

        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      document.getElementById("inputloc").style.borderRadius = "13px 0 0 13px";
      document.getElementById("subform").style.borderRadius = "0 13px 13px 0";
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/

      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
      document.getElementById("inputloc").style.borderRadius = "13px 0 0 13px";
      document.getElementById("subform").style.borderRadius = "0 13px 13px 0";
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
      document.getElementById("inputloc").style.borderRadius = "13px 0 0 13px";
      document.getElementById("subform").style.borderRadius = "0 13px 13px 0";
  });
}

autocomplete(document.getElementById("inputloc"));