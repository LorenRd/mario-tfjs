import { createStore, combineReducers } from "redux";
import DataReducer from "./reducers/DataReducer";

const reducers = combineReducers({
    DataReducer
});

const store = createStore(
    reducers, 
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
