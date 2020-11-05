import React from 'react';

import {CardActions,Card, CardHeader,CardContent, Typography, IconButton,Avatar, CardActionArea} from '@material-ui/core';
import FacebookEmbeds from './facebookEmbeds';
import TwitterEmbeds from './twitterEmbeds';
import RedditEmbeds from './redditEmbeds';
import InsEmbeds from './insEmbeds';

import ReactDOM from 'react-dom'
import { withStyles } from "@material-ui/core/styles";
import CommentIcon from '@material-ui/icons/Comment';
import Rate from "./like";

import PropTypes from 'prop-types';


import ShareMenu from '../post/ShareMenu';
import PostComment from '../post/PostComment';

import {Box, Divider } from "@material-ui/core";


import FaceIcon from '@material-ui/icons/Face';
import LaunchIcon from '@material-ui/icons/Launch';


import { Button, Form } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const REPLIES = '/postReply/'

const styles = theme => ({
    root: {
        backgroundColor: "#00000060"
        //width: "300px",
    },
    content: {
        overflow: "hidden", /* will contain if #first is longer than #second */
        paddingTop: "80px",
    },
    menu: {
        float: "left",
        //display: "inline-block",
        paddingTop: "20px",
        width: "30%",
        borderRight: "solid white",
        textAlign: "center",
    },
    option: {
        marginBottom: "30px"
    },

    profile: {
        overflow: "hidden",
        //height:"100%",
        //display: "inline-block",
    },
    leftProfile: {
        //marginLeft:"30px",
        //paddingTop: "40px",
        float: "left",
        width: "30%",
        textAlign: "center",

        //height:"100%",
        //display: "inline-block",
    },
    rightProfile: {
        overflow: "hidden",
        //height:"100%",
        //display: "inline-block",
    },
    bottomProfile: {
        //overflow: "hidden",
        position: "relative",
        //height:"100%",
        //display: "inline-block",
        textAlign: "center",
    },
    blueText: {
        color: "#0099ff",
        fontSize: "16px"
    },
    note: {
        color: "white",
        fontSize: "13px",
        // width:"50%",
        // textAlign: "center",
    },
    inputField: {
        //color: "white",
        backgroundColor: "transparent",
        color: "white",
        width: "50%",
        marginTop: "20px",
    },
    inputFieldShort: {
        //color: "white",
        backgroundColor: "transparent",
        color: "white",
        width: "24%",
        marginRight: "1%",
        marginLeft: "1%",
        marginTop: "20px",
    },
    submitButton: {
        marginTop: "20px",
        marginBottom: "20px",
        color: "white",
        backgroundColor: "#0066cc",
    },
    cancleButton: {
        marginTop: "20px",
        marginBottom: "20px",
        color: "white",
        backgroundColor: "#333333",
    },
    cardArea: {
        maxWidth: "600px",
        marginTop: "60px",
        marginLeft: "auto",
        marginRight: "auto",
        width: "60vw",
    },
    card:{
        width:'60%',
        marginTop:'15px',
        marginLeft:'3%',
        borderLeftWidth: "5px",
        borderLeftStyle: "solid",
        borderLeftColor:"#757ce8"
    },
    embeds:{
        backgroundColor: "#303030",  
    },
    url:{
        color:"#757ce8",
    },


    cardRoot: {
        overflow: "hidden",
        backgroundColor: "#00000060",
        paddingBottom: "15px"
    },
    userIcon: {
        float: "left",
        fontSize: "60px",
        margin: "12px"

    },
    launchIcon: {
        float: "right",
        //fontSize: "60px",
    },
    cardContent: {
        overflow: "hidden",
        paddingLeft: "0",
        "&:last-child": {
            paddingBottom: 0
        }
    },
    cardAction: {
        paddingLeft: "0",
    },
    cardName: {
        fontSize: "15px"
    },
    postInfo: {
        color: "#737373",
    },
    cardBody: {
        fontSize: "15px",
        marginTop: "15px",
        marginBottom: "15px",
    },
    iconButton: {
        padding: "0",
        marginLeft: "25%",
        //frontSize: "15"
    },
    commentDivider: {
        marginBottom: "15px"
    }
});
function checkWebsite(url){
    const beforeCom = url.split(".com")[0];
    const lastIndex = beforeCom.split(/[./]+/).length-1;
    const web = beforeCom.split(/[./]+/)[lastIndex];
    return web
}


