module.exports = {
    dbName: "SynkDB",
    collectionName: "user_data",
    mongoURL: "mongodb+srv://synkAdmin:synkMusicMongo@cluster0.9vuys.mongodb.net/SynkApp?retryWrites=true&w=majority",
    existingSongList: "songs",
    tutorialStatus: "tutorialStatus",
    currentSong: "currentSong",
    partyStatus: "partyStatus",
    UPDATE_CURRENT_SONG: "update-current-song",
    SONG_UPDATED: "song-updated",
    PLAY_PAUSE: "play-pause"
}

// docker commands
// build: docker build -t synk-music-image
// run: docker run -dt --name synk-music -p 3000:3000 -p 5000:5000 synk-music-image