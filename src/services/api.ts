const axios = require('axios')

export const api = axios.create({
    //baseURL: 'http://localhost:5001/radioapi-b7bc5/us-central1/radioAPI'        //dev
    baseURL: 'https://us-central1-radioapi-b7bc5.cloudfunctions.net/radioAPI' //prod
})

