import React, { Component } from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { Card, CardTitle, CardActions, CardText} from 'material-ui/Card'
import Chip from 'material-ui/Chip'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'

export class IssuesList extends Component {
  renderLabels(label, key) {
    const styles = {
      margin: '4px',
      background: `#${label.color}`
    }
    return (
      <Chip style={styles} key={key}>
        {label.name}
      </Chip>
    )
  }

  renderIssue(issue, key) {
    const styles = {
      issue: {
        margin: '20px 0'
      },
      chipWrapper: {
        display: 'flex',
        flexWrap: 'wrap'
      }
    }
    
    const { computedMatch: { params: { owner, repo } } } = this.props

    return (
      <Card style={styles.issue} key={key}>
        <CardTitle
          title={issue.title} 
          subtitle={`by ${issue.author.login} ${moment(issue.createdAt).fromNow()}`}
        />
        <CardText style={styles.chipWrapper}>
          {issue.labels.edges.map((label, index) => this.renderLabels(label.node, index))}
        </CardText>
        <CardActions>
          <FlatButton
            icon={<FontIcon className="fa fa-info-circle" />}
            containerElement={<Link to={{ pathname: `/repo/${owner}/${repo}/issues/${issue.number}` }} />}
          />
          <FlatButton 
            icon={<FontIcon className="fa fa-edit" />}
            containerElement={<Link to={{ pathname: `/repo/${owner}/${repo}/issues/${issue.number}/edit` }} />}
          />
          {
            issue.locked ?
            <FlatButton
              title="Lock Issue"
              icon={<FontIcon className={'fa fa-unlock'} />}
              containerElement={<a>&nbsp;</a>}
              onClick={() => this.props.toggleIssueLock(key)}
            /> :
            <FlatButton
              title="Unlock Issue"
              icon={<FontIcon className={'fa fa-lock'} />}
              containerElement={<a>&nbsp;</a>}
              onClick={() => this.props.toggleIssueLock(key)}
            /> 
              
          }
        </CardActions>
      </Card>
    )
  }

  render() {
    const { issues } = this.props
    return (
      <div>
        {issues.map((issue, index) => this.renderIssue(issue.node, index))}
      </div>
    )
  }
}
