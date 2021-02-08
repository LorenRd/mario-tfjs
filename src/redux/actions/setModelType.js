export const type = "SET_MODEL_TYPE";

const action = (modelType) => {
    return {
        type,
        payload: modelType
    };
};

export default action;
