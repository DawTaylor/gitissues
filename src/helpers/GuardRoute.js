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
        render={() => {
          if (this.props.accessToken && this.props.githubUser) return (<Component {...this.props} />)
          return (<Redirect to={{ pathname: '/login' }} />)
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
    return (
      <Route
        render={() => {
          if (!this.props.accessToken || !this.props.githubUser) return (<Component {...this.props} />)
          return (<Redirect to={{ pathname: "/" }} />)
        }}
      />
    )
  }
}
