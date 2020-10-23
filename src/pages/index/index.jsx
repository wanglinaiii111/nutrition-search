import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View } from '@tarojs/components'

import Tab from '../tab/tab'
import Recommend from '../recommend/index'
import PresonalCenter from '../personal-center/index'
import Food from '../food/index'

import styles from './index.scss'

const _ = require("underscore");

const Index = (props) => {
  const dispatch = useDispatch();
  const page = useSelector((state) => state.tab.page);

  return (
    <View className={styles.index}>
      {
        _.find([page === 'recommend' && <Recommend></Recommend>, page === 'food' && <Food></Food>, page === 'personal-center' && <PresonalCenter></PresonalCenter>], Boolean)
      }
      <Tab></Tab>
    </View>
  )
}


export default React.memo(Index);

