import React, { Component } from "react";
import "./Loader.scss"

export class Loader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parentElement: "",
            parentPadding: ""
        };
    }
    componentDidMount = () => {
        this.getParentElement();
    };

    getParentElement = () => {
        this.setState({
            parentPadding: `-${window
                .getComputedStyle(
                    document.getElementById("loader-container").parentElement
                )
                .getPropertyValue("padding")}`,
            parentElement: document.getElementById("loader-container").parentElement
        });
    };
    render() {
        return (
            <div
                id="loader-container"
                style={{
                    position: "absolute",
                    width: this.props.width || isNaN(this.state.parentElement.clientWidth) ? "100%" : this.state.parentElement.clientWidth,
                    height: this.props.height || isNaN(this.state.parentElement.clientHeight) ? "100%" : this.state.parentElement.clientHeight,
                    backgroundColor: "rgba(0,0,0,0.7)",
                    background: this.props.background || "rgba(0,0,0,0.7)",
                    margin: this.props.padding || this.state.parentPadding,
                    zIndex: "10",
                    display: this.props.display ? "block" : "none"
                }}
            >
                <div
                    style={{
                        margin: "auto",
                        top: "0",
                        bottom: "0",
                        left: "0",
                        right: "0",
                        width: isNaN(this.state.parentElement.clientWidth) ? "100%" : this.state.parentElement.clientWidth * 0.1,
                        height: isNaN(this.state.parentElement.clientHeight) ? "100%" : this.state.parentElement.clientWidth * 0.1,
                        position: "absolute",
                        borderRadius: "50%",
                        perspective: "800px",
                        zIndex: "10",
                    }}
                    className="loader"
                >
                    <div className="inner one"></div>
                    <div className="inner two"></div>
                    <div className="inner three"></div>
                </div>
            </div>
        );
    }
}
export default Loader;
