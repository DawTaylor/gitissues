import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardTitle, CardText, CardActions } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import moment from 'moment'

import { GoToRepo } from './GoToRepo'

export class RepoList extends Component {
  renderRepo(repo, key) {
    const styles = {
      margin: '20px 0'
    }

    return (
      <Card style={styles} key={key} >
        <CardTitle
          title={`${repo.owner.login.toLowerCase()}/${repo.name}`}
          subtitle={repo.primaryLanguage !== null ? repo.primaryLanguage.name : ''}
        />
        <CardText>
          <p>
            {repo.description || 'No description'}
          </p>
          <small>Last updated {moment(repo.updatedAt).fromNow()}</small>
        </CardText>
        <CardActions>
          <RaisedButton
            primary={true} 
            label='Go to issues'
            containerElement={<Link to={{ pathname: `repo/${repo.owner.login.toLowerCase()}/${repo.name}/issues`}} />}
          />
        </CardActions>
      </Card>
    )
  }
  render() {
    const { repos } = this.props
    const styles = {
      header: {
        fontFamily: 'Roboto, sans-serif'
      }
    }

    return (
      <div>
        <GoToRepo {...this.props} />
        <h1 style={styles.header}>Your repositories</h1>
        {repos.map((repo, index) => this.renderRepo(repo.node, index))}
      </div>
    )
  }
}
