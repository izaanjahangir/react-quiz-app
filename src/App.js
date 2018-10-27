import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Container } from 'reactstrap';
import Header from './Components/Header/Header';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import Home from './Components/Home/Home';
import * as firebase from 'firebase';

export default class Example extends React.Component {
  
  render() {
    if(firebase.auth().currentUser){
      console.log(firebase.auth().currentUser.uid);
    }
    return (
      <BrowserRouter>
        <div id="app">
          <Header />
          <div id="app-body">
            <Container>
                <Route exact path="/" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
            </Container>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}
