import React, { Component } from 'react';
import "./MobileTutorial.scss"
import * as Service from "./../Services/ServiceCalls"
import { connect } from 'react-redux';

class MobileTutorial extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    handleClose = () => {
        // send request to backend also
        this.props.dispatchToStore("DISPLAY_TUTORIAL", { displayTutorial: false })
        Service.updateTutorialStatus({ partyName: this.props.globalState.userData.partyName, displayTutorial: false })
    }
    render() {
        return (
            <div className="mobile-tutorial-root" onClick={this.handleClose}>

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