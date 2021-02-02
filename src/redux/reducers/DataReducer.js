import * as knnClassifier from "@tensorflow-models/knn-classifier";

import { type as SET_MODEL } from "../actions/setModel";
import { type as SET_PLAYING } from "../actions/setPlaying";
import { type as SET_PREDICTION } from "../actions/setPrediction";
import { type as SET_NEW_GAME } from "../actions/setNewGame";

const defaultState = {
    model: null,
    classifier: knnClassifier.create(),
    playing: false,
    prediction: "None",
    predictionProb: 0,
    alive: true,
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
        case SET_NEW_GAME:
            return {
                ...state,
                alive: payload.alive,
            }
        default:
            return state;
    }
};

export default reducer;
