import React, { Component } from 'react'
import axios from 'axios'
import gql from 'graphql-tag'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import { toast } from 'react-toastify'
import { Redirect, Link } from 'react-router-dom'

import { client } from '../helpers/apollo'
import { Header } from './components/Header'

export class IssueForm extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.editIssue = this.editIssue.bind(this)
    this.createIssue = this.createIssue.bind(this)

    this.state = {
      issue: {}
    }
  }

  async fetchIssue(owner, repo, issue) {
    const query = gql`
      query {
        repository(owner: "${owner}" name: "${repo}") {
          issue(number: ${issue}) {
            title
            body
            number
            repository {
              name
              owner {
                login
              }
            }
          }
        }
      }
    `

    const { data } = await client.query({ query })
    return data
  }

  async componentDidMount() {
    const { computedMatch: { params: { owner, repo, issue } } } = this.props
    if (issue) { 
      const { repository: { issue: issueDetails } } = await this.fetchIssue(owner, repo, issue)
      this.setState({ issue: issueDetails })
    } else {
      this.setState({ newIssue: true, owner, repo })
    }
  }

  handleChange(event) {
    const issue = {...this.state.issue}
    issue[event.target.id] = event.target.value
    this.setState({ issue })
  }

  async editIssue() {
    const { issue } = this.state
    if (issue.title === '') return false
    const token = localStorage.getItem('accessToken')
    try {
      const { status } = await axios.patch(`https://api.github.com/repos/${issue.repository.owner.login}/${issue.repository.name}/issues/${issue.number}`, {
        title: issue.title,
        body: issue.body
      }, {
        headers: {
          authorization: `token ${token}`
        }
      })
  
      if(status === 200) {
        toast('Issue saved', {
          position: toast.POSITION.BOTTOM_CENTER,
          type: toast.TYPE.SUCCESS
        })
      }
    } catch (err) {
      toast('Unauthorized', {
        position: toast.POSITION.BOTTOM_CENTER,
        type: toast.TYPE.ERROR
      })
    }
  }

  async createIssue() {
    const { issue } = this.state
    if (!issue.title || issue.title === '') return toast('Title field is required', {
      position: toast.POSITION.BOTTOM_CENTER,
      type: toast.TYPE.ERROR
    })
    const token = localStorage.getItem('accessToken')
    try {
      const { status, data } = await axios.post(`https://api.github.com/repos/${this.state.owner}/${this.state.repo}/issues`, issue, {
        headers: {
          authorization: `token ${token}`
        }
      })

      console.log(data)

      this.setState({ newIssueId: data.number })

      if ( status === 201 ) {
        toast('Issue created', {
          position: toast.POSITION.BOTTOM_CENTER,
          type: toast.TYPE.SUCCESS,
          onClose: () => this.setState({ redirect: true })
        })
      }
    } catch (err) {

    }
  }
  
  render() {
    const styles = {
      button: {
        margin: '5px 0'
      },
      header: {
        fontFamily: 'Roboto, sans-serif'
      }
    }
    const { computedMatch: { params: { owner, repo, issue } } } = this.props
    return (
      <div>
        <Header {...this.props} />
        <h1 style={styles.header}>
          {
            this.state.newIssue ?
              'Creating new issue' : 
              `Editing issue #${this.state.issue.number || ''}`
          }
        </h1>
        <form>
          <TextField
            hintText='Issue title'
            floatingLabelText='Title'
            fullWidth={true}
            id='title'
            value={this.state.issue.title}
            onChange={this.handleChange}
          />
          <TextField 
            hintText='Issue content'
            floatingLabelText='Issue content'
            multiLine={true}
            fullWidth={true}
            id='body'
            value={this.state.issue.body}
            onChange={this.handleChange}
          />
          <RaisedButton 
            label='Save'
            style={styles.button}
            primary={true}
            fullWidth={true}
            onClick={
              this.state.newIssue ? 
                this.createIssue:
                this.editIssue
            }
          />
          <RaisedButton 
            label='Cancel'
            secondary={true}
            fullWidth={true}
            containerElement={<Link to={{ pathname: `/repo/${owner}/${repo}/issues/${issue || ''}`}} />}
          />
        </form>
        {this.state.redirect ? <Redirect to={{ pathname: `/repo/${this.state.owner}/${this.state.repo}/issues/${this.state.newIssueId}`}} /> : null }
      </div>
    )
  }
}