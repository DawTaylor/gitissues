import React, { Component } from 'react'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import { fire, loginWithGithub, signOut } from './helpers/firebase'
import { ProtectedRoute, PublicRoute } from './helpers/GuardRoute'

import { Login } from './containers/Login'
import { Home } from './containers/Home'
import { RepoIssues } from './containers/RepoIssues'
import { IssueDetails } from './containers/IssueDetails'
import { IssueForm } from './containers/IssueForm'

export class App extends Component {
  constructor(props) {
    super(props)

    this.signIn = this.signIn.bind(this)
    this.signOut = this.signOut.bind(this)
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
        localStorage.setItem('accessToken', state.accessToken)
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
          <Switch>
            <ProtectedRoute path='/' Component={Home} {...this.state} logoutHandler={this.signOut} exact={true} />
            <ProtectedRoute path='/repo/:owner/:repo/issues' Component={RepoIssues} {...this.state} logoutHandler={this.signOut} exact={true} />
            <ProtectedRoute path='/repo/:owner/:repo/issues/create' Component={IssueForm} {...this.state} logoutHandler={this.signOut} exact={true} />
            <ProtectedRoute path='/repo/:owner/:repo/issues/:issue' Component={IssueDetails} {...this.state} logoutHandler={this.signOut} exact={true} />
            <ProtectedRoute path='/repo/:owner/:repo/issues/:issue/edit' Component={IssueForm} {...this.state} logoutHandler={this.signOut} exact={true} />
            <PublicRoute path="/login" Component={Login} {...this.state} loginHandler={this.signIn} />
          </Switch>
          <ToastContainer />
        </div>
      </Router>
    );
  }
}
