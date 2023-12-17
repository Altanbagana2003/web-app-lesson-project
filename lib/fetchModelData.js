var Promise = require("Promise");

const serverUrl = window.location.origin;

function fetchModel(url) {
  return new Promise(function (fulfill, reject) {
    fetch(serverUrl + url)
      .then((response) => {
        return response.json();
      })
      .then((responseObject) => {
        fulfill({ data: responseObject });
      })
      .catch((error) => {
        console.log(error);
        reject({ statusCode: 400, error: error.message });
      });
  });
}

export default fetchModel;
