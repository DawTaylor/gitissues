# GitIssues

> This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app)

Working copy can be found at [this page](https://gitissues-9bd3d.firebaseapp.com)

## Instructions

### Before you begin

Install `create-react-app`.

```sh
npm install -g create-react-app
```

Clone this repository

```sh
git clone https://github.com/DawTaylor/gitissues.git
```

Install dependencies

```sh
npm install
```

Start dev server

```sh
npm start
```

Go to [localhost:3000](http://localhost:3000)

## About the app

This app was built on React and uses Firebase Auth to authenticate and with the Github API.

All the data fetching were made on Github's GraphQL API using [Apollo Client](https://www.apollographql.com/client), reducing the amount of the requests hence speeding up page load.

The data manipulation was done over Github's Rest API. This is common when working with GraphQL. Imho, GraphQL mutations aren't made to manipulate lots of data.

The UI was based on [Material UI](http://www.material-ui.com/#/).