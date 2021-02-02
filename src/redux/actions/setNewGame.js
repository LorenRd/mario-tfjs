export const type = "SET_NEW_GAME";

const action = (alive) => {
    return {
        type,
        payload: !alive
    };
};

export default action;
Ñ