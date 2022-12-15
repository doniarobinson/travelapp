import React from "react";
import axios from "axios";

export default function Form() {
  type RadioProps = {
    locName: string;
    coordinates: string;
  };

  type ResultsProps = {
    name: string;
    address: string;
    rating: string;
  };

  const [locState, setLocation] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [results, setResults] = React.useState([]);
  const locations = [
    { locName: "Snowmass, CO", coordinates: "39.2130, -106.9378" },
    { locName: "Malibu, CA", coordinates: "34.0259, -118.7798" },
    { locName: "Catskill, NY", coordinates: "42.2146, -73.9595" },
    {
      locName: "Grand Teton National Park, WY",
      coordinates: "43.7904, -110.6818",
    },
    { locName: "Columbia River Gorge, OR", coordinates: "45.7253, -121.7300" },
    { locName: "Broken Coordinatesville, USA", coordinates: "35.000" },
  ];

  const restOfUrl = "/maps/api/place/nearbysearch/json?q=proxy";
  const apiKey = "AIzaSyDIb6tuC5IBX5yf8pYBMs_hLkZicqDHZ9k";

  const validateLocationInput = (coordinates: string) => {
    // we'll likely want to do even more validation than this, so let's abstract this out
    if (!coordinates.includes(",")) {
      return false;
    }
    return true;
  };

  const displayError = (errorMsg: string) => {
    setErrorMessage(errorMsg);
    // lets clear out the results so it's not confusing to the user
    setResults([]);
  };

  const onFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    let searchParam = "location";

    // turn into switch if form gets bigger
    if (event.target.name.includes(searchParam)) {
      // change radio button value
      setLocation(value);
      if (!validateLocationInput(value)) {
        displayError(
          "The location you entered is not valid. Please try again."
        );
        return;
      }
      // remove the space from the location
      value = value.replace(" ", "");
    } else {
      //setKeywords(value);
    }

    const url = `${restOfUrl}&${searchParam}=${value}&radius=1500&key=${apiKey}`;
    console.log(url);

    // fully qualified domain name is in package.json as proxy to handle CORS issues
    const config = {
      method: "get",
      url: url,
      headers: {},
    };

    axios(config)
      .then((res) => {
        setErrorMessage("");
        // only keep 20 results
        let apiResults = res.data.results.slice(0, 20);
        // update results state variable
        setResults(apiResults);
      })
      .catch(function (error) {
        displayError(
          "Something went wrong in retrieving the information. Please try again."
        );
        console.log(error);
      });
  };

  return (
    <>
      <form>
        <section className="searchForm">
          <div className="locationContainer">
            <h2>Select a Location</h2>
            <div className="locationList">
              {locations.map(({ locName, coordinates }: RadioProps) => (
                <div className="location" key={coordinates}>
                  <label>
                    <input
                      type="radio"
                      name="locationInput"
                      key={coordinates}
                      value={coordinates}
                      checked={locState === coordinates}
                      onChange={onFormChange}
                    />
                    {locName}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="keywordContainer">
            <h2>Search</h2>
            <input type="text" name="keyword" onChange={onFormChange} />
          </div>
        </section>
      </form>

      <span className="errorMessage">{errorMessage}</span>
      <div className="resultsContainer">
        {results.map(({ name, address, rating }: ResultsProps) => (
          <p>{name}</p>
        ))}
      </div>
    </>
  );
}
