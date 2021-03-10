import React, { Component } from 'react';
import socketIOClient from "socket.io-client"
import * as Service from "./../Services/ServiceCalls"
import * as Constants from "../../Constants.js"

class Party extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.socket = socketIOClient();
        this.userData = JSON.parse(localStorage.getItem("userInfo"));
    }

    componentDidMount = () => {
        // check if party exists
        const partyName = window.location.pathname.split("/")[2];
        var party = { partyName: partyName };
        Service.checkPartyExists(party).then(response => {
            if (response.status === 200) {
                this.socket.emit(Constants.CONNECT_TO_ROOM, partyName);
            }
        }).catch(err => {
            console.error(err);
            this.props.history.push("/ERROR")
        })
        var myAudio = document.getElementById("audio");
        // update song
        this.socket.on(Constants.SONG_UPDATED, (data) => {

        })
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