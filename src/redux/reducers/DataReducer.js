import * as knnClassifier from "@tensorflow-models/knn-classifier";

import { type as SET_MODEL } from "../actions/setModel";
import { type as SET_MODEL_TYPE } from "../actions/setModelType";
import { type as SET_PLAYING } from "../actions/setPlaying";
import { type as SET_PREDICTION } from "../actions/setPrediction";
import { type as SHOW_ALERT } from "../actions/showAlert";
import { type as ALERT_FINISHED } from "../actions/alertFinished";

const defaultState = {
    modelType: null,
    model: null,
    classifier: knnClassifier.create(),
    playing: false,
    prediction: "None",
    predictionProb: 0,
    severity: "success",
    message: "",
};

const reducer = (state = defaultState, { type, payload }) => {

    switch (type) {
        case SET_MODEL:
            return {
                ...state,
                model: payload
            };
        case SET_MODEL_TYPE:
            return {
                ...state,
                modelType: payload
            };
        case SET_PLAYING:
            return {
                ...state,
                playing: true
            };
        case SET_PREDICTION:
            return {
                ...state,
                prediction: payload.prediction,
                predictionProb: payload.predictionProb
            };
        case SHOW_ALERT:
            return {
                ...state,
                severity: payload.severity,
                message: payload.message
            };
        case ALERT_FINISHED:
            return {
                ...state,
                message: ""
            };
        default:
            return state;
    }
};

export default reducer;
