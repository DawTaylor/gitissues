import React, { Component } from 'react'
import gql from 'graphql-tag'
import RaisedButton from 'material-ui/RaisedButton'

import { client } from '../helpers/apollo'
import { Header } from './components/Header'
import { RepoList } from './components/RepoList'


export class Home extends Component {
  state = {
    repos: [],
    count: 0,
  }

  async fetchRepositories(pagination) {
    const query = gql`
      query {
        viewer {
          repositories(${pagination} isFork: false) {
            totalCount
            edges {
              cursor
              node {
                name
                description
                updatedAt
                primaryLanguage {
                  name
                }
                owner {
                  login
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

  async fetchMoreRepos() {
    const { cursor } = this.state.repos[this.state.repos.length - 1]
    const { viewer: { repositories: { edges: repos } } } = await this.fetchRepositories(`first: 10 after: "${cursor}"`)
    const state = this.state
    this.setState({
      repos: [
        ...state.repos,
        ...repos
      ]
    })
  }

  async componentDidMount() {
    const { viewer: { repositories: { edges: repos, totalCount: count } } } = await this.fetchRepositories('first: 10')
    this.setState({ count, repos })
  }

  render() {
    return (
      <div>
        <Header {...this.props} />
        {this.state.repos ? <RepoList repos={this.state.repos} {...this.props} /> : null}
        <div>
          {
            this.state.repos && this.state.count > this.state.repos.length ? 
              <RaisedButton 
                label="Load more repos" 
                primary={true}
                fullWidth={true}
                onClick={() => this.fetchMoreRepos()} /> : 
              null}
        </div>
      </div>
    )
  }
}