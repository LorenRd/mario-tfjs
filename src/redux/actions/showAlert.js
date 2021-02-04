export const type = "SHOW_ALERT";

const action = (severity, message) => {
    return {
        type,
        payload: { severity, message },
    };
};

export default action;
