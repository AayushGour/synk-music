const fs = require("fs");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const ss = require("socket.io-stream");
const bodyParser = require("body-parser");
const ytdl = require("ytdl-core");
const ffmpegPath = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const constants = require("./constants.js")
const service = require("./databaseService.js");
const ytsr = require("ytsr");

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
    // let rawData = fs.readFileSync("userData.json");
    // let userData = JSON.parse(rawData);
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
    // if (
    //     userData.find((item) => {
    //         return item.partyName === req.query.partyName;
    //     }) &&
    //     req.query.url !== ""
    // ) {
    //     try {
    //         var stream = ytdl(req.query.url, { filter: "audioonly" });
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
    // stream.pipe(res);
    //     } catch (exception) {
    //         res.status(500).send(exception);
    //     }
    // } else {
    //     res.status(400).send("Bad Request!!! Please check the values");
    // }
    service.findByPartyName(req.query.partyName).then(result => {
        if (result !== null) {
            try {
                var songurl = null;
                if (req.query.url !== "undefined") {
                    songurl = req.query.url;
                } else {
                    songurl = result.currentSong;
                }
                var stream = ytdl(songurl, { filter: "audioonly" });
                stream.pipe(res);
                res.end()
            } catch (error) {
                res.status(500).send(exception);
            }
        } else {
            res.status(400).send("Bad Request!!! Please check the values");
        }
    })
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
    service.findByPartyName(req.query.partyName).then(result => {
        if (result !== null) {
            service.deleteParty(req.query.partyName).then(() => {
                res.status(200).send("success");
            })
        } else {
            res.status(400).send("bad Request. Party Not found")
        }
    })
});

app.get("/youtubeSearch", (req, res) => {
    try {
        ytsr(req.query.searchText, { limit: 40 }).then(searchResults => {
            res.status(200).send(searchResults);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(error)
    }
})

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
    console.log(req.body)
    service.findByPartyName(
        req.body.partyName
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
        if ((result !== null && result !== undefined) && (result.partyStatus !== true)) {
            res.status(403).send("party inactive");
        } else if ((result !== null && result !== undefined) && (result.partyStatus === true)) {
            res.status(200).send("success");
        } else {
            res.status(404).send("Failed");
        }

    });
});

app.get("/checkPartyExists", (req, res) => {
    service.findByPartyName(
        req.query.partyName
    ).then((result) => {
        if ((result !== null && result !== undefined) && (req.query.user === "party" && result.partyStatus === true)) {
            var response = {};
            response.hostName = result.hostName;
            response.partyName = result.partyName;
            res.status(200).send(response);
        } else if ((result !== null && result !== undefined) && req.query.user === "host") {
            service.updateData("partyStatus", true, req.query.partyName).then(updatedResponse => {
                var response = {};
                response.hostName = result.hostName;
                response.partyName = result.partyName;
                res.status(200).send(response);
            });
        } else {
            res.status(404).send("Failed");
        }

    }).catch(error => {
        console.error(error);
        res.status(404).send("Failed");
    });
});

app.get("/validateHostPartyRequest", (req, res) => {
    service.findByPartyName(req.query.partyName).then(result => {
        if (result !== null && result !== undefined) {
            if (result.hostName === req.query.hostName) {
                res.status(200).send("logged in");
            } else {
                res.status(400).send("Party Already Exists")
            }
        } else {
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

        }
    })
});

app.get("/updatePartyStatus", (req, res) => {
    service.findByPartyName(req.query.partyName).then(result => {
        if (result !== null) {
            service.updateData(constants.partyStatus, JSON.parse(req.query.partyStatus), req.query.partyName).then((result) => {
                if (result !== null) {
                    res.status(200).send("updated successfully");
                }
            })
        }

    })
})


io.on("connection", (socket) => {
    // console.log(socket.id)
    var roomId = "";
    socket.on("connect-to-room", (data) => {
        roomId = data;
        socket.join(roomId);
        io.to(roomId).emit("connected", "Connection Successful");
    });
    socket.on("play-pause", (data) => {
        io.to(data.partyName).emit("play-pause", data);
    });
    // socket.on(constants.UPDATE_CURRENT_SONG, (data) => {
    //     service.findByPartyName(data.partyName).then(result => {
    //         if (result !== null) {
    //             service.updateData(constants.currentSong, data.url, data.partyName);
    //             io.to(data.partyName).emit(constants.SONG_UPDATED, data)
    //         }
    //     })
    // });
    socket.on(constants.UPDATE_CURRENT_SONG, (data) => {
        service.findByPartyName(data.partyName).then(response => {
            console.log(data)
            service.updateData(constants.currentSong, data.url, data.partyName).then(result => {
                io.to(data.partyName).emit(constants.SONG_UPDATED, data)
            });
        })
    })

    socket.on("test", (data) => {
        var songurl = "https://www.youtube.com/watch?v=S2oxFIsENgM";
        var audio = ytdl(songurl, { filter: "audioonly" });
        console.log(audio)
        var stream = ss.createStream();
        // var arr = audio.toString('base64')
        // socket.emit("test-response", audio)
        audio.pipe(stream);

        // stream.pipe(res);
    })
});

app.get("*", (request, response) => {
    response.sendFile(path.resolve("./synk-music-ui/build", "index.html"));
});

http.listen(PORT, () => {
    console.log("listening on port: 5000");
});
