const fs = require("fs");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
var ss = require("socket.io-stream");
const bodyParser = require("body-parser");
const ytdl = require("ytdl-core");
const ffmpegPath = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const constants = require("./constants.js")
var service = require("./databaseService.js");

const isDev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 5000;

ffmpeg.setFfmpegPath(ffmpegPath);

// read and parse application/json
app.use(bodyParser.json());

app.use(express.static(path.resolve("./synk-music-ui/build")));

// let rawData = fs.readFileSync("./client-info.json")
// let data = JSON.parse(rawData)
// console.log(data["psychedelic-bliss"])
// fs.writeFileSync("client-info.json", JSON.stringify(data, null, 4))
// console.log(new Date().toLocaleString())
// input.pipe(res)

// var input = fs.createReadStream("audio.mp3")
var input = null;
app.get("/getStream", (req, res) => {
    // get video from youtube and stream to client
    let rawData = fs.readFileSync("userData.json");
    let userData = JSON.parse(rawData);
    // let userIndex = userData.indexOf(userData.find((item) => {
    //     return item.partyName === req.query.partyName
    // }))
    // if (userIndex !== undefined) {
    //     try {
    //         ytdl(userData[userIndex].currentSong, { filter: "audioonly" })
    //             .pipe(res)
    //     } catch (exception) {
    //         res.status(500).send(exception)
    //     }

    // } else {
    //     res.status(400).send("Bad Request!!! Please check the values")
    // }
    if (
        userData.find((item) => {
            return item.partyName === req.query.partyName;
        }) &&
        req.query.url !== ""
    ) {
        try {
            var stream = ytdl(req.query.url, { filter: "audioonly" });
            // var totalAudioLength = 10000
            // res.setHeader("Accept-Ranges", "bytes")
            // videoID = ytdl.getVideoID(req.query.url)

            // console.log(req.headers.range);
            // ytdl.getBasicInfo(videoID).then(result => {
            //     console.log(result)
            // })
            // stream.on("progress", (length, downloaded, totalLength) => {
            // totalAudioLength = totalLength
            // console.log(totalAudioLength)
            // console.log(length, downloaded, totalLength)
            // })
            // res.writeHead(200, {
            //     "Accept-Ranges": "bytes",
            //     "Content-Length": totalAudioLength,
            //     "Content-Range": "bytes 0-" + totalAudioLength
            // })
            stream.pipe(res);
        } catch (exception) {
            res.status(500).send(exception);
        }
    } else {
        res.status(400).send("Bad Request!!! Please check the values");
    }
});
app.get("/pause", (req, res) => {
    input = fs.createReadStream("audio.mp3");
    input.pipe(res);
});

app.get("/getSongs", (req, res) => {
    service.findByPartyAndHostNames(req.query.partyName, req.query.hostName).then((result) => {
        if (result !== null) {
            res.status(200).send(result.songs);
        } else {
            res.status(400).send("Bad Request!!! Please check the values");
        }
    })
});

app.delete("/deleteParty", (req, res) => {
    service.deleteParty(req.body.partyName).then(result => {
        if (result !== null) {
            res.status(200).send("success");
        } else {
            res.status(400).send("Bad Request!!! Party Not Found");
        }
    })
});

app.get("/getCurrentSong", (req, res) => {
    let rawData = fs.readFileSync("userData.json");
    let userData = JSON.parse(rawData);
    let data = userData.find((item) => {
        return item.partyName === req.query.partyName;
    });
    if (data !== undefined) {
        res.status(200).send(data.currentSong);
    } else {
        res.status(400).send("Bad Request!!! Please check the values");
    }
});
app.get("/getTutorialStatus", (req, res) => {
    service.findByPartyName(req.query.partyName).then(result => {
        if (result !== null) {
            res.status(200).send(result.tutorialStatus);
        } else {
            res.status(400).send("Bad Request!!! Please check the values");
        }
    })
});

app.get("/test", (req, res) => {
    service.findByPartyName(req.query.partyName).then((result) => {
        if (result !== null && result !== undefined) {
            res.status(200).send(result);
        } else {
            res.status(400).send("Bad Request!!! Please check the values");
        }
    });
});

