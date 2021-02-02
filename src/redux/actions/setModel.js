export const type = "SET_MODEL";

const action = (model) => {
    return {
        type,
        payload: model
    };
};

export default action;
