import { Backdrop, Button, Dialog, IconButton, InputAdornment, Menu, MenuItem, Modal, Snackbar, TextField, Typography } from "@material-ui/core";
import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import SynkLogo from "./../../assets/images/Synklogo.png";
import "./Header.scss";
import { withStyles } from "@material-ui/core/styles";
import { isMobile } from "react-device-detect";
import SettingsIcon from "@material-ui/icons/Settings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import {
    FacebookShareButton,
    FacebookMessengerShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    FacebookIcon,
    FacebookMessengerIcon,
    TwitterIcon,
    WhatsappIcon,

} from "react-share";
import { Close } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";

const useStyles = () => ({
    typographyRoot: {
        fontFamily: "'Montserrat', sans-serif",
        color: "white"
    },
    buttonRoot: {
        color: "white",
        padding: "6px",
        width: "fit-content",
        minWidth: "fit-content",
        borderRadius: "50%",
        "&:hover": {
            backgroundColor: "#01a4e999",
        },
    },
    menuRoot: {
        // backgroundColor: "black"
        "& .MuiPaper-root": {
            backgroundColor: "#333333",
            color: "white",
        },
    },
    menuItemRoot: {
        "&:hover": {
            backgroundColor: "#01a4e9",
        },
    },
    textFieldRoot: {
        width: "100%",
        margin: "10px",
        outline: "none",
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "#01a4e9"
        }
    },
    textFieldLabelRoot: {
        color: "#a9a9a9",
        "&.focused": {
            color: "#01a4e9",
        },
        "&.error": {
            color: "#f44336",
        },
    },
    textFieldUnderlineRoot: {
        "&::after": {
            borderBottom: "2px solid #01a4e9",
        },
        "&::before": {
            borderBottom: "2px solid #a9a9a9",
        },
        "&&:hover:before": {
            borderBottom: "2px solid #efeffa",
        },
    },
    textFieldInput: {
        color: "white",
    },
    shareModalRoot: {
        padding: "10px",
        backgroundColor: "#303030",
        height: "fit-content",
        width: "fit-content",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute !important",
        top: "50% !important",
        left: "50% !important",
        transform: "translate(-50%, -50%)",
        borderRadius: "10px",
        boxShadow: "0 0 10px white",
        overflow: "hidden",
        outline: "none"
    },
    iconButton: {
        color: "white",
        "&:hover": {
            backgroundColor: "#505050",
        }
    },
    closeButton: {
        color: "white",
        position: "absolute",
        right: "0",
        margin: "10px",
        padding: "5px",
        "&:hover": {
            backgroundColor: "red"
        }
    },
    // alert: {
    //     color: "rgb(250, 179, 174)",
    //     backgroundColor: "#180606",
    //     width: isMobile ? "80%" : "50%",
    //     border: "2px solid red",
    //     borderRadius: "5px",
    //     margin: "0px 0px 20px",
    // },
    snackbar: {
        width: "100%"
    }
});

