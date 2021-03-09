import React, { Component } from 'react';
import socketIOClient from "socket.io-client"
import * as Service from "./../Services/ServiceCalls"

class Party extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.socket = socketIOClient();
        this.userData = JSON.parse(localStorage.getItem("userInfo"));

    }

    componentDidMount = () => {
        // this.socket.connect();
        this.socket.emit("connect-to-room", "bliss")
        var myAudio = document.getElementById("audio")
        this.socket.on("play-pause", (data) => {
            if (data.status) {
                // send socket request
                myAudio.play();
                console.log("play", data)
            } else {
                // send socket request
                myAudio.pause();
                console.log("paused", data)
            }
        })
    }

    render() {
        return (
            <div>
                <audio id="audio" controls >
                    <source src={`/getStream?partyName=bliss`} type="audio/mpeg"></source>
                </audio>
            </div>

        );
    }
}

export default Party;