import React, { Component } from 'react'
import createHistory from 'history/createBrowserHistory'
import { Admin, Resource, Delete } from 'admin-on-rest'
import { UserList, UserEdit, UserCreate } from './resources/Users'

import StandardLoginPage from './components/StandardLoginPage'

import authClient from './clients/authClient'
import restClient from './clients/restClient'

const history = createHistory()

class App extends Component {
  render () {
    return (
      <Admin loginPage={StandardLoginPage} authClient={authClient} restClient={restClient} history={history}>
        <Resource name="user" list={UserList} edit={UserEdit} create={UserCreate} remove={Delete}/>
      </Admin>
    )
  }
}

export default App
