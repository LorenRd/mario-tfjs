export const type = "CHANGE_CAMERA";

const action = (facingMode) => {
    console.log(facingMode)
    const cameraMode = facingMode === "user" ? "environment" : "user"
    console.log(cameraMode)
    return {
        type,
        payload: cameraMode
    };
};

export default action;
