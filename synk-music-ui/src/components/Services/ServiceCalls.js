import axios from "axios";
axios.defaults.timeout = 15000;

export function validateHostPartyRequest(data) {
    return axios.get(`/validateHostPartyRequest`, {
        headers: {
            "Content-Type": "application/json"
        },
        params: data
    })
}

export function validateGuestPartyRequest(data) {
    return axios.get(`/validateGuestPartyRequest`, {
        headers: {
            "Content-Type": "application/json"
        },
        params: data
    })
}

export function getSongs(data) {
    return axios.get(`/getSongs`, {
        headers: {
            "Content-Type": "application/json"
        },
        params: data
    })
}

export function updateSongList(data) {
    return axios.put(`/updateSongs`, data,
        {
            "Content-Type": "application/json"
        },
    )
}

export function getCurrentSong(data) {
    return axios.get(`/getCurrentSong`, {
        headers: {
            "Content-Type": "application/json"
        },
        params: data
    })
}

export function updateCurrentSong(data) {
    return axios.put(`/updateCurrentSong`, data, {
        headers: {
            "Content-Type": "application/json"
        },
    })
}

export function getTutorialStatus(data) {
    return axios.get(`/getTutorialStatus`, {
        headers: {
            "Content-Type": "application/json"
        },
        params: data
    })
}

export function updateTutorialStatus(data) {
    return axios.put('/updateTutorialStatus', data, {
        headers: {
            "Content-Type": "application/json"
        },

    })
}
export function deleteParty(data) {
    return axios.delete("/deleteParty", {
        headers: {
            "content-Type": "application/json"
        },
        params: data
    })
}
export function youtubeSearch(data) {
    return axios.get("/youtubeSearch", {
        headers: {
            "Content-Type": "application/json"
        },
        params: data
    })
}

export async function checkPartyExists(data) {
    return await axios.get("/checkPartyExists", {
        headers: {
            "Content-Type": "application/json"
        },
        params: data
    })
}