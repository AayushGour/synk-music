import React, { Component, createRef } from "react";
import "./Host.scss";
import { connect } from "react-redux";
import { isMobile } from "react-device-detect";
import Player from "../Player/Player";
import { TabContext, TabPanel } from "@material-ui/lab";
import {
    Grid,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Menu,
    MenuItem,
    RootRef,
    Tab,
    Tabs,
    TextField,
    Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFrown } from "@fortawesome/free-regular-svg-icons";
import { Delete, DragIndicator, MoreVert, Search } from "@material-ui/icons";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import * as Constants from "../../Constants.js";
import Loader from "../Loader/Loader";
import * as Service from "./../Services/ServiceCalls";
import Wave from "@foobar404/wave";
import socketIOClient from "socket.io-client";
import Tutorial from "../Tutorial/Tutorial";
import MobileTutorial from "../Mobile Tutorial/MobileTutorial";
import SwipeableViews from "react-swipeable-views";

const useStyles = () => ({
    tabsRootContainer: {
        width: "70%",
        margin: "auto",
        border: "2px solid white",
        borderRadius: "5px",
    },
    tabsRoot: {
        width: "70%",
    },
    leftTabsRoot: {
        background: "linear-gradient(to right, black, #252525)",
    },
    rightTabsRoot: {
        width: "70%",
        background: "linear-gradient(to left, black, #252525)",
    },
    tabPanel: {
        padding: "0px",
        height: "90%",
        width: "60%",
    },
    leftTabPanel: {
        background: "linear-gradient(to right, #101010, #252525)",
    },
    rightTabPanel: {
        background: "linear-gradient(to left, #101010, #252525)",
    },
    listRoot: {
        marginTop: "5px",
        width: "100%",
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
    },
    searchResultListItemRoot: {
        borderBottom: "1px solid",
        borderImage:
            "linear-gradient(to right, transparent 0%, #01a4e9 20%, white 40%, white 60%, #01a4e9 80%, transparent 100%) 1",
        "&:hover": {
            background: "#353535",
        },
        ".MuiTypography-colorTextSecondary": {
            color: "white",
        },
        ".MuiListItemText-primary": {
            color: "white",
        },
    },
    searchResultListItemTextPrimary: {
        color: "white",
        whiteSpace: "nowrap"
    },
    searchResultListItemTextSecondary: {
        color: "#ffffffbb",
        marginTop: "10px",
        whiteSpace: "nowrap"
    },
    textFieldRoot: {
        width: "80%",
        margin: "10px 0px 0px",
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
    helperText: {
        color: "white",
    },
    icons: {
        color: "white",
    },
    iconButton: {
        "&:hover": {
            backgroundColor: "#01a4e9ee",
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
    listItemRoot: {
        "&:hover": {
            backgroundColor: "#01a4e999",
        },
    },
});

class Host extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leftListTabValue: 0,
            rightListTabValue: 0,
            searchBarText: "",
            searchResults: [],
            currentSongUrl: "",
            loaderDisplay: false,
            selectedItemIndex: null,
            menuAnchor: null,
            songQueue: [
                // { title: "Blastoyz - Mandala", url: "https://www.youtube.com/watch?v=FHVD9ft_ANw" },
                // { title: "Memories", url: "https://www.youtube.com/watch?v=SlPhMPnQ58k" },
                // { title: "Freesol", url: "https://www.youtube.com/watch?v=7-9DJX8NlHU" },
            ],
            existingSongs: [
                // { title: "Blastoyz - Mandala", url: "https://www.youtube.com/watch?v=FHVD9ft_ANw" },
                // { title: "Memories", url: "https://www.youtube.com/watch?v=SlPhMPnQ58k" },
                // { title: "Freesol", url: "https://www.youtube.com/watch?v=7-9DJX8NlHU" },
            ],
            wave: new Wave(),
            tutorialScreen: 0,
            mobileTabsValue: 0,
            swipeableViewIndex: 0
        };
        this.socket = socketIOClient();
        this.myAudio = null;
        // this.playerRef = createRef();
    }

    componentDidMount = () => {
        // setting user details in store

        // getting the existing song list
        const partyName = window.location.pathname.split("/")[2];
        const party = { partyName: partyName, user: "host" }
        Service.checkPartyExists(party).then((response) => {
            if (response.status === 200) {
                this.props.dispatchToStore("SET_USER_DETAILS", {
                    hostName: response.data.hostName,
                    partyName: partyName,
                });
                // get tutorial status from backend
                // if tutorial status is true, display tutorial
                Service.getTutorialStatus(this.props.globalState.userData).then((response) => {
                    if (response.data) {
                        this.props.dispatchToStore("DISPLAY_TUTORIAL", {
                            displayTutorial: true,
                        });
                        // connecting to room
                        this.socket.emit(Constants.CONNECT_TO_ROOM, this.props.globalState.userData.partyName);
                    } else {
                        this.getExistingSongs();
                    }
                });
                // this.socket.on("play-pause", data => {
                //     if (data.refresh) {
                //         this.myAudio.load()
                //         this.myAudio.play()
                //     }
                //     this.setState({ loaderDisplay: false })
                // })
                // this.socket.on("song-updated", data => {
                //     if (data.refresh) {
                //         this.myAudio.load()
                //         this.myAudio.play()
                //     }
                //     this.setState({ loaderDisplay: false })
                // })
            }
        }).catch(error => {
            console.error(error);
            this.props.history.push("/ERROR")
        })

        this.myAudio = document.getElementById("audio");




        // sound visualizer
        this.state.wave.fromElement("audio", "canvas", {
            // options here
            type: "shine",
            colors: ["#01a4e9", "black"],
        });
        var index = 1;
        var test = 0;
        var interval = setInterval(() => {
            if (test <= 1) {
                this.setState({ circleOffset: index.toFixed(2) }, () => {
                    test = test + 0.01;
                    index = 1 - test / 2;
                });
            } else {
                clearInterval(interval);
            }
        }, 200);
        // if (this.props.globalState.displayTutorial) {
        //   console.log(this.props.globalState.displayTutorial);
        //   this.getExistingSongs();
        // }
    };

    getExistingSongs = () => {
        this.setState({ loaderDisplay: true }, () => {
            Service.getSongs(this.props.globalState.userData)
                .then((response) => {
                    if (response.status === 200) {
                        this.setState(
                            { existingSongs: response.data, loaderDisplay: false });
                    }
                })
                .catch((error) => {
                    console.error(error, error.response);
                    alert(error.response.data);
                });
        });
    };

    getVideoDetails = (item) => {
        if (item !== undefined && item !== "") {
            const getDataUrl =
                "https://www.youtube.com/oembed?url=" + item + "&format=json";

            fetch(getDataUrl, {
                mode: "cors",
                method: "GET",
            })
                .then((response) => {
                    return response.text();
                })
                .then((data) => {
                    data = JSON.parse(data);
                    data.songUrl = item;
                    var requestObject = {
                        url: item,
                        partyName: this.props.globalState.userData.partyName,
                    };
                    this.socket.emit(Constants.UPDATE_CURRENT_SONG, requestObject);
                    this.props.dispatchToStore("SET_SONG_DETAILS", data);
                })
                .catch((error) => console.error(error));
        }
    };

    reorderElements = (list, from, to) => {
        var queue = list;
        let cutOut = queue.splice(from, 1)[0]; // cut the element at index 'from'
        queue.splice(to, 0, cutOut); // insert it at index 'to'
        return queue;
    };

    onQueueDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items = this.reorderElements(
            this.state.songQueue,
            result.source.index,
            result.destination.index
        );
        if (items[0].url !== this.state.songQueue[0]) {
            this.getVideoDetails(items[0].url);
            this.socket.emit(Constants.UPDATE_CURRENT_SONG, {
                url: items[0].url,
                partyName: this.props.globalState.userData.partyName,
            });
            // this.myAudio.load();
        }
        this.setState({
            songQueue: items,
            loaderDisplay: false,
        });
    };

    setTutorialDetailsState = (state) => {
        console.log(state);
        this.setState(state);
    };

    getItemStyle = (isDragging, draggableStyle) => ({
        // styles we need to apply on draggables
        ...draggableStyle,

        ...(isDragging && {
            background: "#01a4e999",
            position: "static",
        }),
    });
    getListStyle = (isDraggingOver) => ({
        // background: isDraggingOver ? '#01a4e9' : 'lightgrey',
    });

    componentWillUnmount = () => {
        this.props.dispatchToStore("SET_USER_DETAILS", {
            hostName: "",
            partyName: "",
        });
        const songDetails = {
            title: "",
            songUrl: "",
            thumbnail_url: "",
        };
        this.props.dispatchToStore("SET_SONG_DETAILS", songDetails);
        document.body.onkeyup = null;
        // send request to backend to disable party
    };

    closeMenu = () => {
        this.setState({ menuAnchor: null, selectedItemIndex: null });
    };

    playNextSong = () => {
        var items = this.reorderElements(
            this.state.songQueue,
            0,
            this.state.songQueue.length
        );
        this.getVideoDetails(items[0].url);
        // this.socket.emit("change-current-song", { currentSong: items[0].url })
        // this.myAudio.load();
        this.setState({
            songQueue: items,
        });
    };
    playPreviousSong = () => {
        var items = this.reorderElements(
            this.state.songQueue,
            this.state.songQueue.length - 1,
            0
        );
        this.getVideoDetails(items[0].url);
        this.socket.emit("change-current-song", { currentSong: items[0].url });
        // this.myAudio.load();

        this.setState({
            songQueue: items,
        });
    };

    playSong = (index) => {
        if (this.state.songQueue[0] != undefined) {
            var songQueue = this.reorderElements(this.state.songQueue, index, 0);
            console.log(songQueue);
            this.getVideoDetails(songQueue[0].url);
            // change song
            this.setState({
                songQueue: songQueue,
            });
        }

        // this.socket.emit("play-pause", { currentSong: this.state.currentSongUrl, currentTime: this.myAudio.currentTime, status: !this.myAudio.paused })
    };

    addToQueue = () => {
        this.closeMenu();
        var songQueue = this.state.songQueue;
        var selectedSong = this.state.existingSongs[this.state.selectedItemIndex];
        // selectedSong.index = Math.random().toString(36).slice(2);
        songQueue.push(selectedSong);
        // if (songQueue[0].url !== this.state.currentSongUrl) {
        //     const newLocal = "update-current-song";
        //     this.socket.emit(newLocal, { currentSong: songQueue[0].url })
        //     // this.myAudio.load()
        // }
        if (songQueue.length === 1) {
            this.getVideoDetails(songQueue[0].url);
        }
        this.setState({ songQueue: songQueue });
    };

    youtubeSearchFunction = () => {
        this.setState({ loaderDisplay: true }, () => {
            var requestObject = {
                searchText: this.state.searchBarText,
                partyName: this.props.globalState.userData.partyName,
            };
            Service.youtubeSearch(requestObject).then((result) => {
                console.log(result);
                this.setState({
                    searchResults: result.data.items,
                    loaderDisplay: false,
                });
            });
        });
    };

    tutorialSearchFunction = () => {
        const songTitle = "Adele - Hello";
        var index = 0;
        console.log("here");
        var typingInterval = setInterval(() => {
            this.setState(
                { searchBarText: this.state.searchBarText + songTitle[index] },
                () => {
                    if (index === songTitle.length - 1) {
                        clearInterval(typingInterval);
                        this.youtubeSearchFunction();
                    } else {
                        index++;
                        console.log(this.state.searchBarText);
                    }
                }
            );
        }, 200);
    };

    render() {
        const { classes } = this.props;
        var existingSongsList = [];
        var queueSongsList = [];
        var searchResults = [];

        existingSongsList =
            this.state.existingSongs.length === 0
                ? []
                : this.state.existingSongs.sort().map((set, index) => {
                    return (
                        <ListItem
                            key={`${set.title}---index`}
                            className={classes.listItemRoot}
                            onClick={() => {
                                this.setState(
                                    {
                                        selectedItemIndex: index,
                                    },
                                    () => {
                                        this.addToQueue();
                                        if (isMobile) {
                                            this.setState({ mobileTabsValue: 0 });
                                        }
                                    }
                                );
                            }}
                        >
                            <ListItemText primary={set.title} />
                            <ListItemSecondaryAction>
                                <IconButton
                                    className={classes.iconButton}
                                    name={set.title}
                                    onClick={(event) => {
                                        this.setState({
                                            selectedItemIndex: index,
                                            menuAnchor: event.currentTarget,
                                        });
                                    }}
                                >
                                    <MoreVert className={classes.icons} />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    );
                });

        queueSongsList =
            this.state.songQueue.length === 0
                ? []
                : this.state.songQueue.map((set, index) => {
                    return (
                        <Draggable
                            key={`${set.title}--${index}`}
                            draggableId={`${set.title}-${index}`}
                            index={index}
                            style={(_isDragging, draggableStyle) => ({
                                ...draggableStyle,
                                position: "static",
                            })}
                        >
                            {(provided, snapshot) => (
                                <div
                                    {...provided.draggableProps.style}
                                    {...provided.draggableProps}
                                    ref={provided.innerRef}
                                    style={this.getItemStyle(
                                        snapshot.isDragging,
                                        provided.draggableProps.style
                                    )}
                                >
                                    <ListItem
                                        className={classes.listItemRoot}
                                        selected={this.state.selectedItemIndex === index}
                                        onClick={() => {
                                            this.playSong(index);
                                        }}
                                    >
                                        <ListItemIcon {...provided.dragHandleProps}>
                                            <DragIndicator className={classes.icons} />
                                        </ListItemIcon>
                                        <ListItemText primary={set.title} />

                                        <ListItemSecondaryAction>
                                            <IconButton
                                                className={classes.iconButton}
                                                name={set.title}
                                                onClick={(event) => {
                                                    var array = this.state.songQueue;
                                                    array.splice(index, 1);
                                                    this.setState({ songQueue: array }, () => {
                                                        if (array.length === 0) {
                                                            var data = {
                                                                title: "",
                                                                songUrl: "",
                                                                thumbnail_url: "",
                                                            };
                                                            console.log(array);
                                                            this.props.dispatchToStore(
                                                                "SET_SONG_DETAILS",
                                                                data
                                                            );
                                                        } else if (index === 0) {
                                                            this.getVideoDetails(array[0].url);
                                                        }
                                                    });
                                                }}
                                            >
                                                <Delete className={classes.icons} />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                        {/* {provided.placeholder} */}
                                    </ListItem>
                                </div>
                            )}
                        </Draggable>
                    );
                });

        searchResults =
            this.state.searchResults.length === 0
                ? []
                : this.state.searchResults
                    .filter((item) => {
                        return item.type === "video";
                    })
                    .map((item, index) => {
                        return (
                            <ListItem
                                className={classes.searchResultListItemRoot}
                                key={index}
                                onClick={() => {
                                    var existingSongs = this.state.existingSongs;
                                    var song = {
                                        title: item.title,
                                        url: item.url,
                                    };
                                    existingSongs.push(song);

                                    var existingSongsList = existingSongs.filter(
                                        (item, index, array) =>
                                            array.findIndex((elem) => elem.title === item.title) ===
                                            index
                                    );

                                    this.setState(
                                        {
                                            existingSongs: existingSongsList.sort(),
                                            searchBarText: "",
                                            searchResults: [],
                                        },
                                        () => {
                                            var data = this.props.globalState.userData;
                                            data.songs = this.state.existingSongs;
                                            Service.updateSongList(data);
                                            if (isMobile) {
                                                this.setState({ mobileTabsValue: 1 })
                                            } else {
                                                this.setState({
                                                    leftListTabValue: 0
                                                })
                                            }
                                        }
                                    );
                                }}
                            >
                                <img
                                    src={item.thumbnails[0].url}
                                    className="search-results-image"
                                    alt="Youtube Item"
                                />
                                <ListItemText
                                    primary={item.title}
                                    secondary={item.author.name}

                                    classes={{
                                        primary: classes.searchResultListItemTextPrimary,
                                        secondary: classes.searchResultListItemTextSecondary,
                                    }}
                                />
                            </ListItem>
                        );
                    });

        return (
            <div className="dashboard">

                {isMobile ? (
                    // Mobile Screens
                    <>
                        {this.props.globalState.displayTutorial && <MobileTutorial />}
                        <SwipeableViews index={this.state.swipeableViewIndex} style={{ height: "100%", width: "100%", overflow: "hidden" }} enableMouseEvents >
                            <div className="player-and-list-component screen-1">
                                <Player
                                    user="host"
                                    url={this.state.currentSongUrl}
                                    onPlayNextClicked={this.playNextSong}
                                    onPlayPreviousClicked={this.playPreviousSong}
                                />
                            </div>
                            <div className="screen-2">
                                <Tabs
                                    // className={classes.mobileTabsRoot}
                                    variant="fullWidth"
                                    value={this.state.mobileTabsValue}
                                    onChange={(event, newValue) => {
                                        this.setState({
                                            mobileTabsValue: newValue,
                                        });
                                    }}
                                    indicatorColor="none"
                                >
                                    <Tab value={0} label="Song Queue" />
                                    <Tab value={1} label="Existing Songs" />
                                    <Tab value={2} label="Add a song" />
                                    <Tab value={3} label="Chat" />
                                </Tabs>
                                {
                                    this.state.mobileTabsValue === 0 ?
                                        <div className="tab-panel tab-panel-0">
                                            <div className="tabpanel-inner-container">
                                                {this.state.songQueue.length === 0 ? (
                                                    <Typography variant="h5">
                                                        Queue is Empty <FontAwesomeIcon icon={faFrown} />
                                                    </Typography>
                                                ) : (
                                                    <DragDropContext
                                                        onDragEnd={(result) => this.onQueueDragEnd(result)}
                                                    >
                                                        <Droppable droppableId="droppable-queue">
                                                            {(provided, snapshot) => (
                                                                <RootRef rootRef={provided.innerRef}>
                                                                    <List
                                                                        className={classes.listRoot}
                                                                        style={this.getListStyle(
                                                                            snapshot.isDraggingOver
                                                                        )}
                                                                    >
                                                                        {queueSongsList}
                                                                        {provided.placeholder}
                                                                    </List>
                                                                </RootRef>
                                                            )}
                                                        </Droppable>
                                                    </DragDropContext>
                                                )}
                                            </div>
                                        </div>
                                        :
                                        this.state.mobileTabsValue === 1 ?
                                            <div className="tab-panel tab-panel-1">
                                                {/* Loader Display */}
                                                <Loader
                                                    background="linear-gradient(to right, #101010, #252525)"
                                                    display={this.state.loaderDisplay}
                                                    width="100%"
                                                    height="100%"
                                                />

                                                <div className="tabpanel-inner-container">
                                                    {existingSongsList.length === 0 ? (
                                                        <Typography variant="h5">
                                                            Your List is Empty <FontAwesomeIcon icon={faFrown} />
                                                        </Typography>
                                                    ) : (
                                                        <List className={classes.listRoot}>
                                                            {existingSongsList}
                                                        </List>
                                                    )}
                                                </div>
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
                                                            this.addToQueue();
                                                            this.setState({ mobileTabsValue: 0 })
                                                        }}
                                                    >
                                                        Add To Queue
                                                    </MenuItem>
                                                    <MenuItem
                                                        className={classes.menuItemRoot}
                                                        onClick={() => {
                                                            var existingSongsList = this.state.existingSongs;
                                                            existingSongsList.splice(
                                                                this.state.selectedItemIndex,
                                                                1
                                                            );
                                                            this.closeMenu();
                                                            this.setState(
                                                                { existingSongs: existingSongsList },
                                                                () => {
                                                                    var data = this.props.globalState.userData;
                                                                    data.songs = this.state.existingSongs;
                                                                    Service.updateSongList(data);
                                                                }
                                                            );
                                                        }}
                                                    >
                                                        Remove Song
                                                    </MenuItem>
                                                </Menu>
                                            </div>
                                            : this.state.mobileTabsValue === 2 ?
                                                <div className="tab-panel tab-panel-2">
                                                    <div className="tabpanel-inner-container">
                                                        <Grid
                                                            container
                                                            direction="column"
                                                            justify="flex-start"
                                                            alignItems="center"
                                                        >
                                                            <Grid
                                                                container
                                                                item
                                                                direction="row"
                                                                justify="center"
                                                                alignItems="flex-end"
                                                            >
                                                                <TextField
                                                                    className={classes.textFieldRoot}
                                                                    placeholder="Search"
                                                                    label="Search"
                                                                    value={this.state.searchBarText}
                                                                    fullWidth={true}
                                                                    autoFocus={true}
                                                                    InputProps={{
                                                                        startAdornment: (
                                                                            <InputAdornment position="start">
                                                                                <Search className={classes.icons} />
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
                                                                    onFocus={() => {
                                                                        document.body.onkeyup = null;
                                                                    }}
                                                                    onChange={(event) => {
                                                                        // Add action
                                                                        this.setState({
                                                                            searchBarText: event.target.value,
                                                                        });
                                                                    }}
                                                                    onKeyPress={(event) => {
                                                                        if (event.code === "Enter") {
                                                                            // send request to youtube developers
                                                                            document.body.onkeyup = (e) => {
                                                                                if (e.keyCode === 32) {
                                                                                    try {
                                                                                        this.handlePlayPause()
                                                                                    } catch (exception) {
                                                                                        console.log(exception)
                                                                                    }
                                                                                }
                                                                            }
                                                                            this.youtubeSearchFunction();
                                                                        }
                                                                    }}
                                                                />
                                                                <IconButton
                                                                    className={classes.iconButton}
                                                                    onClick={() => {
                                                                        // send request to youtube developers
                                                                        this.youtubeSearchFunction();
                                                                    }}
                                                                >
                                                                    <Search className={classes.icons} />
                                                                </IconButton>
                                                            </Grid>
                                                        </Grid>

                                                        <Grid item style={{ width: "100%", height: "100%" }}>
                                                            {/* Loader Display */}
                                                            <Loader
                                                                padding="0px"
                                                                background="linear-gradient(to right, #101010, #252525)"
                                                                display={this.state.loaderDisplay}
                                                                width="100%"
                                                                height="100%"
                                                            />
                                                            <List className={classes.listRoot}>
                                                                {searchResults}
                                                            </List>
                                                        </Grid>
                                                    </div>
                                                </div> :
                                                <div className="tab-panel tab-panel-2">
                                                    COMING SOON
                                            </div>
                                }
                            </div>
                        </SwipeableViews>
                    </>
                ) : (
                    //    Large Screens
                    <>
                        {this.props.globalState.displayTutorial ? (
                            <Tutorial
                                tutorialSearchFunction={() => this.tutorialSearchFunction()}
                                getExistingSongs={() => this.getExistingSongs()}
                                setTutorialComponentsState={(state) =>
                                    this.setTutorialDetailsState(state)
                                }
                            />
                        ) : null}
                        <div
                            className="hide-background"
                            style={{
                                display: this.props.globalState.displayTutorial
                                    ? "block"
                                    : "none",
                            }}
                        ></div>
                        <div className="player-and-list-component">
                            {/* Left List */}
                            <div
                                className="list-left"
                                style={{
                                    boxShadow:
                                        this.props.globalState.displayTutorial &&
                                            this.state.tutorialScreen !== 1 &&
                                            this.state.tutorialScreen !== 2 &&
                                            this.state.tutorialScreen !== 4 &&
                                            this.state.tutorialScreen !== 5
                                            ? "none"
                                            : "white 0px 0px 10px",
                                }}
                            >
                                <div
                                    style={{
                                        background: "rgba(0,0,0,0.8)",
                                        height: "100%",
                                        width: "50%",
                                        position: "absolute",
                                        top: "0",
                                        zIndex: "1",
                                        display: this.props.globalState.displayTutorial
                                            ? "block"
                                            : "none",
                                        animation:
                                            this.props.globalState.displayTutorial &&
                                                this.state.tutorialScreen !== 1 &&
                                                this.state.tutorialScreen !== 2 &&
                                                this.state.tutorialScreen !== 4 &&
                                                this.state.tutorialScreen !== 5
                                                ? "none"
                                                : "animate-div 1s ease-in-out forwards",
                                    }}
                                ></div>
                                <TabContext
                                    value={this.state.leftListTabValue}
                                    className={classes.tabContext}
                                >
                                    <Tabs
                                        className={`${classes.tabsRoot} ${classes.leftTabsRoot}`}
                                        variant="fullWidth"
                                        value={this.state.leftListTabValue}
                                        onChange={(event, newValue) => {
                                            this.setState({
                                                leftListTabValue: newValue,
                                            });
                                        }}
                                        indicatorColor="none"
                                    >
                                        <Tab value={0} label="Existing Songs" />
                                        <Tab value={1} label="Add a new Song" />
                                    </Tabs>
                                    {/* Left side tab Panel 1 */}
                                    <TabPanel
                                        value={0}
                                        className={`${classes.tabPanel} ${classes.leftTabPanel}`}
                                    >
                                        {/* Loader Display */}
                                        <Loader
                                            background="linear-gradient(to right, #101010, #252525)"
                                            display={this.state.loaderDisplay}
                                        />

                                        <div className="tabpanel-inner-container">
                                            {existingSongsList.length === 0 ? (
                                                <Typography variant="h5">
                                                    Your List is Empty <FontAwesomeIcon icon={faFrown} />
                                                </Typography>
                                            ) : (
                                                <List className={classes.listRoot}>
                                                    {existingSongsList}
                                                </List>
                                            )}
                                        </div>
                                        <Menu
                                            className={classes.menuRoot}
                                            anchorEl={this.state.menuAnchor}
                                            onClose={this.closeMenu}
                                            keepMounted
                                            open={Boolean(this.state.menuAnchor)}
                                        >
                                            <MenuItem
                                                className={classes.menuItemRoot}
                                                onClick={this.addToQueue}
                                            >
                                                Add To Queue
                      </MenuItem>
                                            <MenuItem
                                                className={classes.menuItemRoot}
                                                onClick={() => {
                                                    var existingSongsList = this.state.existingSongs;
                                                    existingSongsList.splice(
                                                        this.state.selectedItemIndex,
                                                        1
                                                    );
                                                    this.closeMenu();
                                                    this.setState(
                                                        { existingSongs: existingSongsList },
                                                        () => {
                                                            var data = this.props.globalState.userData;
                                                            data.songs = this.state.existingSongs;
                                                            Service.updateSongList(data);
                                                        }
                                                    );
                                                }}
                                            >
                                                Remove Song
                      </MenuItem>
                                        </Menu>
                                    </TabPanel>

                                    {/* Left side Tab Panel 2 */}
                                    <TabPanel
                                        value={1}
                                        className={`${classes.tabPanel} ${classes.leftTabPanel}`}
                                    >
                                        <div className="tabpanel-inner-container">
                                            <Grid
                                                container
                                                direction="column"
                                                justify="flex-start"
                                                alignItems="center"
                                            >
                                                <Grid
                                                    container
                                                    item
                                                    direction="row"
                                                    justify="center"
                                                    alignItems="flex-end"
                                                >
                                                    <TextField
                                                        className={classes.textFieldRoot}
                                                        placeholder="Search"
                                                        label="Search"
                                                        value={this.state.searchBarText}
                                                        fullWidth={true}
                                                        autoFocus={true}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Search className={classes.icons} />
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
                                                        onFocus={() => {
                                                            document.body.onkeyup = null;
                                                        }}
                                                        onChange={(event) => {
                                                            // Add action
                                                            this.setState({
                                                                searchBarText: event.target.value,
                                                            });
                                                        }}
                                                        onKeyPress={(event) => {
                                                            if (event.code === "Enter") {
                                                                // send request to youtube developers
                                                                document.body.onkeyup = (e) => {
                                                                    if (e.keyCode === 32) {
                                                                        try {
                                                                            this.handlePlayPause()
                                                                        } catch (exception) {
                                                                            console.log(exception)
                                                                        }
                                                                    }
                                                                }
                                                                this.youtubeSearchFunction();
                                                            }
                                                        }}
                                                    />
                                                    <IconButton
                                                        className={classes.iconButton}
                                                        onClick={() => {
                                                            // send request to youtube developers
                                                            this.youtubeSearchFunction();
                                                        }}
                                                    >
                                                        <Search className={classes.icons} />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>

                                            <Grid item style={{ width: "100%", height: "85%" }}>
                                                {/* Loader Display */}
                                                <Loader
                                                    padding="0px"
                                                    background="linear-gradient(to right, #101010, #252525)"
                                                    display={this.state.loaderDisplay}
                                                />
                                                <List className={classes.listRoot}>
                                                    {searchResults}
                                                </List>
                                            </Grid>
                                        </div>
                                    </TabPanel>
                                </TabContext>
                            </div>

                            {/* player container */}
                            <div
                                className="player-container"
                                style={{
                                    animationName: this.props.globalState.displayTutorial
                                        ? "change-aura-tutorial"
                                        : "change-aura",
                                }}
                            >
                                <div
                                    style={{
                                        background: "rgba(0,0,0,0.8)",
                                        height: "100%",
                                        width: "100%",
                                        position: "absolute",
                                        top: "0",
                                        zIndex: "1",
                                        display: this.props.globalState.displayTutorial
                                            ? "block"
                                            : "none",
                                    }}
                                ></div>
                                <Player
                                    user="host"
                                    url={this.state.currentSongUrl}
                                    onPlayNextClicked={this.playNextSong}
                                    onPlayPreviousClicked={this.playPreviousSong}
                                />
                            </div>

                            {/* Right List */}
                            <div
                                className="list-right"
                                style={{
                                    boxShadow:
                                        this.props.globalState.displayTutorial &&
                                            this.state.tutorialScreen !== 3 &&
                                            this.state.tutorialScreen !== 4
                                            ? "none"
                                            : "white 0px 0px 10px",
                                }}
                            >
                                <div
                                    style={{
                                        background: "rgba(0,0,0,0.8)",
                                        height: "100%",
                                        width: "50%",
                                        position: "absolute",
                                        top: "0",
                                        zIndex: "1",

                                        display: this.props.globalState.displayTutorial
                                            ? "block"
                                            : "none",
                                        animation:
                                            this.props.globalState.displayTutorial &&
                                                this.state.tutorialScreen !== 3 &&
                                                this.state.tutorialScreen !== 4
                                                ? "none"
                                                : "animate-div 1s ease-in-out forwards",
                                    }}
                                ></div>
                                <TabContext
                                    value={this.state.rightListTabValue}
                                    className={classes.tabContext}
                                >
                                    <Tabs
                                        className={`${classes.tabsRoot} ${classes.rightTabsRoot}`}
                                        variant="fullWidth"
                                        value={this.state.rightListTabValue}
                                        onChange={(event, newValue) => {
                                            this.setState({
                                                rightListTabValue: newValue,
                                            });
                                        }}
                                        indicatorColor="none"
                                    >
                                        <Tab value={0} label="Queue" />
                                        <Tab value={1} label="Chat" />
                                    </Tabs>
                                    <TabPanel
                                        value={0}
                                        className={`${classes.tabPanel} ${classes.rightTabPanel}`}
                                    >
                                        <div className="tabpanel-inner-container">
                                            {this.state.songQueue.length === 0 ? (
                                                <Typography variant="h5">
                                                    Queue is Empty <FontAwesomeIcon icon={faFrown} />
                                                </Typography>
                                            ) : (
                                                <DragDropContext
                                                    onDragEnd={(result) => this.onQueueDragEnd(result)}
                                                >
                                                    <Droppable droppableId="droppable-queue">
                                                        {(provided, snapshot) => (
                                                            <RootRef rootRef={provided.innerRef}>
                                                                <List
                                                                    className={classes.listRoot}
                                                                    style={this.getListStyle(
                                                                        snapshot.isDraggingOver
                                                                    )}
                                                                >
                                                                    {queueSongsList}
                                                                    {provided.placeholder}
                                                                </List>
                                                            </RootRef>
                                                        )}
                                                    </Droppable>
                                                </DragDropContext>
                                            )}
                                        </div>
                                    </TabPanel>
                                    <TabPanel
                                        value={1}
                                        className={`${classes.tabPanel} ${classes.rightTabPanel}`}
                                    >
                                        <span style={{ fontFamily: "Montserrat" }}>
                                            COMING SOON
                                        </span>
                                    </TabPanel>
                                </TabContext>
                            </div>
                        </div>
                    </>
                )}
            </div>
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
)(withStyles(useStyles)(Host));
