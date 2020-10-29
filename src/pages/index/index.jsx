import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View } from '@tarojs/components'


import styles from './index.scss'

const _ = require("underscore");

const Index = (props) => {
  const dispatch = useDispatch();
  const page = useSelector((state) => state.tab.page);

  return (
    <View className={styles.index}>
      11
    </View>
  )
}


export default React.memo(Index);

