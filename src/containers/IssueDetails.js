import React, { Component } from 'react'
import gql from 'graphql-tag'
import moment from 'moment'
import { Card, CardTitle, CardText } from 'material-ui/Card'

import { client } from '../helpers/apollo'
import { Header } from './components/Header'

export class IssueDetails extends Component {
  state = {
  }
  async fetchIssue(owner, repo, issue, pagination) {
    const query = gql`
      query {
        repository(owner: "${owner}" name: "${repo}"){
          issue(number: ${issue}) {
            title
            createdAt
            bodyHTML
            author {
              login
            }
            comments(${pagination}) {
              totalCount
              edges {
                node {
                  bodyHTML
                  createdAt
                  author {
                    login
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

  async componentDidMount() {
    const { computedMatch: { params: { owner, repo, issue } } } = this.props
    const { repository: { issue: issueDetails } } = await this.fetchIssue(owner, repo, issue, `first: 10`)
    this.setState({ issue: issueDetails })
  }

  renderComment(comment, key) {
    const styles = {
      card: {
        margin: '20px 0'
      }
    }
    return (
      <Card key={key} style={styles.card}>
        <CardText dangerouslySetInnerHTML={{__html: comment.bodyHTML}} />
        <CardText>by {comment.author.login} {moment(comment.createdAt).fromNow()}</CardText>
      </Card>
    )
  }

  render() {
    const styles = {
      card: {
        margin: '20px 0'
      },
      header: {
        fontFamily: 'Roboto, sans-serif'
      }
    }
    return (
      <div>
        <Header {...this.props} />
        <h1 style={styles.header}>Issue</h1>
        {
          this.state.issue ? 
            <Card style={styles.card}>
              <CardTitle
                title={this.state.issue.title}
                subtitle={`by ${this.state.issue.author.login} ${moment(this.state.issue.createdAt).fromNow()} `}
              />
              <CardText dangerouslySetInnerHTML={{__html: this.state.issue.bodyHTML}} />
            </Card>:
            null
        }
        {
          this.state.issue && this.state.issue.comments.edges.length > 0 ? 
            this.state.issue.comments.edges.map((comment, index) => this.renderComment(comment.node, index)) :
            null
        }
      </div>
    )
  }
}