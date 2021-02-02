export const type = "SET_PREDICTION";

const action = (prediction, predictionProb) => {
    return {
        type,
        payload: {
            prediction,
            predictionProb
        }
    };
};

export default action;
