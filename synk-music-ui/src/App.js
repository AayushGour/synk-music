import React, { Component } from 'react'
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './components/Home/Home';
import Background from './components/Background/Background';
import Header from './components/Header/Header';
import Host from './components/Host/Host'
import Party from './components/Party/Party'
import { Provider } from 'react-redux';
import store from "./redux/store"
import Error404 from './components/Error404/Error404';
import { Backdrop, Button, TextField, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import * as Service from './components/Services/ServiceCalls.js'
import { createBrowserHistory } from 'history';

const useStyles = () => ({
  deletePartyBackdrop: {
    backgroundColor: "#00000099",
    zIndex: "1",
  },
  typographyRoot: {
    color: "white",
    fontFamily: "Montserrat",
    margin: "10px"
  },
  areYouSureText: {
    color: "#01a4e9"
  },
  buttonRoot: {
    backgroundColor: "#1f1f1f",
    color: "#01a4e9",
    border: "2px solid #01a4e9",
    margin: "16px 10px 0px",
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
  textFieldRoot: {
    width: "100%",
    margin: "10px"
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
})

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayBackdrop: false,
      partyName: "",
      dialogText: ""
    };
  }

  displayDeletePartyBackdrop = (partyName) => {
    this.setState({ displayBackdrop: true, partyName: partyName })
  }

  deleteParty = () => {
    var party = { partyName: this.state.partyName }
    localStorage.clear();
    Service.deleteParty(party).then(response => {
      if (response.status === 200) {
        console.log(response.status, response.data)
        createBrowserHistory().push("/");
        window.location.reload();
      }
    }).catch(err => {
      console.error(err);
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <Provider store={store}>
        <div className="App">
          <BrowserRouter>

            {/* Display Background */}
            <Background />

            {/* Display Header */}
            <Backdrop
              open={this.state.displayBackdrop}
              className={classes.deletePartyBackdrop}
            >
              <div className="delete-party-modal">
                <div className="heading-div">
                  <Typography className={`${classes.typographyRoot} ${classes.areYouSureText}`} variant="h4">Are you sure?</Typography>
                  <Typography className={classes.typographyRoot}>This action CANNOT be undone. Please enter the name of the party, <code className="party-name-code">{this.state.partyName}</code> in the dialog box below.</Typography>
                </div>
                <div className="text-field-div">
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
                    error={this.state.partyName !== this.state.dialogText && this.state.dialogText.length !== 0}

                    onChange={(event) => {
                      this.setState({
                        dialogText: event.target.value
                      })
                    }}

                  />
                </div>
                <div className="buttons-div">
                  <Button
                    className={classes.buttonRoot}
                    disabled={this.state.dialogText !== this.state.partyName}
                    onClick={() => {
                      this.deleteParty()
                    }}
                  >Delete Party</Button>
                  <Button
                    className={classes.buttonRoot}
                    onClick={() => {
                      this.setState({ displayBackdrop: false })
                    }}
                  >Cancel</Button>
                </div>
              </div>

            </Backdrop>
            <Header displayDeletePartyBackdrop={this.displayDeletePartyBackdrop} />
            <Switch>
              <Route path="/host" component={Host} />
              <Route path="/party" component={Party} />
              <Route path="/" exact component={Home} />
              <Route path="/*" component={Error404} />
            </Switch>
          </BrowserRouter>
        </div>
      </Provider>
    );
  }
}

export default withStyles(useStyles)(App);
