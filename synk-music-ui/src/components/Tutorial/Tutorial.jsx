import { Backdrop, IconButton, Typography } from '@material-ui/core';
import React, { Component } from 'react'
import "./Tutorial.scss"
import { withStyles } from "@material-ui/core/styles"
import { connect } from 'react-redux';
import { Close, NavigateBefore, NavigateNext } from '@material-ui/icons';
import * as Service from "./../Services/ServiceCalls"


const useStyles = () => ({
    backdropRoot: {
        backgroundColor: "transparent",
        zIndex: "10"
    },
    closeButtonRoot: {
        color: "lightgray",
        borderRadius: "50%",
        border: "1px solid lightgray",
        backgroundColor: "#01a4e930",
        margin: "10px",
        transition: "0.5s",
        "&:hover": {
            backgroundColor: "#ff0000dd",
            color: "white"
        }
    },
    closeButtonRootBlink: {
        margin: "10px",
        borderRadius: "50%",
        border: "1px solid lightgray",
        backgroundColor: "#ff0000dd",
        color: "white",
        animation: "blink-button 1s infinite",
        transition: "0.5s",
        "&:hover": {
            backgroundColor: "#ff0000dd",
            color: "white",
            animation: "none"
        }
    },
    typographyRoot: {
        fontFamily: "'Montserrat', sans-serif",
        marginBottom: "30px",
        color: "white",
    },
    navigatorTypographyRoot: {
        fontFamily: "'Montserrat', sans-serif",
        // marginBottom: "50px",
        color: "white",
    },
    navigationButtonsRoot: {
        color: "white",
        borderRadius: "50%",
        backgroundColor: "#01a4e930",
        margin: "10px",
        border: "1px solid lightgrey",
        "&:hover": {
            backgroundColor: "#01a4e9aa"
        },
        "&:disabled": {
            color: "grey"
        }
    },
    mouseIconRoot: {
        transform: "scale(1.5) scaleX(-1)",
        marginTop: "48px"
    }
})

