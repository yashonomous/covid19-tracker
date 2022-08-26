import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  LineController,
  Title,
  TimeScale,
  Tooltip,
  Filler,
} from "chart.js";
import { diseaseShURLS } from "../common/diseaseShURLs";
import numeral from "numeral";
import "chartjs-adapter-moment";
import { useStateValue } from "../common/StateProvider";
import { CircularProgress } from "@material-ui/core";
import { actionTypes } from "../common/reducer";

const options = {
  elements: {
    line: {
      fill: "true",
    },
    point: {
      radius: 0,
    },
  },

  maintainAspectRatio: false,

  plugins: {
    tooltip: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: (tooltipItem, data) => {
          return numeral(tooltipItem.formattedValue).format("+0,0");
        },
      },
    },
  },

  scales: {
    x: {
      type: "time",
      time: {
        unit: "month",
        stepSize: 1,
        // format: "DD/MM/YY",
        tooltipFormat: "ll",
      },
    },

    y: {
      gridLines: {
        display: false,
      },
      ticks: {
        callback: (value, index, values) => {
          return numeral(value).format("0a");
        },
      },
    },
  },
};

const Graph = () => {
  ChartJS.register(
    LineController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    TimeScale,
    Tooltip,
    Filler
  );

  const [{ loading, clickedDataType, historicalData }, dispatch] =
    useStateValue();
  const [chartData, setChartData] = useState({});

  const mapToChartData = (data) => {
    let lastDataPoint =
      historicalData[clickedDataType][
        Object.keys(historicalData[clickedDataType])[0]
      ];
    let lineData = [];
    Object.keys(historicalData[clickedDataType]).forEach((d) => {
      lineData.push({
        x: d,
        y: historicalData[clickedDataType][d] - lastDataPoint,
        // z: data[clickedDataType][d],
      });

      //   console.log(data[casesType][d] - lastDataPoint);

      lastDataPoint = historicalData[clickedDataType][d];
    });

    const [, ...restLineData] = lineData;

    // console.log("rest", restLineData);

    return restLineData;
  };

  useEffect(() => {
    const getDataFor120Days = async () => {
      await fetch(diseaseShURLS.GET_HISTORICAL_URL)
        .then((resp) => resp.json())
        .then((respJson) => {
          //   console.log(respJson);
          // let mappedData = mapToChartData(respJson);
          // setHistoricalData(mappedData);

          dispatch({
            type: actionTypes.GET_HISTORICAL_DATA,
            historicalData: respJson,
          });
        });
    };

    if (!Object.keys(historicalData).length) getDataFor120Days();

    // if (Object.keys(historicalData).length) {
    //   //   console.log(mapToChartData(historicalData));
    //   setHistoricalData(mapToChartData(historicalData));
    // }

    // debugger;
    if (Object.keys(historicalData).length) setChartData(mapToChartData());
  }, [historicalData, clickedDataType]);

  return loading ? (
    <CircularProgress />
  ) : (
    <div className="graph">
      <Line
        type="line"
        options={options}
        data={{
          datasets: [
            {
              backgroundColor: "rgba(204, 16, 52, 0.5)",
              borderColor: "#CC1034",
              data: chartData,
              xAxisID: "x",
              yAxisID: "y",
              fill: true,
            },
          ],
        }}
      />
    </div>
  );
};

export default Graph;
