import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import Edit from "@material-ui/icons/Edit";
import withStyles from "@material-ui/core/styles/withStyles";
import Link from "next/link";

import { authInitialProps } from "../lib/auth";
import { getUser } from "../lib/api";
import FollowUser from "../components/profile/FollowUser";
import DeleteUser from "../components/profile/DeleteUser";
import ProfileTabs from "../components/profile/ProfileTabs";

class Profile extends React.Component {
  isAuth = false;
  state = {
    user: null,
    posts: [],
    isAuth: false,
    isFollowing: false,
    isLoading: true,
    isDeletingPost: false
  };

  async componentDidMount() {
    const { userId, auth } = this.props;
    const isAuth = auth.user._id === userId;
    try {
      const user = await getUser(userId);
      this.setState({ user, isLoading: false, isAuth });
    } catch (error) {
      console.log(error.response.message);
    }
  }

  checkFollow = (auth, user) => {
    return (
      user.followers.findIndex(follower => follower._id === auth.user._id) > -1
    );
  };

  toggleFollow = sendRequest => {
    
  };

  handleDeletePost = () => {}

  handleToggleLike = () => {}
  
  handleAddComment = () => {}

  handleDeleteComment = () => {}

  render() {
    const { classes, auth } = this.props;
    const {
      isLoading, posts, user,
      isAuth, isFollowing, isDeletingPost
    } = this.state;
    return (
      <Paper className={classes.root} elevation={4}>
        <Typography
          variant="h4"
          component="h1"
          align="center"
          className={classes.title}
          gutterBottom
        >
        {isLoading
          ? (
              <div className={classes.progressContainer}>
                <CircularProgress
                  className={classes.progress}
                  size={55}
                  thickness={5}
                />
              </div>
            )
          : (
              <List dense>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src={user.avatar} className={classes.bigAvatar} />
                  </ListItemAvatar>
                  <ListItemText primary={user.name} secondary={user.email} />

                  {/* Auth - Edit Buttons / UnAuth - Follow Buttons */}
                  {isAuth ? (
                    <ListItemSecondaryAction>
                      <Link href="/edit-profile">
                        <a>
                          <IconButton color="primary">
                            <Edit />
                          </IconButton>
                        </a>
                      </Link>
                      <DeleteUser user={user} />
                    </ListItemSecondaryAction>
                  ) : (
                    <FollowUser
                      isFollowing={isFollowing}
                      toggleFollow={this.toggleFollow}
                    />
                  )}
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary={user.about}
                    secondary={`Joined: ${user.createdAt}`}
                  />
                </ListItem>

                {/* Display User's Posts, Following, and Followers */}
                <ProfileTabs
                  auth={auth}
                  posts={posts}
                  user={user}
                  isDeletingPost={isDeletingPost}
                  handleDeletePost={this.handleDeletePost}
                  handleToggleLike={this.handleToggleLike}
                  handleAddComment={this.handleAddComment}
                  handleDeleteComment={this.handleDeleteComment}
                />
              </List>
            )
        }
        </Typography>
      </Paper>
    );
  }
}

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 5,
    margin: "auto",
    [theme.breakpoints.up("sm")]: {
      width: 600
    }
  },
  title: {
    color: theme.palette.primary.main
  },
  progress: {
    margin: theme.spacing.unit * 2
  },
  progressContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 10
  }
});

Profile.getInitialProps = authInitialProps(true);

export default withStyles(styles)(Profile);
