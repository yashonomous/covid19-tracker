export const initialState = {
  countries: [],
  worldwide: {},
  historicalData: {},
  selectedCountryInfo: {},
  clickedDataType: "cases",
  loading: true,
};

export const actionTypes = {
  GET_COUNTRIES: "GET_COUNTRIES",
  GET_WORLDWIDE: "GET_WORLDWIDE",
  GET_HISTORICAL_DATA: "GET_HISTORICAL_DATA",
  SET_SELECTED_COUNTRY: "SET_SELECTED_COUNTRY",
  SWITCH_LOADER: "SWITCH_LOADER",
  UPDATE_CLICKED_DATA_TYPE: "UPDATE_CLICKED_DATA_TYPE",
};

const reducer = (state, action) => {
  //   console.log(action);
  switch (action.type) {
    case actionTypes.GET_COUNTRIES:
      return { ...state, countries: action.countries };
    case actionTypes.GET_WORLDWIDE:
      return { ...state, worldwide: action.worldwideData };
    case actionTypes.GET_HISTORICAL_DATA:
      return { ...state, historicalData: action.historicalData };
    case actionTypes.SET_SELECTED_COUNTRY:
      return { ...state, selectedCountryInfo: action.selectedCountryInfo };
    case actionTypes.SWITCH_LOADER:
      return { ...state, loading: action.loading };
    case actionTypes.UPDATE_CLICKED_DATA_TYPE:
      return { ...state, clickedDataType: action.clickedDataType };
    default:
      return state;
  }
};

export default reducer;
