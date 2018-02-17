import React, { Component } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { fire, loginWithGithub, signOut } from './helpers/firebase'
import { ProtectedRoute, PublicRoute } from './helpers/GuardRoute'

import { Login } from './containers/Login'
import { Home } from './containers/Home'

class App extends Component {
  constructor(props) {
    super(props)

    this.signIn = this.signIn.bind(this)
  }
  state = {
    accessToken: null,
    githubUser: null
  }

  signIn() {
    console.log('logging in')
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
      <Router>
        <div className="App">
          <ProtectedRoute path='/' Component={Home} {...this.state} exact={true} />
          <PublicRoute path="/login" Component={Login} {...this.state} loginHandler={this.signIn} />
        </div>
      </Router>
    );
  }
}

export default App
