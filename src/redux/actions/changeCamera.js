export const type = "CHANGE_CAMERA";

const action = (facingMode) => {
    const cameraMode = facingMode === "user" ? "environment" : "user"
    return {
        type,
        payload: cameraMode
    };
};

export default action;
