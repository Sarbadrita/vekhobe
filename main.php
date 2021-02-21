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

    function controller(){
        global $location;
        $data = new container();
        $HERE_token = 'WjU2LPBQ7lrHN6GtqwhIbtfEPqr1ASjRLcdm0S7MC9s';
        $OW_token1 = '78efbbfe58c206cf2460d629fecb4642';
        $OW_token2 = '87b8164bb5be61f3bd485f8ec4d90809';
        if($location['type'] == 'Suggestions'){
            $data->city_data = json_decode(file_get_contents('https://autocomplete.search.hereapi.com/v1/autocomplete?q='.$location['input'].'&in=countryCode:IND&types=city&limit=4&apiKey='.$HERE_token), true);
            $data->suggestions = true;
            updateView($data);
        }
        elseif($location['type'] == 'GPS'){
            $data->current_data = json_decode(file_get_contents('http://api.openweathermap.org/data/2.5/weather?lat='.$location['latitude'].'&lon='.$location['longitude'].'&units=metric&appid='.$OW_token1), true);
            $data->forecast_data = json_decode(file_get_contents('http://api.openweathermap.org/data/2.5/onecall?lat='.$location['latitude'].'&lon='.$location['longitude'].'&exclude=current,minutely,hourly,alerts&units=metric&appid='.$OW_token2), true);
            updateView($data);
        }
        elseif(1){
            $temp_data = json_decode(file_get_contents('https://geocode.search.hereapi.com/v1/geocode?q='.$location['input'].'&in=countryCode:IND&types=city&limit=4&apiKey='.$HERE_token),true);
            $lat = $temp_data['items'][0]['position']['lat'];
            $lng = $temp_data['items'][0]['position']['lng'];
            $data->current_data = json_decode(file_get_contents('http://api.openweathermap.org/data/2.5/weather?lat='.$lat.'&lon='.$lng.'&units=metric&appid='.$OW_token1), true);
            $data->forecast_data = json_decode(file_get_contents('http://api.openweathermap.org/data/2.5/onecall?lat='.$lat.'&lon='.$lng.'&exclude=current,minutely,hourly,alerts&units=metric&appid='.$OW_token2), true);
            updateView($data);
        }
    }

    controller();

