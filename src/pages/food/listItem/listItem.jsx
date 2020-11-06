import React from 'react';
import { View } from '@tarojs/components'
import styles from './listItem.module.scss'

const ListItem = React.memo((props) => {
  const { data } = props;

  return <View className={styles.container}>
    <View className={styles.content}>
      <View className={styles.avatar}></View>
      <View className={styles.name}>{data.name}</View>
    </View>
    <View className={styles.list}>
      {
        Object.keys(data.content)
          .map(item => {
            return <>
              <View
                className={styles.listItem}
              >
                <View className={styles.elementName}>{item}</View>
                <View className={styles.zhi}>
                  {data.content[item]}
                </View>
              </View>

            </>
          })
      }
    </View>
  </View>
})

export { ListItem }
