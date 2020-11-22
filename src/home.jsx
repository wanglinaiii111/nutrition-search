import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Taro from '@tarojs/taro'
import { taroLogin } from './utils/sdk'
import { login } from './utils/api'
import { setUserIdAction } from './actions/user'

const Home = (props) => {
  const dispatch = useDispatch()
  useEffect(() => {
    const userId = Taro.getStorageSync('userId')
    if (userId) { return dispatch(setUserIdAction(userId)) }
    taroLogin().then(res => {
      login({ code: res.code }).then((r) => {
        Taro.setStorage({
          key: "userId",
          data: r.userId
        })
        dispatch(setUserIdAction(r.userId))
      })
    }).catch(e => {
      console.log('登录失败！' + e)
    })
  }, [dispatch])

  return (
    <>
      {props.children}
    </>
  )
}

export default Home
