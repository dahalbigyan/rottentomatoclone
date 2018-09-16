import React from 'react';
import DisplayMovie from './DisplayMovie';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Nav from './Nav';

class ListMovie extends React.Component {
  constructor(props){
    super(props);
  };

  render () {
    if (this.props.data.loading) {
      return (<div>Loading</div>)
    };
    return (
      <div>
        <Nav />
        <h3 className="text-center"> Latest Rotten Movie Ratings!</h3>
        <hr/>
        <div className="col-sm-12">
          {this.props.data.allMovies.map((movie, index) => (
            <div className="col-sm-4" key={index}>
              <DisplayMovie key={movie.id} movie={movie} refresh={() => this.props.data.refetch()} />
            </div>
          ))}
        </div>
      </div>
    )
  };
};

const FeedQuery = gql`query allMovies {
  allMovies(orderBy: createdAt_DESC) {
    id
    description
    imageUrl
    avgRating
  }
}`; 

const userPreQueryy = gql` query allUsers{
  allUsers(filter:{auth0UserId:"auth0|5a982a9ac3a11c288a2f5b15"}){
    id
  }
}
`; 

const movieQuery = graphql(FeedQuery); 

const userQuery = graphql(userPreQueryy);

const ListMovieWithData = compose(userQuery, movieQuery)(ListMovie);

export default ListMovieWithData;


