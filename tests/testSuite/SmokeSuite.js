import http from 'k6/http';
import {check, sleep} from 'k6';

export const options = {
    vus: 5,
    iterations: 20,
    duration: '10s',
    executor: 'shared-iterations',

    thresholds: {
            http_req_duration: ['p(95)<1500'], // 95% of request must be completed within 1500ms
    }
}

let BASE_URL = "https://test-api.k6.io";
let USERNAME = "TestUser";
let PASSWORD = "SuperCroc2020"

export default function() {
    let response = http.get(BASE_URL+ "/public/crocodiles/");
  //  console.log("resonse code is " + response.status);
  let jsonData = response.json(); 
  check(response, {
    'Response status code is 200': (r) => r.status === 200,
    'Response array size is greater than 5': (r) => {
       // let jsonData = r.json(); // parse the response as JSON
        return jsonData.length > 5; // check if the array size is greater than 5
    }
});
    sleep(1);
    // Checking any GET Id API
    let randomIndex = Math.floor(Math.random() * jsonData.length); // get a random index
   // console.log("Random index: " + randomIndex)
    let getAnyResponse = http.get(BASE_URL+ "/public/crocodiles/"+ randomIndex);
 //   console.log("Resonse code is " + getAnyResponse.status);
    let jsonSingleGetData = getAnyResponse.json(); 
    check(getAnyResponse, {
      'Response status code of Single GET API is 200': (r) => r.status === 200,
      'Single crocodile is not throwing empty hashmap': (r) => {
        return Object.keys(jsonSingleGetData).length > 0;  // check if the keys are not empty
      }
  });
  sleep(1);
      // Checking any POST API
     let postResponse = http.post(BASE_URL+ "/auth/token/login/", {
      username: USERNAME,
      password: PASSWORD,
     });
     console.log("Resonse code is " + postResponse.status);
       let jsonPostResponse = postResponse.json(); 
       check(postResponse, {
         'Response status code of POST API is 200': (r) => r.status === 200,
         'Check no empty response': (r) => {
          return Object.keys(jsonPostResponse).length > 0;  // check if the keys are not empty
        }
     });
}