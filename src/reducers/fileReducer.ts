export const UPLOAD_FILE_SUCCESS = 'UPLOAD_FILE_SUCCESS';

const initialState = {
    src: undefined,
};

export default function fileReducer(
    previousState = initialState,
    { type, payload }
) {
    if (type === UPLOAD_FILE_SUCCESS) {
        return { ...previousState, src: payload };
    }
    return previousState;
}