function get_reply(postId) {
    const url = '/postReply/' + postId; //http://localhost:3001
    const comment_request = new Request(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Token': localStorage.getItem("Token") // move whole function to ApiCalls.js later
        }
    });
    fetch(comment_request)
    .then(res => {
        if (res.status === 200) {
            return res.json();
        } else {
            console.log('could not get post comments');
        }
    })
    .then(commts => {
        // success get post object in data
   
        ReactDOM.render(<PostComment data={commts}/>, document.getElementById("comm_" + postId))
    })
    .catch((error) => {
        console.log(error)
    });
}
export class Post extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            errorText:"",
            firstName:"",
            lastName:"",
            replies: [],
            url: "google.com",
            inputMode: false,
        }
    }
    
    addComment = async (content, author, commentTime) => {
        const response = fetch('/reply/'+this.props.postInfo.postId+"/hashasdasd", {
            mode: 'cors',
            method: 'POST',
            body: JSON.stringify({
                "content":content,
                "email": author,
                "likes":0,
                "dislikes":0,
                "commentTime":commentTime
            }),
            headers: {
                "Content-Type": "application/json",
                "Token": localStorage.getItem("Token"),
              },
        });
    }


    componentDidMount(){
        this.refresh();
    }

    refresh = () => {
                const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Token": localStorage.getItem("Token"),
            },
        };
        fetch(REPLIES+this.props.postInfo.postId, requestOptions)
            .then(response => response.json())
            .then((data) => (this.setState({replies: data})))
            .catch(err => console.log(err))
    }

    handleSubmit = (event) => {
        event.preventDefault()
        const replyFiel = event.target.firstChild.firstChild
        const replyText = replyFiel.value
        if (replyText.length === 0) {
            /*handling if user uploading post with empty content, will occur error message*/
            this.setState({
                errorText: "Could not upload comment with empty content"
            })
        }
        else {
            const today = new Date();
            const date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
            this.addComment(replyText, this.props, date)
            this.setState({
                uploadInput: "",
                errorText: ""
            }, () => { this.refresh(); })
            replyFiel.value = ""
            replyFiel.placeholder = "comment send."
        }
     }

    render(){
        // console.log("this.props.param------------------")
        // console.log(this.props)
        const { classes } = this.props;
        const {userId} = this.props;
        const {postInfo} = this.props;
        const url = postInfo.content.match(/\bhttps?:\/\/\S+/gi)
        get_reply(this.props.postInfo.postId);
        return (
            <div className={classes.cardArea}>
                <Card className={classes.cardRoot} variant="outlined">
                    <Avatar className={classes.userIcon} src ={postInfo.AuthorProfile}/>
                    <CardContent className={classes.cardContent}>
                        <div className={classes.cardName}>
                            <Box style={{ fontWeight: "bold" }} display='inline'>
                                {postInfo.firstName + " " + postInfo.lastName + "   "}
                            </Box>
                            <Box className={classes.postInfo} display='inline'>
                                {userId +"-"+ postInfo.time}
                            </Box>
                            {!this.props.isSingle ?
                                <Link to={"/the-zone/" + postInfo.postId}>
                                    <LaunchIcon className={classes.launchIcon}></LaunchIcon>
                                </Link>:
                                null
                            }
                            
                        </div>
                        <div className={classes.cardBody}>
                        {url == null
                        ?<Typography variant ="body1" color="textSecondary" style={{ wordWrap: "break-word" }}>
                            {postInfo.content}
                        </Typography>
                        :<Typography variant ="body1" color="textSecondary">
                            <Typography style={{ wordWrap: "break-word" }}>
                                {postInfo.content.split(url)[0]}
                            <Typography>
                                {postInfo.content.split(url)[1]}
                            </Typography>
                        </Typography>
                            <Card className = {classes.card}>
                                <CardActionArea >
                                <CardContent className = {classes.embeds}>
                                    {
                                        {
                                            'facebook':<FacebookEmbeds url={url}/>,
                                            'twitter':<TwitterEmbeds url = {url}/>,
                                            'reddit':<RedditEmbeds url = {url}/>,
                                            'instagram':<InsEmbeds url={url}/>
                                        }[checkWebsite(url[0])]
                                    }
                                
                                </CardContent>
                                </CardActionArea>
                                </Card>
                        </Typography>
                        }
                        <Divider></Divider>
                        <CardActions className={classes.cardAction} disableSpacing>
                            <Rate type={"posts"} likes={postInfo.likes} dislikes={postInfo.dislikes} id={postInfo.postId} user={userId}></Rate>
                            <IconButton className={classes.iconButton} onClick={() => { this.setState({ inputMode: !this.state.inputMode }) }} >
                                {/**TODO: onlick to reply the post */}
                                <CommentIcon />
                            </IconButton>
                            <IconButton className={classes.iconButton}>
                                {/**TODO: onlick to reply the post */}
                                <ShareMenu
                                    data={[this.state.url, postInfo.content, "#SportCred"]} //url, content, and hashtag
                                />
                            </IconButton>
                        </CardActions>
                        <Divider className={classes.commentDivider}></Divider>
                        <div id={"comm_"+postInfo.postId}></div>
                        {this.state.inputMode ?
                            <Form id="fm" onSubmit={this.handleSubmit} reply style={{ marginTop: "15px" }}>
                                <Form.TextArea
                                    placeholder="Add reply to this post"
                                />
                                <Button content='Add Reply' type="submit" labelPosition='left' icon='edit' primary />
                            </Form> : null
                        }
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

}
// export default withStyles(userStyles)(Post);
Post.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Post);

