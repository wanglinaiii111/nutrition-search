import React, { useEffect, useState } from 'react';
import { View } from '@tarojs/components'
import styles from './listItem.module.scss'
import { batch, useDispatch, useSelector } from 'react-redux';
import { AtIcon } from 'taro-ui'
import { setCollectFood, setUnCollectFood } from '../../../utils/api'
import { setFoodCodeAction } from '../../../actions/food'
import { alert } from '../../../utils/util'

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
    if (!userId) {
      return alert('请登录账号后进行收藏操作')
    }
    if (+data.isCollect === 1 || foodCodes[data.code]) {
      setUnCollectFood(param).then(() => {
        batch(() => {
          dispatch(setFoodCodeAction(data.code, false))

        })

      })
      return;
    }
    setCollectFood(param).then(() => {
      batch(() => {
        dispatch(setFoodCodeAction(data.code, true))
      })

    })
  }

  return <View className={styles.container}>
    <View className={styles.content}>
      <View className={styles.collect} onClick={clickCollect} style={{ borderTopColor: `${classList[current].color}38` }}>
        <AtIcon className={styles.collectIcon} prefixClass='iconfont' value='shoucang' size='22' color={foodCodes[data.code] ? classList[current].color : '#615f5f'}
        ></AtIcon>
      </View>
      <View className={styles.name} onClick={click}>
        {data.name}
        <View className={styles.name_after} style={{ backgroundColor: classList[current].color + '1A' }}></View>
      </View>
      <View onClick={clickCollect}>
        <AtIcon prefixClass='iconfont' value='shoucang' size='22' color={foodCodes[data.code] ? classList[current].color : '#615f5f'}
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
                {
                  elementMap.map(e => {
                    if (e.code === item) {
                      return <>
                        <View className={styles.elementName}>{
                          e.name
                        }</View>
                        <View className={styles.zhi}>
                          {data.eles[item]}{data.eles[item] && e.unit}
                        </View>
                      </>
                    }
                  })
                }
              </View>

            </>
          })
      }
    </View>
  </View>
})

export { ListItem }
