import { Component } from 'react';
import { withRouter } from 'react-router';
import { getAndStoreParameters, getIdToken, getEmail, getName, getUserAuthId } from '../utils/AuthService';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import createHistory from 'history/createBrowserHistory';
const history = createHistory();

class Callback extends Component{
    constructor(props){
        super(props);
    this.createUser = this.createUser.bind(this);
    }
  componentWillMount() {
    getAndStoreParameters();
  };

  render() {
    return null;
  };

  queryUser(){
    const variables = {
      auth0UserId: getUserAuthId()
    };
    this.props.queryAUser({variables})
        .then((response)=>{
          localStorage.setItem('userId', response.data.createUser.id);
          history.replace('/');
        });
  };

  createUser(){
    const variables = {
      idToken: getIdToken(),
      email: getEmail(),
      name: getName()
    };
    this.props.createUser({ variables })
      .then((response) => {
          localStorage.setItem('userId', response.data.createUser.id);
          history.replace('/')
      }).catch((e) => {
        console.error("Error of life ", e)
       history.replace('/')
      })
  }
};

const createUser = gql`
  mutation ($idToken: String!, $name: String!, $email: String!){
    createUser(authProvider: {auth0: {idToken: $idToken}}, name: $name, email: $email) {
      id
    }
  }
`

const createUserQuery = graphql(createUser, {name: 'createUser'})

const CallbackWithData = compose(createUserQuery)(Callback);

export default CallbackWithData;