class Tutorial extends Component {
    constructor(props) {
        super(props);
        this.state = {
            existingSongs: [
                { title: "Blastoyz - Mandala", url: "https://www.youtube.com/watch?v=FHVD9ft_ANw", index: "j3fmtl59jxn" },
                { title: "Queen – Bohemian Rhapsody (Official Video Remastered)", url: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ" },
                { title: "Melanie Martinez - Play Date (Lyrics)", url: "https://www.youtube.com/watch?v=xhaI-lLiUFA" },
            ],
            tutorialScreen: 0,
            totalScreens: 5,
        };
    }
    componentDidMount = () => {
        var state = []
        state.existingSongs = this.state.existingSongs;
        state.tutorialScreen = this.state.tutorialScreen;
        this.props.setTutorialComponentsState(state)
    }

    handleClose = () => {
        // get current songs from backend and reset existing songs queue
        this.props.getExistingSongs()
        // send request to backend also
        this.props.dispatchToStore("DISPLAY_TUTORIAL", { displayTutorial: false })
        Service.updateTutorialStatus({ partyName: this.props.globalState.userData.partyName, tutorialStatus: false })
    }

    navigationButtons = (classes) => {
        return (
            <div className="footer-navigation-root">
                <div className="navigation-buttons-div">
                    <IconButton
                        className={classes.navigationButtonsRoot}
                        disabled={this.state.tutorialScreen === 0 ? true : false}
                        onClick={() => {
                            this.setState({ tutorialScreen: this.state.tutorialScreen - 1 }, () => {
                                var state = {};
                                state.tutorialScreen = this.state.tutorialScreen;
                                if (this.state.tutorialScreen === 0) {
                                    state.existingSongs = this.state.existingSongs
                                } else if (this.state.tutorialScreen === 1) {
                                    state.leftListTabValue = 0
                                    state.searchBarText = "";
                                    state.searchResults = []
                                } else if (this.state.tutorialScreen === 2) {
                                    this.props.tutorialSearchFunction()
                                    state.leftListTabValue = 1
                                } else if (this.state.tutorialScreen === 5) {
                                    state.searchResults = []
                                    state.searchBarText = "";
                                    state.leftListTabValue = 1
                                } else {
                                    state.leftListTabValue = 0;
                                    state.searchResults = []
                                    state.searchBarText = "";
                                }
                                this.props.setTutorialComponentsState(state)
                            })
                        }}
                    >
                        <NavigateBefore />
                    </IconButton>
                    <IconButton
                        className={classes.navigationButtonsRoot}
                        disabled={this.state.tutorialScreen === this.state.totalScreens ? true : false}
                        onClick={() => {
                            this.setState({ tutorialScreen: this.state.tutorialScreen + 1 }, () => {
                                var state = {};
                                state.tutorialScreen = this.state.tutorialScreen;
                                if (this.state.tutorialScreen === 0) {
                                    state.existingSongs = this.state.existingSongs
                                } else if (this.state.tutorialScreen === 1) {
                                    state.leftListTabValue = 0
                                    state.searchBarText = "";
                                    state.searchResults = []
                                } else if (this.state.tutorialScreen === 2) {
                                    this.props.tutorialSearchFunction()
                                    state.leftListTabValue = 1
                                } else if (this.state.tutorialScreen === 5) {
                                    state.searchResults = []
                                    state.searchBarText = "";
                                    state.leftListTabValue = 1
                                } else {
                                    state.leftListTabValue = 0
                                    state.searchResults = []
                                    state.searchBarText = "";
                                }
                                this.props.setTutorialComponentsState(state)
                            })
                        }}
                    >
                        <NavigateNext />
                    </IconButton>
                </div>
                {this.state.tutorialScreen !== 0 ?
                    <div className="navigator">
                        <Typography variant="subtitle1" className={classes.navigatorTypographyRoot}>{`${this.state.tutorialScreen}/${this.state.totalScreens}`}</Typography>
                    </div>
                    : null}
            </div>
        )
    }
    render() {
        const { classes } = this.props

        var page;
        if (this.state.tutorialScreen === 0) {
            page = <div className="tutorial-pages page0">
                <div className="text-div-page0">
                    <Typography
                        variant="h2"
                        className={classes.typographyRoot}
                    >Welcome To <span className="blue-text-span">Synk Music</span></Typography>
                    <Typography
                        variant="h5"
                        className={classes.typographyRoot}
                    >This tutorial will walk you through the page</Typography>
                </div>
                {this.navigationButtons(classes)}
            </div>
        } else if (this.state.tutorialScreen === 1) {
            page = <div className="tutorial-pages page1">
                <div className="text-div-page1">
                    <Typography
                        variant="h4"
                        className={classes.typographyRoot}
                    >This is the <span className="blue-text-span">Existing Songs</span> tab.</Typography>
                    <Typography
                        variant="h5"
                        className={classes.typographyRoot}
                    >You can find all the songs which you add here.</Typography>

                </div>

                {this.navigationButtons(classes)}
            </div>
        } else if (this.state.tutorialScreen === 2) {
            page = <div className="tutorial-pages page2">
                <div className="text-div-page2">
                    <Typography
                        variant="h4"
                        className={classes.typographyRoot}
                    >This is the <span className="blue-text-span">Add a Song</span> tab.</Typography>
                    <Typography
                        variant="h5"
                        className={classes.typographyRoot}
                    ><span className="blue-text-span">Synk Music</span> uses Youtube API in order to fetch songs.</Typography>
                    <Typography
                        variant="h5"
                        className={classes.typographyRoot}
                    >Just enter the name of the song in the Search box and select the song.</Typography>
                </div>
                {this.navigationButtons(classes)}
            </div>
        } else if (this.state.tutorialScreen === 3) {
            page = <div className="tutorial-pages page3">
                <div className="text-div-page3">
                    <Typography
                        variant="h4"
                        className={classes.typographyRoot}
                    >This is the <span className="blue-text-span">Queue</span> tab.</Typography>
                    <Typography
                        variant="h5"
                        className={classes.typographyRoot}
                    >You can add songs from the <span className="blue-text-span">Existing Songs</span> tab here.</Typography>

                </div>


                {this.navigationButtons(classes)}
            </div>
        } else if (this.state.tutorialScreen === 4) {
            page = <div className="tutorial-pages page4">
                <div className="text-div-page3">
                    <Typography
                        variant="h5"
                        className={classes.typographyRoot}
                    >Just click on the name of the song and it gets added to the queue</Typography>
                </div>
                {this.navigationButtons(classes)}
            </div>
        } else if (this.state.tutorialScreen === 5) {
            page = <div className="tutorial-pages page5">
                <div className="text-div-page3">
                    <Typography
                        variant="h4"
                        className={classes.typographyRoot}
                    >Let's get you started</Typography>
                    <Typography
                        variant="h5"
                        className={classes.typographyRoot}
                    >Try adding a song</Typography>
                </div>

                {this.navigationButtons(classes)}
            </div>
        } else if (this.state.tutorialScreen === 6) {
            page = <div className="tutorial-pages page6">

                {this.navigationButtons(classes)}
            </div>
        }


        return (
            <Backdrop
                open={this.props.globalState.displayTutorial}
                className={classes.backdropRoot}
            // onClick={this.handleClose}
            >
                <div className="tutorial-root"
                    style={{
                        // backgroundColor: "rgba(0,0,0,0.8)"
                    }}
                >
                    <div className="close-button-container">
                        <IconButton className={this.state.tutorialScreen === this.state.totalScreens ? classes.closeButtonRootBlink : classes.closeButtonRoot}
                            onClick={this.handleClose}
                        >
                            <Close />
                        </IconButton>
                    </div>
                    {page}

                </div>
            </Backdrop>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(Tutorial));