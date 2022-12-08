import { Button, Tab, Tabs, TextField } from '@material-ui/core';
import { Alert, TabContext, TabPanel } from '@material-ui/lab';
import React, { Component, createRef } from 'react'
import Carousel from '../Carousel/Carousel';
import "./Home.scss"
import { withStyles } from "@material-ui/core/styles"
import { isMobile } from 'react-device-detect';
import Loader from '../Loader/Loader';
import * as Service from './../Services/ServiceCalls'
import { connect } from 'react-redux';

const useStyles = () => ({
    tabsRootContainer: {
        width: isMobile ? "80vw" : "50vw",
        margin: "auto",
        border: "2px solid white",
        borderRadius: "5px",
    },
    tabPanel: {
        padding: "0px",
        backgroundColor: "#101010",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    textFieldRoot: {
        width: "80%",
        margin: "10px 0px 0px"
    },
    textFieldLabelRoot: {
        color: "#a9a9a9",
        "&.focused": {
            color: "#01a4e9"
        },
        "&.error": {
            color: "#f44336"
        }
    },
    textFieldUnderlineRoot: {
        "&::after": {
            borderBottom: "2px solid #01a4e9"
        },
        "&::before": {
            borderBottom: "2px solid #a9a9a9"
        },
        "&&:hover:before": {
            borderBottom: "2px solid #efeffa"
        }
    },
    textFieldInput: {
        color: "white"
    },
    helperText: {
        color: "white"
    },
    buttonRoot: {
        backgroundColor: "#1f1f1f",
        color: "#01a4e9",
        border: "2px solid #01a4e9",
        margin: "16px 0px 0px",
        width: "150px",
        fontWeight: "600",
        "&:hover": {
            backgroundColor: "#01a4e9",
            color: "#1f1f1f",
            transform: "scale(1.1)",
            transition: "ease-in-out 0.3s"
        },
        "&:disabled": {
            backgroundColor: "#4d4d4d",
            color: "#aeaeae",
            fontWeight: "500",
            border: "2px solid #4d4d4d"
        }
    },
    alert: {
        color: "rgb(250, 179, 174)",
        backgroundColor: "#180606",
        width: isMobile ? "80%" : "50%",
        border: "2px solid red",
        borderRadius: "5px",
        margin: "0px 0px 20px",
    }
})

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabValue: 0,
            guestPartyName: "",
            hostName: "",
            hostPartyName: "",
            displayLoader: false,
            displayGuestPartyNotFoundError: "",
            displayHostPartyExistsError: false,
            hostPartyErrorText: ""
        };
        this.tabsRef = createRef()
    }

    handleGuestRequest = () => {
        // send request to backend and redirect to the party
        var party = { partyName: this.state.guestPartyName }
        // if response === success
        Service.validateGuestPartyRequest(party).then((response) => {
            if (response.status === 200) {
                this.setState({
                    displayLoader: false
                }, () => {
                    this.props.history.push(`/party/${this.state.guestPartyName}`)
                })
            }
        }).catch(error => {
            if (error?.response?.status === 404) {
                this.setState({
                    displayLoader: false,
                    displayGuestPartyNotFoundError: "This party does not exist."
                })
            } else if (error?.response?.status === 403) {
                this.setState({
                    displayLoader: false,
                    displayGuestPartyNotFoundError: "This party is inactive at the moment."
                })
            }

        })
    }

    handleHostRequest = () => {
        // send request to backend and redirect to host

        var userData = {
            hostName: this.state.hostName,
            partyName: this.state.hostPartyName
        }
        Service.validateHostPartyRequest(userData).then((response) => {
            if (response.status === 200) {
                localStorage.setItem("userInfo", JSON.stringify(userData))
                this.setState({
                    displayLoader: false
                }, () => {
                    this.props.history.push(`/host/${this.state.hostPartyName}`)
                })

            }
        }).catch(error => {
            if (Number(error?.response?.status) === 400) {
                this.setState({
                    displayLoader: false,
                    displayHostPartyExistsError: true,
                    hostPartyErrorText: "The party already exists. Please use another name."
                })
            } else {
                this.setState({
                    displayLoader: false,
                    displayHostPartyExistsError: true,
                    hostPartyErrorText: "Request timed out"
                })
            }

        })

    }

    render() {
        const { classes } = this.props
        return (
            <div>

                {/* Carousel component */}
                <div className="carousel-container">
                    <Carousel />
                </div>

                {/* Tabs Component */}
                <div className={classes.tabsRootContainer}>

                    <TabContext
                        value={this.state.tabValue}
                        className={classes.tabContext}
                    >
                        <Tabs
                            variant="fullWidth"
                            value={this.state.tabValue}
                            onChange={(event, newValue) => {
                                this.setState({
                                    tabValue: newValue,
                                    guestPartyName: ""
                                })
                            }}
                            indicatorColor="none"
                        >
                            <Tab value={0} label="Join a Party" />
                            <Tab value={1} label="Host a Party" />
                        </Tabs>
                        <TabPanel
                            value={0}
                            className={classes.tabPanel}
                        >
                            <Loader display={this.state.displayLoader} />
                            <div className="tabpanel-inner-container">

                                <TextField
                                    className={classes.textFieldRoot}
                                    placeholder="Enter the party code"
                                    label="Party Name"
                                    required
                                    InputProps={{
                                        classes: {
                                            input: classes.textFieldInput,
                                            underline: classes.textFieldUnderlineRoot
                                        }
                                    }}
                                    InputLabelProps={{
                                        classes: {
                                            root: classes.textFieldLabelRoot,
                                            focused: "focused",
                                            error: "error"
                                        }
                                    }}
                                    error={
                                        this.state.guestPartyName === ""
                                            ? false
                                            : !this.state.guestPartyName.match(
                                                /^[a-z]+(-[a-z]+)*$/
                                            )
                                    }
                                    FormHelperTextProps={{
                                        className: classes.helperText
                                    }}
                                    helperText="Use only lowercase letters and '-'"
                                    onChange={(event) => {
                                        this.setState({
                                            guestPartyName: event.target.value
                                        })
                                    }}
                                    onKeyPress={(event) => {
                                        if (this.state.guestPartyName === ""
                                            ? false
                                            : this.state.guestPartyName.match(
                                                /^[a-z]+(-[a-z]+)*$/
                                            )) {
                                            if (event.code === "Enter")
                                                this.setState({
                                                    displayLoader: true
                                                }, this.handleGuestRequest)
                                        }
                                    }}
                                />
                                <Button
                                    className={classes.buttonRoot}
                                    disabled={
                                        this.state.guestPartyName === ""
                                            ? true
                                            : !this.state.guestPartyName.match(
                                                /^[a-z]+(-[a-z]+)*$/
                                            )
                                    }
                                    onClick={() => {
                                        this.setState({
                                            displayLoader: true
                                        }, this.handleGuestRequest)
                                    }}
                                >
                                    Submit
                                </Button>
                            </div>

                            {this.state.displayGuestPartyNotFoundError !== "" ?
                                <Alert
                                    severity="error"
                                    className={classes.alert}
                                    onClose={() => { this.setState({ displayGuestPartyNotFoundError: "" }) }}
                                >
                                    {this.state.displayGuestPartyNotFoundError}
                                </Alert>
                                : null}
                        </TabPanel>
                        <TabPanel
                            value={1}
                            className={classes.tabPanel}
                        >
                            <Loader display={this.state.displayLoader} />
                            <div className="tabpanel-inner-container">
                                <TextField
                                    className={classes.textFieldRoot}
                                    placeholder="Enter your name"
                                    label="Host Name"
                                    required
                                    InputProps={{
                                        classes: {
                                            input: classes.textFieldInput,
                                            underline: classes.textFieldUnderlineRoot
                                        }
                                    }}
                                    InputLabelProps={{
                                        classes: {
                                            root: classes.textFieldLabelRoot,
                                            focused: "focused",
                                            error: "error"
                                        }
                                    }}
                                    onChange={(event) => {
                                        this.setState({
                                            hostName: event.target.value
                                        })
                                    }}
                                />

                                <TextField
                                    className={classes.textFieldRoot}
                                    placeholder="Enter the party code"
                                    label="Party Name"
                                    required
                                    InputProps={{
                                        classes: {
                                            input: classes.textFieldInput,
                                            underline: classes.textFieldUnderlineRoot
                                        }
                                    }}
                                    InputLabelProps={{
                                        classes: {
                                            root: classes.textFieldLabelRoot,
                                            focused: "focused",
                                            error: "error"
                                        }
                                    }}
                                    error={
                                        this.state.hostPartyName === ""
                                            ? false
                                            : !this.state.hostPartyName.match(
                                                /^[a-z]+(-[a-z]+)*$/
                                            )
                                    }
                                    FormHelperTextProps={{
                                        className: classes.helperText
                                    }}
                                    helperText="Use only lowercase letters and '-'"
                                    onChange={(event) => {
                                        this.setState({
                                            hostPartyName: event.target.value
                                        })
                                    }}
                                    onKeyPress={(event) => {
                                        if ((this.state.hostName === "" || this.state.hostPartyName === "") ? false : this.state.hostPartyName.match(/^[a-z]+(-[a-z]+)*$/)) {
                                            if (event.code === "Enter")
                                                this.setState({
                                                    displayLoader: true
                                                }, this.handleHostRequest)
                                        }
                                    }}
                                />
                                <Button
                                    className={classes.buttonRoot}
                                    disabled={
                                        this.state.hostName === "" ||
                                            this.state.hostPartyName === ""
                                            ? true
                                            : !this.state.hostPartyName.match(
                                                /^[a-z]+(-[a-z]+)*$/
                                            )
                                    }
                                    onClick={() => {
                                        this.setState({
                                            displayLoader: true
                                        }, this.handleHostRequest)
                                    }}
                                >
                                    Submit
                                </Button>
                            </div>
                            {this.state.displayHostPartyExistsError ?
                                <Alert
                                    severity="error"
                                    className={classes.alert}
                                    onClose={() => { this.setState({ displayHostPartyExistsError: false, hostPartyErrorText: "" }) }}
                                >
                                    {this.state.hostPartyErrorText}
                                </Alert>
                                : null}
                        </TabPanel>

                    </TabContext>
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


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(Home));