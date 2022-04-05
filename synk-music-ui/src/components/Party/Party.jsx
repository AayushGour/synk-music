import React, { Component, createRef } from 'react';
import socketIOClient from "socket.io-client"
import * as Service from "./../Services/ServiceCalls"
import * as Constants from "../../Constants.js"
import Player from '../Player/Player';
import { withStyles } from "@material-ui/core/styles"
import { connect } from 'react-redux';


const useStyles = () => ({

})

class Party extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playing: false
        };
        // this.socket = socketIOClient();
        this.userData = JSON.parse(localStorage.getItem("userInfo"));
        this.playerRef = React.createRef();
        // this.ss = require("socket.io-stream")
    }

    componentDidMount = () => {
        // check if party exists
        const partyName = window.location.pathname.split("/")[2];
        var party = { partyName: partyName, user: "party" };
        Service.checkPartyExists(party).then(response => {
            if (response.status === 200) {
                const userDetails = { hostName: response.data.hostName, partyName: partyName };
                this.props.dispatchToStore("SET_USER_DETAILS", userDetails)
                // this.socket.emit(Constants.CONNECT_TO_ROOM, partyName);
            }
        }).catch(err => {
            console.error(err);
            this.props.history.push("/ERROR")
        })
        // update song
        // this.socket.on(Constants.SONG_UPDATED, (data) => {
        // myAudio.src = `/getStream?partyName=${data.partyName}&url=${data.url}`;
        // myAudio.play();
        // this.getVideoDetails(data.url, data.partyName);
        // })

        // this.socket.on(Constants.PLAY_PAUSE, (data) => {
        //     if (data.playing) {
        //         this.playerRef.current.play();
        //     } else {
        //         this.playerRef.current.pause();
        //     }
        // })

        // this.ss(this.socket).on("test-response", (stream, data) => {
        // this.socket.on("test-response", (stream) => {
        // stream.write(this.ss.Buffer);
        // var buff = []
        // buff.push(stream)
        // var blob = new Blob(buff, { 'type': 'audio/ogg; codecs=opus' });

        // myAudio.srcObject = stream;
        // try {
        // myAudio.src = window.URL.createObjectURL(blob);
        // console.log(myAudio.src)
        // myAudio.play()

        //     } catch (err) {
        //         console.log(err)
        //     }
        // })
    }

    getVideoDetails = (item, partyName) => {
        if (item !== undefined && item !== "") {
            const getDataUrl =
                "https://www.youtube.com/oembed?url=" + item + "&format=json";

            fetch(getDataUrl, {
                mode: "cors",
                method: "GET",
            })
                .then((response) => {
                    return response.text();
                })
                .then((data) => {
                    data = JSON.parse(data);
                    data.songUrl = item;
                    // var requestObject = {
                    //     url: item,
                    //     partyName: partyName,
                    // };
                    this.props.dispatchToStore("SET_SONG_DETAILS", data);
                })
                .catch((error) => console.error(error));
        } else {
            var data = {
                title: "",
                songUrl: "",
                thumbnail_url: "",
            };
            this.props.dispatchToStore("SET_SONG_DETAILS", data);
        }
    };

    render() {
        return (
            <div>
                <Player
                    forwardRef={this.playerRef}
                    playing={this.state.playing}
                    user="party"
                />
            </div>

        );
    }
}
const mapStateToProps = (state) => {
    return {
        globalState: state,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchToStore: (type, data) => {
            dispatch({ type, data });
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(useStyles)(Party));