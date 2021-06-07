const { Base64 } = require("js-base64");
const axios = require("axios").default;
const config = require("config");
const qs = require("qs");

class KrogerAPI {


  constructor(clientId, clientSecret) {
    this.basicAuth = Base64.encode(clientId + ':' + clientSecret);
    this.baseURL = "https://api.kroger.com/v1/";
  }

  init() {
    // obtain OAuth token
    return new Promise((resolve, reject) => {
      axios.post(this.baseURL + "connect/oauth2/token", qs.stringify({
        grant_type: "client_credentials",
        scope: "product.compact"
      }), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${this.basicAuth}`,
        }
      })
      .then(({data}) => {
        // now set the API object
        this.api = axios.create({
          baseURL: this.baseURL,
          timeout: 5000,
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${data.access_token}`
          }
        });
        console.log(data.access_token);
        resolve("Obtained OAuth token");
      })
      .catch(e => {
        reject("Error: Failed to obtain OAuth token");
      });
    })
  }

  findProduct(searchTerm, limit) {
    return this.api.get("products", {
      params: {
        "filter.term": searchTerm,
        "filter.limit": limit,
        'filter.locationId': config.get("Kroger.locationId")
      }
    });
  }
};

module.exports = KrogerAPI;