import { createStore, combineReducers } from "redux";
import DataReducer from "./reducers/DataReducer";

const reducers = combineReducers({
    DataReducer
});

const store = createStore(reducers, {});

export default store;
