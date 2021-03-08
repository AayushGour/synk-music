import { Button, Menu, MenuItem, Typography } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import SynkLogo from "./../../assets/images/Synklogo.png";
import "./Header.scss";
import { withStyles } from "@material-ui/core/styles";
import { isMobile } from "react-device-detect";
import SettingsIcon from "@material-ui/icons/Settings";
import * as Service from "./../Services/ServiceCalls";

const useStyles = () => ({
  typographyRoot: {
    fontFamily: "'Montserrat', sans-serif",
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
});

class Header extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      menuAnchor: null,
      displayBackdrop: false,
    };
    this.userData = JSON.parse(localStorage.getItem("userInfo"));
  }

  closeMenu = () => {
    this.setState({ menuAnchor: null, selectedItemIndex: null });
  };

  deletePartyFunction = () => {
    Service.deleteParty();
  };

  render() {
    const { classes } = this.props;
    return (
      <header className="header">
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
          <div className="settings-button-container">
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
                  // function to delete party
                  this.closeMenu();
                  this.setState({ displayBackdrop: true }, () => {
                    this.deletePartyFunction();
                  });
                }}
              >
                Delete Party
              </MenuItem>
              <MenuItem
                className={classes.menuItemRoot}
                onClick={() => {
                  // function to Logout
                  this.closeMenu();
                }}
              >
                Logout
              </MenuItem>
            </Menu>
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
