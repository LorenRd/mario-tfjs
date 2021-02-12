export const type = "SET_PREDICTION_FUNC";

const action = (predictionFunc) => {
    return {
        type,
        payload: predictionFunc
    };
};

export default action;
