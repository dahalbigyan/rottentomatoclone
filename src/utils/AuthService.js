import decode from 'jwt-decode';
import { browserHistory } from 'react-router';
import auth0 from 'auth0-js';
import createHistory from 'history/createBrowserHistory';
const ID_TOKEN_KEY = 'id_token';
const ACCESS_TOKEN_KEY = 'access_token'
const CLIENT_ID = '3QDqqfEAOC6icLE1SGrMHHWo130yms2I';
const CLIENT_DOMAIN = 'bigyan.auth0.com';
const REDIRECT = 'http://localhost:3000/callback';
const SCOPE = 'openid email profile';
const AUDIENCE = 'https://bigyan.auth0.com/userinfo';
const history = createHistory();

var auth = new auth0.WebAuth({
  clientID: CLIENT_ID,
  domain: CLIENT_DOMAIN
});

/*
    - auth0 calls Auth0's authorize endpoint
    - validates and authorizes our client app to perform authentication
*/
export function login() {
  auth.authorize({
    responseType: 'token id_token',
    redirectUri: REDIRECT,
    audience: AUDIENCE,
    scope: SCOPE
  });
};

// logout
export function logout() {
  clearIdToken();
  clearProfile();
  localStorage.removeItem('access_token');
  localStorage.removeItem('id_token');
  localStorage.removeItem('expires_at');
  // navigate to the home route
  history.replace('/');
};

export function requireAuth(nextState, replace) {
  if (!isLoggedIn()) {
    replace({pathname: '/'});
  }
};

export function getIdToken() {
  return localStorage.getItem(ID_TOKEN_KEY);
};

function clearIdToken() {
  localStorage.removeItem(ID_TOKEN_KEY);
};

function clearProfile() {
  localStorage.removeItem('profile');
  localStorage.removeItem('userId');
};

// Helper function that will allow us to extract the id_token
export function getAndStoreParameters() {
  auth.parseHash(window.location.hash, function(err, authResult){
    if (err) {
      return console.log(err);
    };
    setIdToken(authResult);
  });
};

export function getEmail() {
  return getProfile().email;
};

export function getName() {
  return getProfile().nickname;
};

export function getUserAuthId(){
  return getProfile().sub;
};

// Get and store id_token in local storage
function setIdToken(authResult) {
  let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
  localStorage.setItem(ID_TOKEN_KEY, authResult.idToken);
  let decoded = decode(authResult.idToken);
  localStorage.setItem('auth0userid', decoded.sub);
  localStorage.setItem('access_token', authResult.accessToken);
  localStorage.setItem('expires_at', expiresAt);

};

export function isLoggedIn() {
  const idToken = getIdToken();
  return !!idToken && !isTokenExpired(idToken);
};

export function getProfile() {
  const decoded = decode(getIdToken());
   return decoded;
};

function getTokenExpirationDate(encodedToken) {
  const token = decode(encodedToken);
  if (!token.exp) { return null; }
  const date = new Date(0);
  date.setUTCSeconds(token.exp);
  return date;
};

function isTokenExpired(token) {
  const expirationDate = getTokenExpirationDate(token);
  return expirationDate < new Date();
};
