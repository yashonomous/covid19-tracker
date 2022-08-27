import { CircularProgress } from "@material-ui/core";
import numeral from "numeral";
import React from "react";
import { useStateValue } from "../common/StateProvider";
import "../styles/Table.css";

function Table() {
  const [{ countries, loading }] = useStateValue();
  // const [sortedCountries, ]

  return loading ? (
    <CircularProgress />
  ) : (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Cases</th>
          </tr>
        </thead>

        <tbody>
          {[...countries]
            .sort((c1, c2) => (c1.cases > c2.cases ? -1 : 1))
            .map((country) => (
              <tr key={country.iso2}>
                <td>{country.name}</td>
                <td>{numeral(country.cases).format("0,0")}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
