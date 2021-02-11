<?php

    $location = json_decode(file_get_contents("php://input"), true);
    $current_data;
    $forecast_data;

    function updateView(){
        global $forecast_data;
        global $current_data;
        echo json_encode($forecast_data);
    }

    function controller(){
        global $location;
        global $current_data;
        global $forecast_data;
        if($location['type'] == 'GPS'){
            $current_data = json_decode(file_get_contents('http://api.openweathermap.org/data/2.5/weather?lat='.$location['latitude'].'&lon='.$location['longitude'].'&appid=78efbbfe58c206cf2460d629fecb4642&units=metric&cnt=24'), true);

            $forecast_data = json_decode(file_get_contents('http://api.openweathermap.org/data/2.5/forecast?lat='.$location['latitude'].'&lon='.$location['longitude'].'&appid=87b8164bb5be61f3bd485f8ec4d90809&units=metric&cnt=24'), true);

        }
        else{

        }
        updateView();
    }

    controller();

