import { createStore, combineReducers } from "redux";
import DataReducer from "./reducers/DataReducer";
import CameraReducer from "./reducers/CameraReducer";

const reducers = combineReducers({
    DataReducer,
    CameraReducer
});

const store = createStore(
    reducers, 
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
