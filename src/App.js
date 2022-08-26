import React, { useRef } from "react";
import {
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  Card,
  CardContent,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import "./App.css";
import { diseaseShURLS } from "./common/diseaseShURLs";
import InfoCard from "./components/InfoCard";
import Map from "./components/Map";
import { useStateValue } from "./common/StateProvider";
import { actionTypes } from "./common/reducer";
import Table from "./components/Table";
import Graph from "./components/Graph";

const App = () => {
  const [{ countries, worldwide, selectedCountryInfo, loading }, dispatch] =
    useStateValue();
  const [selectedCountry, setSelectedCountry] = useState("worldwide");

  useEffect(() => {
    let getCountries = async () => {
      await fetch(diseaseShURLS.GET_COUNTRIES_URL)
        .then((resp) => resp.json())
        .then((respJson) => {
          let countriesData = respJson.map((countryObj) => ({
            name: countryObj.country.toLowerCase(),
            iso2: countryObj.countryInfo.iso2
              ? countryObj.countryInfo.iso2
              : countryObj.country.toLowerCase(),
            flag: countryObj.countryInfo.flag,
            cases: countryObj.cases,
            todayCases: countryObj.todayCases,
            deaths: countryObj.deaths,
            todayDeaths: countryObj.todayDeaths,
            recovered: countryObj.recovered,
            todayRecovered: countryObj.todayRecovered,
            latitude: countryObj.countryInfo.lat,
            longitude: countryObj.countryInfo.long,
          }));
          dispatch({
            type: actionTypes.GET_COUNTRIES,
            countries: countriesData,
          });
          dispatch({
            type: actionTypes.SWITCH_LOADER,
            loading: false,
          });
        })
        .catch((err) => {
          alert(err.message);
        });
    };

    if (!countries.length) {
      getCountries();
    }

    // console.log(countries);
  }, [countries]);

  useEffect(() => {
    let getWorldWideData = async () => {
      await fetch(diseaseShURLS.GET_WORLDWIDE_URL)
        .then((resp) => resp.json())
        .then((respJson) => {
          dispatch({
            type: actionTypes.GET_WORLDWIDE,
            worldwideData: { ...respJson, latitude: 0, longitude: 0 },
          });

          dispatch({
            type: actionTypes.SET_SELECTED_COUNTRY,
            selectedCountryInfo: { ...respJson, latitude: 0, longitude: 0 },
          });

          dispatch({
            type: actionTypes.SWITCH_LOADER,
            loading: false,
          });
        });
    };

    if (!Object.keys(worldwide).length) {
      getWorldWideData();
    }
  }, [worldwide]);

  const handleSelectChange = ({ target }) => {
    setSelectedCountry(target.value);

    if (target.value === "worldwide") {
      // console.log("www", worldwide);
      dispatch({
        type: actionTypes.SET_SELECTED_COUNTRY,
        selectedCountryInfo: worldwide,
      });
    } else {
      dispatch({
        type: actionTypes.SET_SELECTED_COUNTRY,
        selectedCountryInfo: countries.filter(
          (country) => country.iso2 === target.value
        )[0],
      });
    }
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>covid-19 tracker</h1>
          <div className="app_headerDropDown">
            <FormControl variant="outlined" className="app__formControl">
              <InputLabel id="select-filled-label">country</InputLabel>
              <Select
                labelId="select-filled-label"
                value={selectedCountry}
                onChange={handleSelectChange}
                label={selectedCountry}
              >
                <MenuItem value="worldwide">worldwide</MenuItem>
                {countries.map((country, i) => (
                  <MenuItem key={country.iso2} value={country.iso2}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="app__infoContainer">
          <InfoCard
            title="cases"
            count={selectedCountryInfo.todayCases}
            total={selectedCountryInfo.cases}
          />
          <InfoCard
            title="recovered"
            count={selectedCountryInfo.todayRecovered}
            total={selectedCountryInfo.recovered}
          />
          <InfoCard
            title="deaths"
            count={selectedCountryInfo.todayDeaths}
            total={selectedCountryInfo.deaths}
          />
        </div>

        <div className="app__mapContainer">
          <Map selectedCountry={selectedCountryInfo} />
        </div>
      </div>

      <div className="app__right">
        <div className="app__countriesTable">
          <Card className="app__countriesTableCard">
            <CardContent>
              <Table />
            </CardContent>
          </Card>
        </div>
        <div className="app__countriesGraph">
          <Card className="app__countriesTableCard">
            <CardContent>
              <h3>worldwide new cases</h3>
              <Graph />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default App;
