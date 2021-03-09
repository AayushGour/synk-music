import { Typography } from '@material-ui/core';
import React, { Component } from 'react'
import "./Error404.scss"
import { withStyles } from "@material-ui/core/styles"

const useStyles = () => ({
    typographyRoot: {
        color: "black",
        fontFamily: "Montserrat",
    }
})


class Error404 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timer: 5
        };

    }

    componentDidMount = () => {
        this.timerFunction()
    }

    timerFunction = () => {
        setInterval(() => {
            if (this.state.timer > 0) {
                this.setState({
                    timer: this.state.timer - 1
                })
            }
            else {
                clearInterval()
                this.props.history.push("/")
            }
        }, 1000);
    }
    render() {
        const { classes } = this.props;
        return (
            <div className="error_page_container">
                <div className="content-container">
                    <div className="content-subcontainer" >
                        <Typography className={classes.typographyRoot} variant="h1">404</Typography>
                        <Typography className={classes.typographyRoot} variant="h3">Looks like you're lost!!!</Typography>
                    </div>
                    <div className="redirect_home">
                        <Typography className={classes.typographyRoot} variant="h5" >Let's get you home.</Typography>
                        <Typography className={classes.typographyRoot} variant="h5" >{`You'll be redirected in 00:0${this.state.timer}`}</Typography>
                    </div>

                </div>

            </div >
        );
    }
}

export default withStyles(useStyles)(Error404);