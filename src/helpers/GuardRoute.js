import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'

export class ProtectedRoute extends Component {
  shouldComponentUpdate(nextProps) {
    if (
      nextProps.githubUser !== null &&
      nextProps.accessToken !== null
    ) return true
    return false
  }

  render() {
    const { Component } = this.props
    return (
      <Route 
        render={(props) => {
          if (this.props.accessToken && this.props.githubUser) return (<Component {...this.props} {...props} />)
          return (<Redirect to={{ pathname: '/login', state: { from: this.props.location.pathname } }} />)
        }}
      />
    )
  }
} 

export class PublicRoute extends Component {
  shouldComponentUpdate(nextProps) {
    if (
      nextProps.accessToken !== null && 
      nextProps.githubUser !== null
    ) return true
    return false
  }

  render() {
    const { Component } = this.props
    const from = this.props.location.state.from || '/'
    return (
      <Route
        render={() => {
          if (!this.props.accessToken || !this.props.githubUser) return (<Component {...this.props} />)
          return (<Redirect to={{ pathname: from }} />)
        }}
      />
    )
  }
}
