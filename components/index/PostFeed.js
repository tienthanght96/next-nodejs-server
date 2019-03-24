import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";

import NewPost from "./NewPost";
import Post from "./Post";
import {
  addPost,
  deletePost,
  likePost,
  unlikePost,
  getPostFeed,
  addComment,
  deleteComment
} from "../../lib/api";

class PostFeed extends React.Component {
  state = {
    posts: [],
    text: "",
    image: "",
    isAddingPost: false,
    isLoading: false,
    isDeletingPost: false
  };

  componentDidMount() {
    this.postData = new FormData();
    this.getPosts();
  }

  getPosts = async () => {
    const { auth } = this.props;
    try {
      const posts =  await getPostFeed(auth.user._id);
      this.setState({ posts })
    } catch (error) {
      
    }
  };

  handleChange = event => {
    let inputValue;

    if (event.target.name === "image") {
      inputValue = event.target.files[0];
    } else {
      inputValue = event.target.value;
    }
    this.postData.set(event.target.name, inputValue);
    this.setState({ [event.target.name]: inputValue });
  };

  handleAddPost = async () => {
    const { auth } = this.props;

    this.setState({ isAddingPost: true });
    try {
      const postData = await addPost(auth.user._id, this.postData);
      const updatedPosts = [ postData, ...this.state.posts ];
      this.setState({
        posts: updatedPosts,
        isAddingPost: false,
        text: "",
        image: ""
      });
      this.postData.delete("image");
    } catch (error) {
      console.error(err);
        this.setState({ isAddingPost: false });
    }
  };

  handleDeletePost = async deletedPost => {
    this.setState({ isDeletingPost: true });
    try {
      const postData =  await deletePost(deletedPost._id);
      const postIndex = this.state.posts.findIndex(post => post._id === postData._id);
      const updatedPosts = [
        ...this.state.posts.slice(0, postIndex),
        ...this.state.posts.slice(postIndex + 1)
      ];
      this.setState({
        posts: updatedPosts,
        isDeletingPost: false
      });
    } catch (error) {
      console.error(err);
      this.setState({ isDeletingPost: false });
    }
  };

  handleToggleLike = async post => {
    const { auth } = this.props;

    const isPostLiked = post.likes.includes(auth.user._id);
    const sendRequest = isPostLiked ? unlikePost : likePost;
    try {
      const postData = await sendRequest(post._id);
      const postIndex = this.state.posts.findIndex(post => post._id === postData._id);
      const updatedPosts = [
        ...this.state.posts.slice(0, postIndex),
        postData,
        ...this.state.posts.slice(postIndex + 1)
      ];
      this.setState({ posts: updatedPosts });
    } catch (error) {
      
    }
  };

  handleAddComment = async (postId, text) => {
    const comment = { text };
    try {
      const postData = await addComment(postId, comment);
      const postIndex = this.state.posts.findIndex(post => post._id === postData._id);
      const updatedPosts = [
        ...this.state.posts.slice(0, postIndex),
        postData,
        ...this.state.posts.slice(postIndex + 1)
      ];
      this.setState({ posts: updatedPosts });
    } catch (error) {
      
    }
  };

  handleDeleteComment = async (postId, comment) => {
    try {
      const postData = await deleteComment(postId, comment);
      const postIndex = this.state.posts.findIndex(post => post._id === postData._id);
      const updatedPosts = [
        ...this.state.posts.slice(0, postIndex),
        postData,
        ...this.state.posts.slice(postIndex + 1)
      ];
      this.setState({ posts: updatedPosts });
    } catch (error) {
      
    }
  };

  render() {
    const { classes, auth } = this.props;
    const { posts, text, image, isAddingPost, isDeletingPost } = this.state;

    return (
      <div className={classes.root}>
        <Typography
          variant="h4"
          component="h1"
          align="center"
          color="primary"
          className={classes.title}
        >
          Post Feed
        </Typography>
        <NewPost
          auth={auth}
          text={text}
          image={image}
          isAddingPost={isAddingPost}
          handleChange={this.handleChange}
          handleAddPost={this.handleAddPost}
        />
        {posts.map(post => (
          <Post
            key={post._id}
            auth={auth}
            post={post}
            isDeletingPost={isDeletingPost}
            handleDeletePost={this.handleDeletePost}
            handleToggleLike={this.handleToggleLike}
            handleAddComment={this.handleAddComment}
            handleDeleteComment={this.handleDeleteComment}
          />
        ))}
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    paddingBottom: theme.spacing.unit * 2
  },
  title: {
    padding: theme.spacing.unit * 2
  }
});

export default withStyles(styles)(PostFeed);