class Header extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            menuAnchor: null,
            displayBackdrop: false,
            shareModal: false,
            shareText: "",
            shareUrl: "",
            displayAlert: false
        };
        this.userData = JSON.parse(localStorage.getItem("userInfo"));
        this.shareLinkRef = createRef();
    }
    setShareText = () => {
        var url = `${window.location.origin}/party/${window.location.pathname.split("/")[2]}`;
        var text = "Hey, join me on my musical adventure. Follow the link below -\n" + url
        this.setState({ shareUrl: url, shareText: text })
    }

    closeMenu = () => {
        this.setState({ menuAnchor: null, selectedItemIndex: null });
    };

    shareModalDisplay = () => {
        this.setShareText();
        this.setState({ shareModal: true })
    }

    render() {
        const { classes } = this.props;
        return (
            <header className="header">
                <Modal className={classes.shareModalRoot} open={this.state.shareModal}>
                    <div className="modal-root-div">
                        <div className="modal-header">
                            <Typography variant="h6" className={classes.typographyRoot}>Share</Typography>
                            <IconButton className={`${classes.iconButton} ${classes.closeButton}`}
                                onClick={() => { this.setState({ shareModal: false }) }}
                            ><Close /></IconButton>
                        </div>
                        <TextField
                            inputRef={this.shareLinkRef}
                            className={classes.textFieldRoot}
                            value={this.state.shareUrl}
                            fullWidth={true}
                            autoFocus={true}
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton className={classes.iconButton}
                                            onClick={() => {
                                                this.shareLinkRef.current.select();
                                                document.execCommand("copy");
                                                this.setState({ displayAlert: true })
                                            }}>
                                            <FontAwesomeIcon icon={faCopy} size="sm" style={{ color: "white" }} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                classes: {
                                    input: classes.textFieldInput,
                                    underline: classes.textFieldUnderlineRoot,
                                },
                            }}
                            InputLabelProps={{
                                classes: {
                                    root: classes.textFieldLabelRoot,
                                    focused: "focused",
                                    error: "error",
                                },
                            }}
                        />
                        <div>
                            <FacebookMessengerShareButton
                                url={this.state.shareText}
                                className="share-icon-button"
                            >
                                <FacebookMessengerIcon size={48} round />
                            </FacebookMessengerShareButton>
                            <FacebookShareButton
                                url={this.state.shareText}
                                className="share-icon-button"
                            >
                                <FacebookIcon size={48} round />
                            </FacebookShareButton>
                            <TwitterShareButton
                                url={this.state.shareText}
                                className="share-icon-button"
                            >
                                <TwitterIcon size={48} round />
                            </TwitterShareButton>
                            <WhatsappShareButton
                                url={this.state.shareText}
                                className="share-icon-button"
                            >
                                <WhatsappIcon size={48} round />
                            </WhatsappShareButton>
                        </div>
                        <Snackbar open={this.state.displayAlert}
                            // autoHideDuration={6000}
                            onClose={() => { this.setState({ displayAlert: false }) }}
                            className={classes.snackbar}
                        >
                            <Alert
                                severity="success"
                                className={classes.alert}
                                onClose={() => { this.setState({ displayAlert: false }) }}
                            >
                                Link Copied to Clipboard
                        </Alert>

                        </Snackbar>
                    </div>
                </Modal>
                <div className="logo-container">
                    <img id="header-logo" src={SynkLogo} alt="Synk Logo" />
                    <Typography
                        variant={isMobile ? "body1" : "h4"}
                        id="header-logo-text"
                        noWrap={true}
                    >
                        Synk Music
                    </Typography>
                </div>
                <div className="header-right-container">
                    <div className="user-details-container">
                        <Typography
                            className={classes.typographyRoot}
                            variant={isMobile ? "caption" : "h5"}
                            noWrap={true}
                        >
                            {this.props.globalState.userData.hostName !== ""
                                ? `${this.props.globalState.userData.hostName}'s Party`
                                : ""}
                        </Typography>
                        <Typography
                            className={classes.typographyRoot}
                            variant={isMobile ? "caption" : "h6"}
                            noWrap={true}
                        >
                            {this.props.globalState.userData.partyName}
                        </Typography>
                    </div>
                    <div className="settings-button-container"
                        style={{
                            display: this.props.globalState.userData.hostName !== "" ? "block" : "none"
                        }}>
                        <Button
                            className={classes.buttonRoot}
                            onClick={(event) => {
                                this.setState({
                                    menuAnchor: event.currentTarget,
                                });
                            }}
                        >
                            <SettingsIcon />
                        </Button>
                        {window.location.pathname.split("/")[1] === "host" ?
                            <Menu
                                className={classes.menuRoot}
                                anchorEl={this.state.menuAnchor}
                                onClose={this.closeMenu}
                                keepMounted
                                open={Boolean(this.state.menuAnchor)}
                            >
                                <MenuItem
                                    className={classes.menuItemRoot}
                                    onClick={() => {
                                        this.closeMenu();
                                        //Share thingy
                                        this.shareModalDisplay();
                                    }}
                                >
                                    Share
                                </MenuItem>
                                <MenuItem
                                    className={classes.menuItemRoot}
                                    onClick={() => {
                                        this.closeMenu();
                                        this.props.dispatchToStore("DISPLAY_TUTORIAL", {
                                            displayTutorial: true,
                                        });
                                    }}
                                >
                                    Show Tutorial
                                </MenuItem>
                                <MenuItem
                                    className={classes.menuItemRoot}
                                    onClick={() => {
                                        this.closeMenu();
                                        // function to delete party
                                        this.props.displayDeletePartyBackdrop(this.props.globalState.userData.partyName);
                                    }}
                                >
                                    Delete Party
                                </MenuItem>
                                <MenuItem
                                    className={classes.menuItemRoot}
                                    onClick={() => {
                                        this.closeMenu();
                                        // function to Logout
                                    }}
                                >
                                    Logout
                                </MenuItem>
                            </Menu>
                            :
                            <Menu
                                className={classes.menuRoot}
                                anchorEl={this.state.menuAnchor}
                                onClose={this.closeMenu}
                                keepMounted
                                open={Boolean(this.state.menuAnchor)}
                            >
                                <MenuItem
                                    className={classes.menuItemRoot}
                                    onClick={() => {
                                        this.closeMenu();
                                        //Share thingy
                                        this.shareModalDisplay();
                                    }}
                                >
                                    Share
                                </MenuItem>
                            </Menu>
                        }
                    </div>
                </div>
            </header>
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
)(withStyles(useStyles)(Header));
