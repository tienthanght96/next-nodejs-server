import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import AccountBox from "@material-ui/icons/AccountBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import withStyles from "@material-ui/core/styles/withStyles";
import Link from 'next/link';

import { getUserFeed, followUser } from "../../lib/api";

class UserFeed extends React.Component {
  state = {
    users: [],
    openSuccess: false,
    followingMessage: '',
    isLoading: true
  };

  async componentDidMount() {
    const { auth } = this.props;
    try {
      const users = await getUserFeed(auth.user._id);
      this.setState({ users, isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false });
    }
  }

  handleFollow = async (user, userIndex) => {
    try {
      const userFollow = await followUser(user._id);
      const updatedUsers = [
        ...this.state.users.slice(0, userIndex),
        ...this.state.users.slice(userIndex + 1)
      ];
      this.setState({
        users: updatedUsers,
        openSuccess: true,
        followingMessage: `Following ${userFollow.name}`
      });
    } catch (error) {
      console.log('error', error)
    }
  }

  handleClose = () => this.setState({ openSuccess: false });

  render() {
    const { classes } = this.props;
    const { users, openSuccess, followingMessage, isLoading } = this.state;
    return (
      <div>
        <Typography title="title" variant="h6" component="h2" align="center">
          Browse Users
        </Typography>
        <Divider />
        { (isLoading)  
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
              <List>
                { users.map((user, index) => (
                    <span key={user._id}>
                      <ListItem>
                        <ListItemAvatar className={classes.avatar}>
                          <Avatar src={user.avatar}/>
                        </ListItemAvatar>
                        <ListItemText primary={user.name}/>
                        <ListItemSecondaryAction className={classes.follow}>
                          <Link href={`/profile/${user._id}`}>
                            <IconButton
                              variant="contained"
                              color="secondary"
                              className={classes.viewButton}
                            >
                              <AccountBox/>
                            </IconButton>
                          </Link>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => this.handleFollow(user, index)}
                          >
                            Follow
                          </Button>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </span>
                  ))
                }
              </List>
            )
        }
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}
          open={openSuccess}
          onClose={this.handleClose}
          autoHideDuration={6000}
          message={<span className={classes.snack}>{followingMessage}</span>}
        />
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    padding: theme.spacing.unit
  },
  avatar: {
    marginRight: theme.spacing.unit
  },
  follow: {
    right: theme.spacing.unit * 2
  },
  snack: {
    color: theme.palette.primary.light
  },
  viewButton: {
    verticalAlign: "middle"
  },
  progressContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50, 
    flexDirection: "column"
  },
});

export default withStyles(styles)(UserFeed);
