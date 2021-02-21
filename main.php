<?php

    $location = json_decode(file_get_contents("php://input"), true);

    class container{
        public $forecast_data = array();
        public $current_data = array();
        public $city_data = array();
        public $suggestions = false;
    }

    function updateView($data){
        echo json_encode($data);
    }

    /*function HEREApi($url){
        $curl = curl_init($url);
        curl_setopt($curl,CURLOPT_RETURNTRANSFER,true);
        curl_setopt($curl, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json'
        ]);
        $result = json_decode(curl_exec($curl),true);
        echo $result;
        return $result;
    }*/

    function updateSuggestions($city_data){
        echo $data;
    }

    function controller(){
        global $location;
        $data = new container();
        $token = 'WjU2LPBQ7lrHN6GtqwhIbtfEPqr1ASjRLcdm0S7MC9s';
        if($location['type'] == 'Manual'){
            $data->city_data = json_decode(file_get_contents('https://autocomplete.search.hereapi.com/v1/autocomplete?q='.$location['input'].'&in=countryCode:IND&types=city&limit=4&apiKey='.$token), true);
            $data->suggestions = true;
            echo json_encode($data);
        }
        if($location['type'] == 'GPS'){
            $data->current_data = json_decode(file_get_contents('http://api.openweathermap.org/data/2.5/weather?lat='.$location['latitude'].'&lon='.$location['longitude'].'&appid=78efbbfe58c206cf2460d629fecb4642&units=metric'), true);
            $data->forecast_data = json_decode(file_get_contents('http://api.openweathermap.org/data/2.5/onecall?lat='.$location['latitude'].'&lon='.$location['longitude'].'&exclude=current,minutely,hourly,alerts&appid=87b8164bb5be61f3bd485f8ec4d90809&units=metric'), true);
            updateView($data);
        }
        else{

        }
    }

    controller();

