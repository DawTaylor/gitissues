import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import gql from 'graphql-tag'
import axios from 'axios'
import RaisedButton from 'material-ui/RaisedButton'

import { client } from '../helpers/apollo'
import { Header } from './components/Header'
import { IssuesList } from './components/IssuesList'

export class RepoIssues extends Component {
  constructor(props) {
    super(props)
    this.toggleIssueLock = this.toggleIssueLock.bind(this)
  }

  state = {
    issues: [],
    count: 0
  }

  async fetchIssues(owner, name, pagination) {
    const query = gql`
    query {
      repository(owner: "${owner}" name: "${name}") {
        issues(${pagination} orderBy: { field: CREATED_AT direction: DESC }) {
          totalCount
          edges {
            cursor
            node {
              title
              number
              locked
              createdAt
              repository {
                name
                owner {
                  login
                }
              }
              comments(first: 1) {
                totalCount
              }
              author {
                avatarUrl
                login
              }
              labels(first: 10) {
                edges {
                  node {
                    name
                    color
                  }
                }
              }
            }
          }
        }
      }
    }
      `
    const { data } = await client.query({ query })
    return data
  }

  async fetchMoreIssues() {
    const { computedMatch: { params: { owner, repo } } } = this.props
    const { cursor } = this.state.issues[this.state.issues.length - 1]
    const { repository: { issues: { edges: issues } } }  = await this.fetchIssues(owner, repo, `first: 10 after: "${cursor}"`)
    const state = this.state
    this.setState({
      issues: [
        ...state.issues,
        ...issues
      ]
    })
  }

  async lockIssue(owner, repo, issue) {
    return new Promise(async (resolve, reject) => {
      const token = localStorage.getItem('accessToken')
      const { status } = await axios.put(`https://api.github.com/repos/${owner}/${repo}/issues/${issue}/lock`, '', {
        headers: {
          authorization: `token ${token}`,
        }
      })
      return status === 204 ? resolve(true) : reject(false)
    })
  }
  
  async unlockIssue(owner, repo, issue) {
    return new Promise(async (resolve, reject) => {
      const token = localStorage.getItem('accessToken')
      const { status } = await axios.delete(`https://api.github.com/repos/${owner}/${repo}/issues/${issue}/lock`, {
        headers: {
          authorization: `token ${token}`,
        }
      })
      return status === 204 ? resolve(false) : reject(false)
    })
  }

  async toggleIssueLock(index) {
    const issues = JSON.parse(JSON.stringify(this.state.issues))
    const issue = issues[index].node

    issue.locked = issue.locked === false ? 
      await this.lockIssue(issue.repository.owner.login, issue.repository.name, issue.number) :
      await this.unlockIssue(issue.repository.owner.login, issue.repository.name, issue.number)

    this.setState({
      issues
    })
  }

  async componentDidMount() {
    const { computedMatch: { params: { owner, repo } } } = this.props
    const { repository: { issues: { edges: issues, totalCount: count } } }  = await this.fetchIssues(owner, repo, "first: 10")
    this.setState({ issues, count })
  }

  render() {
    const styles = {
      header: {
        fontFamily: 'Roboto, sans-serif'
      }
    }
    
    return (
      <div>
        <Header {...this.props} />
        <h1 style={styles.header}>Issues</h1>
        <RaisedButton 
          label="New issue"
          primary={true}
          fullWidth={true}
          containerElement={<Link to={{ pathname: `/repo/${this.props.computedMatch.params.owner}/${this.props.computedMatch.params.repo}/issues/create`}} />}
        />
        <IssuesList issues={this.state.issues} toggleIssueLock={this.toggleIssueLock}  {...this.props} />
        {
          this.state.issues && this.state.count > this.state.issues.length ?
            <RaisedButton 
              label="Load more issues"
              primary={true}
              fullWidth={true}
              onClick={() => this.fetchMoreIssues()}
            /> :
            null
        }
      </div>
    )
  }
}
