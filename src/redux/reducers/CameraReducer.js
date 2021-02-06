import { type as CHANGE_CAMERA } from "../actions/changeCamera";

const defaultState = {
    width: 480,
    height: 480,
    facingMode: "user"
};

const reducer = (state = defaultState, { type, payload }) => {

    switch (type) {
        case CHANGE_CAMERA:
            return {
                ...state,
                facingMode: payload
            };
        default:
            return state;
    }
};

export default reducer;
