import * as knnClassifier from "@tensorflow-models/knn-classifier";

import { type as SET_MODEL } from "../actions/setModel";
import { type as SET_PLAYING } from "../actions/setPlaying";
import { type as SET_PREDICTION } from "../actions/setPrediction";

const defaultState = {
    model: null,
    classifier: knnClassifier.create(),
    playing: false,
    prediction: "None",
    predictionProb: 0
};

const reducer = (state = defaultState, { type, payload }) => {

    switch (type) {
        case SET_MODEL:
            return {
                ...state,
                model: payload
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
            }
        default:
            return state;
    }
};

export default reducer;
