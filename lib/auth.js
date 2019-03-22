import Router from "next/router";
import Axios from "axios";

const WINDOW_USER_SCRIPT_VARIABLE = "__USER__";

export const getUserScript = user => {
  return `${WINDOW_USER_SCRIPT_VARIABLE} = ${JSON.stringify(user)};`;
};

export const getSessionFromServer = req => {
  if (req.user) {
    return { user: req.user };
  }
  return {};
};

export const getSessionFromClient = () => {
  if (typeof window !== "undefined") {
    const user = window[WINDOW_USER_SCRIPT_VARIABLE] || {};
    return { user };
  }
  return { user: {} };
};

const redirectUser = (res, path) => {
  if (res) {
    res.redirect(302, path);
    res.finished = true;
    return {};
  }
  Router.replace(path);
  return {};
};

export const authInitialProps = isProtectedRoute => ({ req,res,query: { userId } }) => {
  const auth = req ? getSessionFromServer(req) : getSessionFromClient();
  const currentPath = req ? req.url : window.location.pathname;
  const user = auth.user;
  const isAnonymous = !user;
  if (isProtectedRoute && isAnonymous && currentPath !== "/signin") {
    return redirectUser(res, "/signin");
  }
  return { auth, userId };
};


export const signupUser =  async user => {
  try {
    const { data } = await Axios.post('/api/auth/signup', user);
    console.log(data)
    return data;
  } catch (error) {
    throw error.response && error.response.data ? error.response.data : error.message;
  }
};

export const signinUser = async user => {
  try {
    const { data } = await Axios.post("/api/auth/signin", user);
    if (typeof window !== "undefined") {
      window[WINDOW_USER_SCRIPT_VARIABLE] = data || {};
    }
  } catch (error) {
    throw error.response && error.response.data ? error.response.data : error.message;
  }
};

export const signoutUser = async () => {
  if (typeof window !== "undefined") {
    window[WINDOW_USER_SCRIPT_VARIABLE] = {};
  }
  await Axios.get("/api/auth/signout");
  Router.push("/signin");
};