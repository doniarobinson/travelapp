import React from "react";
import axios from "axios";
import Card from "./Card";

export default function Form() {
  type RadioProps = {
    locName: string;
    coordinates: string;
  };

  type ResultsProps = {
    name: string;
    vicinity: string;
    rating: string;
  };

  const [location, setLocation] = React.useState("");
  const [keywords, setKeywords] = React.useState("");
  const [message, setMessage] = React.useState("");
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

  const validateLocationInput = (coordinates: string) => {
    // we'll likely want to do even more validation than this, so let's abstract this out
    if (!coordinates.includes(",")) {
      return false;
    }
    return true;
  };

  const makeApiCall = () => {
    const coordinates = location.replace(" ", "");

    // fully qualified domain name is in package.json as proxy to handle CORS issues
    const url = `/maps/api/place/nearbysearch/json?q=proxy&location=${coordinates}&keyword=${keywords}&radius=1500&key=AIzaSyDIb6tuC5IBX5yf8pYBMs_hLkZicqDHZ9k`;

    const config = {
      method: "get",
      url: url,
      headers: {},
    };

    axios(config)
      .then((res) => {
        setMessage("");
        // only keep 20 results
        let apiResults = res.data.results.slice(0, 20);
        // update results state variable
        setResults(apiResults);
        if (apiResults.length === 0) {
          setMessage(
            "There were no results for that search. Please try again."
          );
        }
      })
      .catch(function (error) {
        displayError(
          "Something went wrong in retrieving the information. Please try again."
        );
        console.log(error);
      });
  };

  const displayError = (msg: string) => {
    setMessage(msg);
    // lets clear out the results so it's not confusing to the user
    setResults([]);
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let coordinates = event.target.value;
    setLocation(coordinates);
  };

  const handleKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeywords(event.target.value);
  };

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (!validateLocationInput(location)) {
      displayError("The location you entered is not valid. Please try again.");
    } else {
      makeApiCall();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <section className="searchForm">
          <div className="locationContainer">
            <h2>Select a Location</h2>
            <div className="locationList">
              {locations.map(({ locName, coordinates }: RadioProps) => (
                <div className="locationItem" key={coordinates}>
                  <label>
                    <input
                      type="radio"
                      name="locationInput"
                      key={coordinates}
                      value={coordinates}
                      checked={location === coordinates}
                      onChange={handleLocationChange}
                    />
                    {locName}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="keywordContainer">
            <h2>Search</h2>
            <input
              type="text"
              name="keyword"
              aria-label="keywordSearch"
              placeholder="hiking"
              onChange={handleKeywordChange}
            />
            <input type="submit" value="Search" className="submitBtn" />
          </div>
        </section>
      </form>

      <span className="message">{message}</span>
      <div className="resultsContainer">
        {results.map(({ name, vicinity, rating }: ResultsProps) => (
          <Card name={name} vicinity={vicinity} rating={rating} />
        ))}
      </div>
    </>
  );
}
