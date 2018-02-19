import React from 'react'
import ReactDOM from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { App } from './App'

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#333333',
    accent1Color: '#BDBDBD',
    secondaryTextColor: '#333333'
  }
})

const root = (
  <MuiThemeProvider muiTheme={muiTheme}>
    <App />
  </MuiThemeProvider>
)

ReactDOM.render(root, document.querySelector('#root'));