app.put("/updateTutorialStatus", (req, res) => {
    service.findByPartyAndHostNames(
        req.body.partyName,
        req.body.hostName
    ).then((result) => {
        if (result !== null) {
            service.updateData(constants.tutorialStatus, req.body.tutorialStatus, req.body.partyName).then((result) => {
                if (result !== null) {
                    res.status(200).send("updated successfully");
                }
            })
        }
    })
});
app.put("/updateSongs", (req, res) => {
    service.findByPartyAndHostNames(
        req.body.partyName,
        req.body.hostName
    ).then((result) => {
        if (result !== null) {
            service.updateData(constants.existingSongList, req.body.songs, req.body.partyName).then((result) => {
                if (result !== null) {
                    res.status(200).send("updated successfully");
                }
            })
        }
    })
});

app.get("/validateGuestPartyRequest", (req, res) => {
    service.findByPartyName(
        req.query.partyName
    ).then((result) => {
        if ((result !== null && result !== undefined) && result.partyStatus === true) {
            res.status(200).send("Success");
        } else {
            res.status(404).send("Failed");
        }

    });
});

app.get("/validateHostPartyRequest", (req, res) => {
    service.findByPartyAndHostNames(
        req.query.partyName,
        req.query.hostName
    ).then((result) => {
        if (result === null || result === undefined) {
            // write data
            newUserData = {
                hostName: req.query.hostName,
                partyName: req.query.partyName,
                songs: [],
                currentSong: "",
                songStartTime: null,
                tutorialStatus: true,
                partyStatus: true
            };
            service.writeUserData(newUserData)
            res.status(200).send("Success");
        } else {
            res.status(200).send("logged in");
        }

    });
});

io.on("connection", (socket) => {
    // const stream = ss.createStream();
    // input = fs.createReadStream("../EMP automation/county_list.json")
    // input = fs.readFileSync("../EMP automation/county_list.json")
    // console.log(socket.id)
    var roomId = "";
    socket.on("connect-to-room", (data) => {
        roomId = data;
        socket.join(roomId);
        io.to(roomId).emit("connected", "Connection Successful");
    });
    socket.on("play-pause", (data) => {
        // console.log('play or pause', data)
        let rawData = fs.readFileSync("userData.json");
        let userData = JSON.parse(rawData);
        let userIndex = userData.indexOf(
            userData.find((item) => {
                return item.partyName === roomId;
            })
        );
        if (userIndex !== undefined && userIndex > -1) {
            // console.log(userIndex)
            if (userData[userIndex].currentSong !== data.currentSong) {
                userData[userIndex].currentSong = data.currentSong;
                fs.writeFileSync("userData.json", JSON.stringify(userData, null, 4));
                io.to(roomId).emit("play-pause", {
                    currentTime: data.currentTime,
                    status: data.status,
                    refresh: false,
                });
            }
        } else {
            io.to(roomId).emit("play-pause", {
                currentTime: data.currentTime,
                status: data.status,
                refresh: true,
            });
        }
    });
    socket.on("update-current-song", (data) => {
        // console.log('play or pause', data)
        let rawData = fs.readFileSync("userData.json");
        let userData = JSON.parse(rawData);
        let userIndex = userData.indexOf(
            userData.find((item) => {
                return item.partyName === roomId;
            })
        );
        if (userIndex !== undefined && userIndex > -1) {
            // console.log(userIndex)
            if (userData[userIndex].currentSong !== data.currentSong) {
                userData[userIndex].currentSong = data.currentSong;
                fs.writeFileSync("userData.json", JSON.stringify(userData, null, 4));
                io.to(roomId).emit("song-updated", {
                    currentTime: data.currentTime,
                    status: data.status,
                    refresh: false,
                });
            }
        } else {
            io.to(roomId).emit("song-updated", {
                currentTime: data.currentTime,
                status: data.status,
                refresh: true,
            });
        }
    });
    socket.on("get-stream", () => {
        var stream = ss.createStream();
        console.log("hello");
        ss(socket).emit("audio-stream", stream);
        ytdl("https://www.youtube.com/watch?v=FHVD9ft_ANw", {
            filter: "audioonly",
        }).pipe(stream);
    });

    // input.pipe(stream)
});

app.get("*", (request, response) => {
    response.sendFile(path.resolve("./synk-music-ui/build", "index.html"));
});

http.listen(PORT, () => {
    console.log("listening on port: 5000");
});
