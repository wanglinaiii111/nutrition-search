import React, { useEffect, useState } from 'react';
import { View } from '@tarojs/components'
import styles from './index.module.scss'
import { AtCard, AtList, AtListItem, AtAccordion } from 'taro-ui'
import { getFoodInfo } from '../../utils/api'
import { getFoodInfoAction, setEleClassStatusAction } from '../../actions/food'
import { useDispatch, useSelector } from 'react-redux';

const Detail = (props) => {
  const dispatch = useDispatch()
  const foodInfo = useSelector(state => state.food.foodInfo)
  const elementClassMap = useSelector(state => state.food.elementClassMap)
  const elementMap = useSelector(state => state.food.elementMap)

  const handleClick = (index, status) => {
    dispatch(setEleClassStatusAction(index, status))
  }

  const getParams = (key) => {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const options = currentPage.options;
    return options[key]
  }

  useEffect(async () => {
    const code = getParams('code') || 259;
    const info = await getFoodInfo({
      code: code
    })
    dispatch(getFoodInfoAction(info))
  }, [])
  return <View>
    
    <View className={styles.title}><View className={styles.icon}></View>营养成分（每100克）</View>
    <AtCard className={styles.card}
      extra={foodInfo.info}
      title={foodInfo.name}
      note={`食材类别：${foodInfo.className}`}
    >
      {
        elementClassMap.map((classItem, index) => {
          return <AtAccordion
            open={classItem.isOpened}
            onClick={e => handleClick(index, e)}
            title={classItem.name}
          >
            <AtList hasBorder={false}>
              {
                elementMap.map(ele => {
                  return classItem.code === ele.class && <AtListItem title={ele.name} extraText={foodInfo[ele.code]} />
                })
              }
            </AtList>
          </AtAccordion>
        })
      }
    </AtCard>
  </View>
}

export default React.memo(Detail)