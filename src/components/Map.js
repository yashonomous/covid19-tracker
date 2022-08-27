import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  LayersControl,
  Circle,
  LayerGroup,
} from "react-leaflet";
import L from "leaflet";
import "../styles/Map.css";
import iconMarker from "leaflet/dist/images/marker-icon.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { useStateValue } from "../common/StateProvider";
import { CircularProgress, Typography } from "@material-ui/core";
import { actionTypes } from "../common/reducer";

const RecenterAutomatically = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng]);
};

const icon = L.icon({
  iconRetinaUrl: iconRetina,
  iconUrl: iconMarker,
  shadowUrl: iconShadow,
});

function Map() {
  const [
    { countries, loading, clickedDataType, selectedCountryInfo },
    dispatch,
  ] = useStateValue();

  const [currCoordinates, setCurrCoordinates] = useState({});

  const [showLoader, setShowLoader] = useState(true);

  //   const map = useMap();

  useEffect(() => {
    const getCurrentLocationPromise = async () => {
      return new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 20000,
          enableHighAccuracy: true,
        })
      );
    };

    if (!Object.keys(currCoordinates).length) {
      getCurrentLocationPromise().then((pos) => {
        setCurrCoordinates({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });

        // dispatch({
        //   type: actionTypes.SWITCH_LOADER,
        //   loading: false,
        // });

        setShowLoader(false);
      });
    } else {
      setCurrCoordinates({
        latitude: selectedCountryInfo.latitude,
        longitude: selectedCountryInfo.longitude,
      });
    }

    // console.log(" select", selectedCountry);
  }, [selectedCountryInfo]);

  return showLoader ? (
    <>
      <CircularProgress />
      <Typography>fetching current location</Typography>
    </>
  ) : (
    <div className="map">
      {(currCoordinates.latitude !== null ||
        currCoordinates.latitude !== undefined) && (
        <MapContainer
          center={[currCoordinates.latitude, currCoordinates.longitude]}
          zoom={4}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution="Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}.png"
          />

          <Marker
            position={[currCoordinates.latitude, currCoordinates.longitude]}
            icon={icon}
          >
            <Popup>
              <div
                className="map__flag"
                style={{ backgroundImage: `url(${selectedCountryInfo.flag})` }}
              ></div>

              <h2>{selectedCountryInfo.name}</h2>
              <h3>cases : {selectedCountryInfo.cases}</h3>
            </Popup>
            <RecenterAutomatically
              lat={currCoordinates.latitude}
              lng={currCoordinates.longitude}
            />
          </Marker>

          <LayersControl position="topright">
            <LayersControl.Overlay checked name="show circles">
              <LayerGroup>
                {countries.map((country) => {
                  //   console.log(country[clickedDataType]);
                  //   console.log(country[clickedDataType]);
                  return (
                    <Circle
                      key={country.iso2}
                      center={[country.latitude, country.longitude]}
                      pathOptions={{
                        fillColor:
                          clickedDataType === "cases"
                            ? "blue"
                            : clickedDataType === "recovered"
                            ? "green"
                            : "red",
                        color:
                          clickedDataType === "cases"
                            ? "blue"
                            : clickedDataType === "recovered"
                            ? "green"
                            : "red",
                      }}
                      radius={
                        clickedDataType === "cases"
                          ? Math.sqrt(country[clickedDataType]) * 80
                          : clickedDataType === "recovered"
                          ? Math.sqrt(country[clickedDataType]) * 120
                          : Math.sqrt(country[clickedDataType]) * 400
                      }
                    >
                      <Popup>
                        <div
                          className="map__flag"
                          style={{
                            backgroundImage: `url(${country.flag})`,
                          }}
                        ></div>
                        <h2>{country.name}</h2>
                        {/* <h3>
                          {clickedDataType === "cases"
                            ? `cases : ${country.cases}`
                            : clickedDataType === "recovered"
                            ? `recovered : ${country.recovered}`
                            : `death : ${country.deaths}`}
                        </h3> */}
                        <h3>cases: {country.cases}</h3>
                        <h3>recovered: {country.recovered}</h3>
                        <h3>deaths: {country.deaths}</h3>
                      </Popup>
                    </Circle>
                  );
                })}
              </LayerGroup>
            </LayersControl.Overlay>
          </LayersControl>
        </MapContainer>
      )}
    </div>
  );
}

export default Map;
