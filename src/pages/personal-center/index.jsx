import React, { useEffect, useState } from 'react'
import { View, Image, Text } from '@tarojs/components'
import { getUserInfo } from '../../utils/sdk'

import styles from './index.module.scss'

const Center = (props) => {
  const [userInfo, setUserInfo] = useState(null)
  useEffect(async () => {
    const user = await getUserInfo();
    setUserInfo(user);
  }, [])
  return (
    <View className={styles.index}>
      <View className={styles.topBg}>
        <Image
          className={styles.avatar}
          src={userInfo && userInfo.avatarUrl}
        />
        <Text className={styles.nickName}>{userInfo && userInfo.nickName}</Text>
      </View>
      <View className={styles.container}>
        123
      </View>
    </View>
  )
}

export default React.memo(Center);

