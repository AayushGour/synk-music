import React, { Component } from 'react';
import "./MobileTutorial.scss"
import * as Service from "./../Services/ServiceCalls"
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandPointUp } from '@fortawesome/free-solid-svg-icons';
import { Typography } from '@material-ui/core';

class MobileTutorial extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleClose = () => {
        // send request to backend also
        this.props.dispatchToStore("DISPLAY_TUTORIAL", { displayTutorial: false })
        Service.updateTutorialStatus({ partyName: this.props.globalState.userData.partyName, tutorialStatus: false })
    }
    render() {
        return (
            <div className="mobile-tutorial-root" onClick={this.handleClose}>
                <div className="icons-div">
                    <FontAwesomeIcon className="hand-icon" icon={faHandPointUp} size="10x" />
                </div>
                <div className="mobile-tutorial-text-div">
                    <Typography variant="h5" style={{ fontFamily: "Montserrat", margin: "10px" }}>Swipe Left to start</Typography>
                    <Typography variant="subtitle1" style={{ fontFamily: "Montserrat" }}>Click anywhere to continue...</Typography>
                </div>

            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(MobileTutorial);