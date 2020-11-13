import React from 'react';
import { View } from '@tarojs/components'
import styles from './listItem.module.scss'
import { useSelector } from 'react-redux';

const ListItem = React.memo((props) => {
  const { data, clickToDetail } = props;
  const elementMap = useSelector(state => state.food.elementMap)
  const click = () => {
    clickToDetail()
  }

  return <View className={styles.container} onClick={click}>
    <View className={styles.content}>
      <View className={styles.avatar}></View>
      <View className={styles.name}>{data.name}</View>
    </View>
    <View className={styles.list}>
      {
        Object.keys(data.eles)
          .map(item => {
            return <>
              <View
                className={styles.listItem}
              >
                <View className={styles.elementName}>{
                  elementMap.map(e => {
                    if (e.code === item) {
                      return e.name
                    }
                  })
                }</View>
                <View className={styles.zhi}>
                  {data.eles[item]}
                </View>
              </View>

            </>
          })
      }
    </View>
  </View>
})

export { ListItem }
