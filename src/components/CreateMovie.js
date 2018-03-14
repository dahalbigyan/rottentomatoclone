import React from 'react';
import { withRouter } from 'react-router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import createHistory from 'history/createBrowserHistory';
const history = createHistory();

class CreateMovie extends React.Component {
constructor(props){
    super(props);
    this.state = {
        description: '',
        imageUrl: '',
        avgRating: 0,
        reviewer: localStorage.getItem('userId'), 
        loading: true
      };
      this.handleMovie = this.handleMovie.bind(this);
};

componentWillReceiveProps(nextProps){
  this.setState({reviewer:nextProps.data.allUsers[0]['id'], loading: false})
};

  render() {
    const {loading} = this.state;
    return (
      <div>
        <h3 className="text-center"> Add Rotten Movie Ratings!</h3>
        <hr/>
        <div className='w-100 pa4 flex justify-center'>
          <div style={{ maxWidth: 400 }} className=''>
            <label> Movie Title: </label>
            <input
              className='w-100 pa3 mv2'
              value={this.state.description}
              placeholder='Title of the movie'
              onChange={(e) => this.setState({description: e.target.value})}
            />
            <label> Movie Cover Image: </label>
            <input
              className='w-100 pa3 mv2'
              value={this.state.imageUrl}
              placeholder='Image Url'
              onChange={(e) => this.setState({imageUrl: e.target.value})}
            />
            <label> Movie Rating as decided by Popular votes: </label>
            <input
              className='w-100 pa3 mv2'
              value={this.state.avgRating}
              type="number"
              placeholder='Average Rating'
              onChange={(e) => this.setState({avgRating: parseInt(e.target.value)})}
            />
            {this.state.imageUrl &&
              <img src={this.state.imageUrl} role='presentation' className='w-100 mv3' />
            }
            {this.state.description && this.state.imageUrl &&
              <button className='btn btn-info btn-lg' onClick={this.handleMovie}>Add New Movie</button>
            }
          </div>
        </div>
      </div>
    )
  };
  
  handleMovie(){
    const {description, imageUrl, avgRating, reviewer} = this.state
    this.props.addMovie({ description, imageUrl, avgRating, reviewer})
      .then(() => {
        history.replace('/')
    })
  };
}

const addMutation = gql`
  mutation addMovie($description: String!, $imageUrl: String!, $avgRating: Int!, $reviewer: ID!) {
    createMovie(description: $description, imageUrl: $imageUrl, avgRating: $avgRating, reviewerId: $reviewer) {
      id
      description
      imageUrl
      avgRating
    }
  }
`

const createQuery = graphql(addMutation, {
  props: ({ ownProps, mutate }) => ({
    addMovie: ({ description, imageUrl, avgRating, reviewer}) =>
      mutate({
        variables: { description, imageUrl, avgRating, reviewer},
      })
  })
}); 

const userQueryy = gql` query($auth0UserId:String!){
  allUsers(filter:{auth0UserId:$auth0UserId}){
    id
  }
}
`; 

const userQuery = graphql(userQueryy, {options:{
  variables: {auth0UserId: localStorage.getItem('auth0userid')}
}});

const createMovieWithQuery = compose(createQuery, userQuery)(CreateMovie);

export default createMovieWithQuery;