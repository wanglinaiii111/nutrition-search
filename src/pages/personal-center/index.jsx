import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtList, AtListItem } from "taro-ui"
import compare from '../../image/center/compare.png'
import history from '../../image/center/history.png'

import styles from './index.module.scss'

const Center = (props) => {

  const clickToDetail = (type) => {
    return () => {
      if (type === 'compare') {
        Taro.navigateTo({
          url: '../../packageA/pages/compare/index'
        })
        return;
      }
      if (type === 'history') {
        Taro.navigateTo({
          url: '../../packageA/pages/history/index'
        })
        return;
      }
    }
  }

  return (
    <View className={styles.index}>
      <View className={styles.topBg}>
        <view className={styles.userAvatar}>
          <open-data type='userAvatarUrl'></open-data>
        </view>
        <view className={styles.userName}>
          <open-data type='userNickName'></open-data>
        </view>
      </View>
      <AtList hasBorder={false} className={`${styles.container} personCenter-container`}>
        <AtListItem title='对比工具' arrow='right' thumb={compare} onClick={clickToDetail('compare')} />
        <AtListItem title='历史对比' arrow='right' thumb={history} onClick={clickToDetail('history')} />
      </AtList>
    </View>
  )
}

export default React.memo(Center);

