import { Typography } from "@material-ui/core";
import React, { Component } from "react";
import { isMobile } from "react-device-detect";
import "./Carousel.scss";
import { withStyles } from "@material-ui/core/styles"

const useStyles = () => ({
  sliderScreenText: {
    width: "80%",
    fontFamily: "Montserrat",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    position: "absolute"
    // fontSize:"40pt"
  },
  sliderScreenSubText: {
    // width: "80%",
    margin: "5px 0px",
    fontFamily: "Montserrat"
  }
})

export class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: this.props.currentView
    };
    this.slideIndex = 0;
    this.carouselInterval = null;
  }

  componentDidMount = () => {
    var count = 0;
    this.carouselInterval = setInterval(() => {
      count++;
      this.showSlides();
      if (count === 3) {
        clearInterval(this.carouselInterval);
        // this.props.displayTabs(true);
      }
    }, 3000);
  };

  componentWillUnmount=()=>{
    clearInterval(this.carouselInterval)
  }

  showSlides = () => {
    var slides = document.getElementsByClassName("slider-screen");
    var active = document.getElementsByClassName("active")[0];
    if (this.slideIndex !== 0) {
      active.classList.remove("active");
      active.classList.add("inactive");
    }
    active.addEventListener("animationend", () => {
      active.classList.remove("inactive");
    });
    slides[this.slideIndex].classList.add("active");
    if (this.slideIndex >= slides.length) {
      this.slideIndex = 0;
    }
    this.slideIndex++;
  };

  render() {
    const { classes } = this.props
    return (
      <div>
        <div>
          <div
            className="slider"
            style={{
              width: isMobile ? "90%" : "50%",
              height: isMobile? "30vh":"40vh",
              margin: "auto",
              position: "relative",
              overflow: "hidden",
              borderRadius: "5px",
              boxShadow: "0 0 10px white"
            }}
          >
            <div className="slider-screen active">
              <Typography
                variant={isMobile ? "subtitle1" : "h4"}
                className={classes.sliderScreenText}
              >
                Wanna share your music with your friends?
              </Typography>
            </div>
            <div className="slider-screen" >
              <Typography
                variant={isMobile ? "subtitle1" : "h4"}
                className={classes.sliderScreenText}
              >
                Do it in 3 simple steps
              </Typography>
            </div>
            <div className="slider-screen" >
              <div
                className={classes.sliderScreenText}
              >
                <Typography
                  variant={isMobile ? "subtitle1" : "h4"}
                  className={classes.sliderScreenSubText}
                >
                  1. Go to 'Host a Party'
                </Typography>
                <Typography
                  variant={isMobile ? "subtitle1" : "h4"}
                  className={classes.sliderScreenSubText}
                >
                  2. Set a name for your Party
                </Typography>
                <Typography
                  variant={isMobile ? "subtitle1" : "h4"}
                  className={classes.sliderScreenSubText}
                >
                  3. Share the link or the code
                </Typography>
                <Typography
                  variant={isMobile ? "subtitle1" : "h4"}
                  className={classes.sliderScreenSubText}
                >
                  Have fun!!!
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default withStyles(useStyles)(Carousel);
