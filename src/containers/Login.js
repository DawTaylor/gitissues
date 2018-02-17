import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AppBar from 'material-ui/AppBar'
import RaisedButton from 'material-ui/RaisedButton'
import FontIcon from 'material-ui/FontIcon'


export class Login extends Component {
  render() {
    const styles = {
      container: {
        display: 'flex',
        height: '400px',
        alignItems: 'center',
        justifyContent: 'center'
      },
      button: {
        background: '#333333',
        height: '60px',
        paddingRight: '10px',
        paddingLeft: '10px'
      },
      label: {
        color: '#ffffff',
        fontSize: '1em'
      },
      icon: {
        verticalAlign: 'sub',
        fontSize: '22pt'
      }
    }

    return (
      <div>
        <AppBar 
          title="GitIssues"
          titleStyle={{textAlign: 'center'}}
          showMenuIconButton={false}
        />
        <div style={styles.container}>
          <RaisedButton
            buttonStyle={styles.button}
            labelStyle={styles.label}
            label='Login with Github'
            icon={<FontIcon style={styles.icon} className="fa fa-github" />}
            onClick={this.props.loginHandler}
          />
        </div>
      </div>
    )
  }
}

Login.propTypes = {
  loginHandler: PropTypes.func.isRequired
}