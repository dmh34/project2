var axios = require('axios');


class FlightsService {
    constructor(apikey) {
        this.API_KEY = apikey;
    }

    /**
     * Pre-Condition: params must be an array.
     * 
     * @param {Object} params 
     *  Accepts an objects two properties, dest and home
     * @returns An Array of objects. Returns an empty array if there are no results.
     */
    async MakeAPICall(params) {
        try {
            if (!Array.isArray(params)) throw "Invaild params";

            //get iataCode for city
            let arrivalAirport = await axios.get("http://aviation-edge.com/v2/public/autocomplete?key=" + this.API_KEY + "&city=" + params.dest);

            let departureAirport = await axios.get("http://aviation-edge.com/v2/public/autocomplete?key=" + this.API_KEY + "&city=" + params.home);

            //get timetable for flights
            let flights = await axios.get(" http://aviation-edge.com/v2/public/timetable?key=" + this.API_KEY + "&iataCode=" + arrivalAirport.data.cities[0].codeIataCity + "&type=departure");

            let requestedFlights = [];

            for (let i = 0; i < flights.data.length; i++) {
                let arrival = flights.data[i].arrival;
                //filter departures for destination 
                if (arrival.iataCode === arrivalAirport.data.cities[0].codeIataCity && flights.data[i].status === "scheduled") {
                    requestedFlights.push(flights.data[i]);
                }
            }

            return requestedFlights;
        } catch (err) {
            console.log("error");
            console.log(err);

        }
    }
}

/**
 * Creates the api object.
 * @param {String} apikey 
 * 
 */
function CreateAPI(apikey) {
    return new API(apikey);
}

module.exports = CreateAPI; 