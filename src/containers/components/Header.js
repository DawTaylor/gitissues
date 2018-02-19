import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'

export class Header extends Component {
  render() {
    return (
      <AppBar 
        title='GitIssues'
        iconElementLeft={<IconButton onClick={() => this.props.history.push('/')} iconClassName='fa fa-home' />}
        iconElementRight={<IconButton onClick={this.props.logoutHandler} iconClassName='fa fa-sign-out' />}
      />
    )
  }
}

Header.propTypes = {
  logoutHandler: PropTypes.func.isRequired
}
