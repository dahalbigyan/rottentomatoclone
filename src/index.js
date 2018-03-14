import React from 'react';
import ReactDOM from 'react-dom';
import ListMovie from './components/ListMovie';
import Callback from './Callback/Callback';
import CreateMovie from './components/CreateMovie'
import { Route, BrowserRouter } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import 'tachyons';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { requireAuth } from './utils/AuthService';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';

const API_ENDPOINT = "https://api.graph.cool/simple/v1/cje4lfqbv55gk01570mjrcd44";

const httpLink = createHttpLink({
    uri: API_ENDPOINT,
  });

  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('id_token');
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });

ReactDOM.render((
  <ApolloProvider client={client}>
    <BrowserRouter>
    <div>
      <Route path='/' component={ListMovie} />
      <Route path='/create' component={CreateMovie} onEnter={requireAuth}/>
      <Route path='/callback' component={Callback} />
    </div>
    </BrowserRouter>
  </ApolloProvider>
  ), document.getElementById('root'));
registerServiceWorker();
