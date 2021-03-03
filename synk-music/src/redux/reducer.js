import { initialState } from "./initialState"

export default function reducer(state = initialState, action) {
    var newState = { ...state }
    switch (action.type) {
        case "SET_USER_DETAILS":
            newState.userData.hostName = action.data.hostName;
            newState.userData.partyName = action.data.partyName;
            return newState;

        case "SET_SONG_DETAILS":
            // Set values
            newState.songDetails = action.data
            console.log(newState)
            return newState;

        case "DISPLAY_TUTORIAL":
            newState.displayTutorial = action.data.displayTutorial;
            return newState

        default:
            return state;
    }
}