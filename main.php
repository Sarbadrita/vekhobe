<?php

    $location = json_decode(file_get_contents("php://input"), true);

    class container{
        public $forecast_data = array();
        public $current_data = array();
    }

    function updateView($data){
        echo json_encode($data);
    }

    function controller(){
        global $location;
        $data = new container();
        if($location['type'] == 'GPS'){
            $data->current_data = json_decode(file_get_contents('http://api.openweathermap.org/data/2.5/weather?lat='.$location['latitude'].'&lon='.$location['longitude'].'&appid=78efbbfe58c206cf2460d629fecb4642&units=metric'), true);

            $data->forecast_data = json_decode(file_get_contents('http://api.openweathermap.org/data/2.5/onecall?lat='.$location['latitude'].'&lon='.$location['longitude'].'&exclude=current,minutely,hourly,alerts&appid=87b8164bb5be61f3bd485f8ec4d90809&units=metric'), true);
        }
        else{

        }
        updateView($data);
    }

    controller();

