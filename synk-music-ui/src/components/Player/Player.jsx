import { faFastBackward, faFastForward, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography } from '@material-ui/core';
import React, { Component } from 'react';
import { isMobile } from 'react-device-detect';
import "./Player.scss";
import Loader from "./../Loader/Loader"
import SynkLogo from "./../../assets/images/Synklogo.png"
import { connect } from 'react-redux';
import Wave from "@foobar404/wave"


class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seekTime: 0,
            loaderDisplay: false,
            played: 0,
            loaded: 0,
            duration: 0,
            seeking: false,
            playedSeconds: 0,
            circleOffset: 1,
            playing: false,
            wave: new Wave(),
            videoDetails: {
                thumbnail_url: SynkLogo
            }
        };
        this.youtubeAudio = null
    }

    componentDidMount = () => {
        // if (this.props.url !== "")
        //     this.setState(
        //         {
        //             loaderDisplay: true
        //         },
        //         () => this.getVideoDetails()
        //     );
        if (this.props.user === "host")
            document.body.onkeyup = (e) => {
                if (e.keyCode === 32) {
                    try {
                        this.handlePlayPause()
                    } catch (exception) {
                        console.log(exception)
                    }
                }
            }

        setInterval(() => {
            this.setState({ circleOffset: this.youtubeAudio != undefined && this.youtubeAudio.duration > 0 ? 1 - ((this.youtubeAudio.currentTime / this.youtubeAudio.duration) / 2) : 1 })

        }, 1000)

        this.youtubeAudio = document.getElementById('audio');
        this.state.wave.fromElement("audio", "canvas", {
            // options here
            type: "shine",
            colors: ["#01a4e9", "black"],
        });
        this.youtubeAudio.onended = () => {
            this.props.user === "host" && this.props.onPlayNextClicked();
        }

        this.youtubeAudio.onloadstart = () => {
            console.log(this.props.globalState)
            this.props.globalState.songDetails.songUrl === "" ? this.setState({ loaderDisplay: false }) : this.setState({ loaderDisplay: true })
        }

        this.youtubeAudio.onloadeddata = () => {
            this.setState({ loaderDisplay: false })
        }
        this.youtubeAudio.onplay = () => {
            this.setState({ playing: true })
        }
        this.youtubeAudio.onpause = () => {
            this.setState({ playing: false })
        }

    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.globalState.songDetails.songUrl !== nextProps.globalState.songDetails.songUrl) {
            // if song is changed, then refresh stream
            this.youtubeAudio.src = `/getStream?partyName=${this.props.globalState.userData.partyName}&url=${nextProps.globalState.songDetails.songUrl}`
            this.youtubeAudio.play();
            this.setState({ playing: true })
        }
    }

    handlePlayPause = () => {
        // this.props.onPlayClicked();
        this.state.playing ? this.youtubeAudio.pause() : this.youtubeAudio.play();
        this.props.user === "host" && this.props.onPlayPause(!this.state.playing, this.youtubeAudio.currentTime);
        this.setState({ playing: !this.youtubeAudio.paused })
    }

    handleSeekChange = (event) => {
        this.setState({ played: parseFloat(event.target.value) });
    };
    handleSeekMouseDown = (event) => {
        this.setState({ seeking: true });
    };
    handleSeekMouseUp = (event) => {
        this.player.seekTo(parseFloat(event.target.value));
        this.setState({ seeking: false });
    };

    componentWillUnmount = () => {
        document.body.onkeyup = null;
    }

    render() {
        return (
            <>
                <canvas id="canvas"
                    width={isMobile ? window.innerWidth : window.innerHeight === window.screen.height ? "850px" : "820px"}
                    height={isMobile ? window.innerWidth : window.innerHeight === window.screen.height ? "850px" : "820px"}
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: "0",
                    }}
                ></canvas>
                <div className="music-player"
                    id="music-player"
                    style={{
                        height: isMobile ? "80vw" : window.innerHeight === window.screen.height ? "56vh" : "60vh",
                        width: isMobile ? "80vw" : window.innerHeight === window.screen.height ? "56vh" : "60vh",
                    }}>
                    <Loader height="100%" width="100%" display={this.state.loaderDisplay} />
                    <div className="album">
                        <img
                            className="album-image"
                            alt="Song Icon"
                            src={this.props.globalState.songDetails.thumbnail_url === "" ? SynkLogo : this.props.globalState.songDetails.thumbnail_url}
                        />
                        <div className="album-div"></div>
                    </div>
                    <div className="dash"
                        style={{
                            height: `calc(${isMobile ? "80vw*0.80" : "60vh*0.70"})`,
                            top: isMobile ? "-80%" : "-70%"
                        }}
                    >
                        <div
                            className="controls"
                        >
                            <button
                                className="back"
                                onClick={() => this.props.onPlayPreviousClicked()}
                                title="Play Previous"
                                disabled={this.props.user === "party" ? true : false}
                            >
                                <FontAwesomeIcon icon={faFastBackward} size="1x" />
                            </button>
                            <button className="play" onClick={() => {
                                this.handlePlayPause()
                            }}
                                title="Play (Space)"
                                disabled={this.props.user === "party" ? true : false}
                            >
                                {this.state.playing ?
                                    <FontAwesomeIcon icon={faPause} size="1x" />
                                    : <FontAwesomeIcon icon={faPlay} size="1x" />
                                }
                            </button>
                            <button
                                className="forward"
                                onClick={() => this.props.onPlayNextClicked()}
                                title="Play Next"
                                disabled={this.props.user === "party" ? true : false}
                            >
                                <FontAwesomeIcon icon={faFastForward} size="1x" />
                            </button>

                        </div>
                        <div className="seeker">

                            <svg
                                height={isMobile ? "80vw" : window.innerHeight === window.screen.height ? "56vh" : "60vh"}
                                width={isMobile ? "80vw" : window.innerHeight === window.screen.height ? "56vh" : "60vh"}

                                style={{
                                    position: "absolute"
                                }}

                            >
                                <circle
                                    cx="50%"
                                    cy={isMobile ? "11%" : "3%"}
                                    r={isMobile ? "47%" : "47%"}
                                    stroke="#171717"
                                    strokeWidth={isMobile ? "10" : "20"}
                                    fill="transparent"
                                    strokeLinecap="round"
                                    strokeDasharray={`calc(2*${Math.PI}*${isMobile ? "80vw*0.47" : window.innerHeight === window.screen.height ? "56vh*0.47" : "60vh*0.47"})`}
                                    strokeDashoffset={`calc(${Math.PI}*${isMobile ? "80vw*0.47" : window.innerHeight === window.screen.height ? "56vh*0.47" : "60vh*0.47"})`}


                                />
                                {/* r==47% for fullscreen */}
                                <circle
                                    cx="-50%"
                                    cy={isMobile ? "11%" : "3%"}
                                    r={isMobile ? "47%" : "47%"}
                                    stroke="#01a4e9"
                                    strokeWidth={isMobile ? "5" : "10"}
                                    strokeLinecap="round"
                                    fill="transparent"
                                    strokeDasharray={`calc(2*${Math.PI}*${isMobile ? "80vw*0.47" : window.innerHeight === window.screen.height ? "56vh*0.47" : "60vh*0.47"})`}
                                    strokeDashoffset={`calc(2*${Math.PI}*${this.state.circleOffset}*${isMobile ? "80vw*0.47" : window.innerHeight === window.screen.height ? "56vh*0.47" : "60vh*0.47"})`}
                                    style={{
                                        transform: "scaleX(-1)"
                                    }}
                                />

                            </svg>
                        </div>
                        <div className="info">
                            <span
                                style={{
                                    marginTop: isMobile ? "0px" : "6px"
                                }}
                            >
                                <Typography
                                    variant={isMobile ? "subtitle2" : "subtitle1"}
                                >
                                    {this.youtubeAudio != undefined ?
                                        `${Math.floor(this.youtubeAudio.currentTime / 3600) > 0 ?
                                            `${('0' + Math.floor(this.youtubeAudio.currentTime / 3600)).slice(-2)}:`
                                            : ""}${Math.floor(this.youtubeAudio.currentTime % 3600 / 60) > 0 ?
                                                ('0' + Math.floor(this.youtubeAudio.currentTime % 3600 / 60)).slice(-2) :
                                                "00"}:${('0' + Math.floor(this.youtubeAudio.currentTime % 3600 % 60)).slice(-2)}/${isNaN(this.youtubeAudio.duration) ? "00:00" :
                                                    (`${Math.floor(this.youtubeAudio.duration / 3600) > 0 ? `${('0' + Math.floor(this.youtubeAudio.duration / 3600)).slice(-2)}:`
                                                        : ""}${Math.floor(this.youtubeAudio.duration % 3600 / 60) > 0 ?
                                                            ('0' + Math.floor(this.youtubeAudio.duration % 3600 / 60)).slice(-2) :
                                                            "00"}:${('0' + Math.floor(this.youtubeAudio.duration % 3600 % 60)).slice(-2)}

                                                `)
                                        }`


                                        : "00:00/00:00"}
                                </Typography>
                            </span>

                            <Typography variant={isMobile ? "subtitle1" : "h5"} noWrap={isMobile ? this.props.globalState.songDetails.title.length <= 30 ? false : true : this.props.globalState.songDetails.title.length <= 80 ? false : true} style={{ marginTop: isMobile ? "8px" : "20px" }}>{this.props.globalState.songDetails.title}</Typography>
                        </div>
                    </div>
                    <audio
                        id="audio"
                        controls
                        type="audio/mpeg"
                        ref={this.props.forwardRef}
                    // style={{ display: "none" }}
                    />
                    {/* <ReactPlayer
                        id="react-player"
                        ref={this.ref}
                        playing={this.state.playing}
                        controls={true}
                        // style={{ display: "none" }}
                        url={this.props.globalState.songDetails.songUrl}
                        onPlay={() => {
                            this.setState({
                                loaderDisplay: false
                            });
                        }}
                        onPause={() => { }}
                        onSeek={(seconds) => {
                            console.log(seconds);
                            this.setState({ seekTime: seconds });
                        }}
                        onReady={() => {
                            console.log(this.player.getInternalPlayer())
                        }}
                        onProgress={(state) => {
                            if (!this.state.seeking) {
                                this.setState(state, () => {
                                    console.log(state)

                                });
                            }
                        }}
                        onDuration={(duration) => {
                            this.setState({ duration: duration });
                        }}
                        onBuffer={() => {
                            this.setState({ loaderDisplay: true });
                        }}
                        onEnded={() => {
                            // var image = document.getElementById("songDisplayImage");
                            // image.src = InitialThumb;
                            // this.props.onEnded();
                            this.setState({
                                played: 0
                            });
                        }}
                        wrapper="div"
                    /> */}

                </div >

            </>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        globalState: state
    }
}

const mapDispatchToProps = (dispatch) => {
    return { dispatchToStore: (type, data) => { dispatch({ type, data }) } }
}


export default connect(mapStateToProps, mapDispatchToProps)(Player);
