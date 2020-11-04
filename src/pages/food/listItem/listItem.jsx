import React from 'react';
import { View } from '@tarojs/components'
import styles from './listItem.scss'

const ListItem = React.memo((props) => {
  const { data } = props;
  console.log(data)

  return <View className={styles.container}>
    <View className={styles.avatar}></View>
    <View className={styles.name}>{data.name}</View>
    {
      Object.keys(data.content)
        .map(item => {
          return <View>
            {item}
          </View>
        })
    }
  </View>
})

export { ListItem }
