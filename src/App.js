import React, { Component } from 'react';
import { fire, loginWithGithub, signOut } from './firebase'
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    accessToken: null,
    githubUser: null
  }

  signIn() {
    loginWithGithub(fire)
      .then(res => {
        console.log(res)
        const state = {
          accessToken: res.credential.accessToken,
          githubUser: res.additionalUserInfo.username,
        }
        fire.database().ref(`users/${res.user.uid}`).set(state)
        this.setState(state)
      })
      .catch(err => console.error({err}))
  }

  signOut() {
    signOut(fire)
      .then(data => {
        this.setState({
          accessToken: null,
          githubUser: null
        })
      })
      .catch(err => console.error({err}))
  }

  componentWillMount() {
    fire.auth().onAuthStateChanged(auth => {
      if(auth) {
        fire.database().ref(`users/${auth.uid}`).once('value')
          .then(snapshhot => {
            this.setState({
              ...snapshhot.val()
            })
          })
      }
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <a onClick={() => this.signIn()} > Login com Github</a>
        <a onClick={() => this.signOut()} > Signout com Github</a>
      </div>
    );
  }
}

export default App;
