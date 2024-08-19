import { createStore } from "redux";

const Reducer = (state = [], action) => {
  switch (action.type) {
    case "insertData":
      return [...action.payload];
    case "clearData":
      return [];
    default:
      return state;
  }
};

const tenantDetailsStore = createStore(Reducer);

export default tenantDetailsStore;
