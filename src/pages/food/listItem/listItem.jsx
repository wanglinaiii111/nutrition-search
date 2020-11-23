import React, { useEffect, useState } from 'react';
import { View } from '@tarojs/components'
import styles from './listItem.module.scss'
import { batch, useDispatch, useSelector } from 'react-redux';
import { AtIcon } from 'taro-ui'
import { setCollectFood, setUnCollectFood } from '../../../utils/api'
import { setUserCollectStatusAction, setFoodCodeAction } from '../../../actions/food'

const ListItem = React.memo((props) => {
  const { data, clickToDetail } = props;
  const elementMap = useSelector(state => state.food.elementMap)
  const classList = useSelector(state => state.food.classList)
  const current = useSelector(state => state.food.current)
  const userId = useSelector(state => state.user.userId)
  const foodCodes = useSelector(state => state.food.foodCodes)
  const dispatch = useDispatch()

  const click = () => {
    clickToDetail()
  }

  const clickCollect = (e) => {
    const param = {
      userId: userId,
      code: data.code
    }
    if (+data.isCollect === 1 || foodCodes[data.code]) {
      setUnCollectFood(param).then(() => {
        batch(() => {
          dispatch(setUserCollectStatusAction(0, data.code))
          dispatch(setFoodCodeAction(data.code, false))
        })

      })
      return;
    }
    setCollectFood(param).then(() => {
      batch(() => {
        dispatch(setUserCollectStatusAction(1, data.code))
        dispatch(setFoodCodeAction(data.code, true))
      })

    })
  }
  console.log(foodCodes);

  return <View className={styles.container}>
    <View className={styles.content}>
      <View className={styles.name} onClick={click}>
        {data.name}
        <View className={styles.name_after} style={{ backgroundColor: classList[current].color + '1A' }}></View>
      </View>
      <View style={{ zIndex: 100 }} onClick={clickCollect}>
        <AtIcon prefixClass='iconfont' value='shoucang' size='22' color={+data.isCollect === 1 || foodCodes[data.code] ? '#44b9ed' : '#615f5f'}
        ></AtIcon>
      </View>

    </View>
    <View className={styles.list} onClick={click}>
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
