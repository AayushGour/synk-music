import React, { Component } from 'react';
import BackgroundImage from "./../../assets/images/Synklogobackground.png"
import "./Background.scss"

class Background extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div
                id="background-root"
                style={{

                    // background:
                    //   "radial-gradient(circle at center center, rgb(255,255,255) 0%, rgb(0, 0, 0) 15%)"
                }}
            >
                <div
                    className="container"
                    style={{
                        width:
                            window.innerHeight > window.innerWidth
                                ? window.innerWidth
                                : window.innerHeight,
                        height:
                            window.innerHeight > window.innerWidth
                                ? window.innerWidth
                                : window.innerHeight,
                        verticalAlign: "middle"
                    }}
                >
                    <div
                        style={{
                            // margin: "auto",
                            position: "absolute",
                            width: "45%",
                            height: "45%",
                            // backgroundImage: `url(${Background})`
                            // animation: "pulse-dot 4s infinite",
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%,-50%)"
                        }}
                    >
                        <div className="sound-icon">
                            <div className="sound-wave">
                                <i className="bar"></i>
                                <i className="bar"></i>
                                <i className="bar"></i>
                                <i className="bar"></i>
                                <i className="bar"></i>
                                <i className="bar"></i>
                                <i className="bar"></i>
                                <i className="bar"></i>
                                <i className="bar"></i>
                                <i className="bar"></i>
                                <i className="bar"></i>
                                <i className="bar"></i>
                                <i className="bar"></i>
                                <i className="bar"></i>
                                <i className="bar"></i>
                                <i className="bar"></i>
                                <i className="bar"></i>
                                <i className="bar"></i>
                                <i className="bar"></i>
                                <i className="bar"></i>
                                <i className="bar"></i>
                                <i className="bar"></i>
                                <i className="bar"></i>
                                <i className="bar"></i>
                                <i className="bar"></i>
                                <i className="bar"></i>
                                <i className="bar"></i>
                                <i className="bar"></i>
                                <i className="bar"></i>
                                <i className="bar"></i>
                            </div>
                        </div>
                        <img
                            alt="logo"
                            src={BackgroundImage}
                            style={{
                                margin: "auto",
                                width: "100%",
                                height: "100%",
                                animation: "pulse-dot 4s infinite"
                            }}
                        />
                    </div>
                    <div className="pulsating-circle"></div>
                    <div
                        style={{
                            zIndex: "1",
                            position: "absolute",
                            width: "100%",
                            height: "100vh",
                            backgroundColor: "rgba(0,0,0,0.4)",
                            left: "0",
                            right: "0",
                            top: "0",
                            bottom: "0"
                        }}
                    ></div>
                </div>
                <span style={{
                    position: "absolute",
                    bottom: "0",
                    right: "0",
                    padding: "8px",
                    fontSize: "13px",
                    fontFamily: "'Montserrat', sans-serif"
                }}>Developed by Aayush Gour</span>
            </div>


        );
    }
}

export default Background;