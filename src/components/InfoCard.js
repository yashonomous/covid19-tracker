import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import "../styles/InfoCard.css";
import { useStateValue } from "../common/StateProvider";
import { actionTypes } from "../common/reducer";

function InfoCard({ title, count, total }) {
  const [{ loading }, dispatch] = useStateValue();

  // useEffect(() => {
  //   dispatch({
  //     type: actionTypes.SWITCH_LOADER,
  //     loading: true,
  //   });
  // }, []);

  return (
    <div
      onClick={() => {
        // console.log({ title });
        dispatch({
          type: actionTypes.UPDATE_CLICKED_DATA_TYPE,
          clickedDataType: title,
        });
      }}
      className="infocard"
    >
      <Card className="infocard_card">
        <CardContent>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Typography color="textSecondary">{title}</Typography>
              <h1>{count}</h1>
              <Typography color="textSecondary">{total}</Typography>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default InfoCard;
