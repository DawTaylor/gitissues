import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

export class GoToRepo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      url: ''
    }

    this.goTo = this.goTo.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  goTo() {
    const pieces = this.state.url.replace('https://', '').split('/')
    const [ _, owner, repo ] = pieces

    this.props.history.push(`/repo/${owner}/${repo}/issues`)
  }

  handleChange(event) {
    const state = {...this.state}
    state.url = event.target.value
    this.setState({ ...state })
  }

  render() {
    const styles = {
      header: {
        fontFamily: 'Roboto, sans-serif'
      }
    }

    return (
      <div>
        <h1 style={styles.header}>Go to repository</h1>
        <TextField 
          fullWidth={true}
          hintText='https://github.com/owner/repo'
          floatingLabelText='Github repository URL'
          value={this.state.url}
          onChange={this.handleChange}
        />
        <RaisedButton 
          label='Go to issues'
          primary={true}
          onClick={this.goTo}
        />
      </div>
    )
  }
}