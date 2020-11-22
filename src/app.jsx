import React from 'react'
import { Provider } from 'react-redux'
import configStore from './store'
import './iconfont/iconfont.scss'
import './app.scss'
import Home from './home'

const store = configStore()

function App(props) {
  return (
    <Provider store={store}>
      <Home>
        {props.children}
      </Home>
    </Provider>
  )
}

export default App
