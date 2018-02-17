import React from 'react'
import ReactDOM from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import App from './App'

const root = (
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>
)

ReactDOM.render(root, document.querySelector('#root'));
