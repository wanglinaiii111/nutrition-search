import React, { useEffect, useState } from 'react';
import { View, CoverImage } from '@tarojs/components'
import styles from './index.module.scss'
import '../../custom.scss'
import { AtCard, AtList, AtListItem, AtAccordion, AtIcon } from 'taro-ui'
import { getFoodInfo, setCollectFood, setUnCollectFood } from '../../utils/api'
import { getFoodInfoAction, setEleClassStatusAction, setUserCollectStatusAction,setFoodCodeAction } from '../../actions/food'
import { useDispatch, useSelector } from 'react-redux';

const Detail = (props) => {
  const dispatch = useDispatch()
  const foodInfo = useSelector(state => state.food.foodInfo)
  const elementClassMap = useSelector(state => state.food.elementClassMap)
  const elementMap = useSelector(state => state.food.elementMap)
  const classList = useSelector(state => state.food.classList)
  const [parentClass, set_parentClass] = useState({})
  const userId = useSelector(state => state.user.userId)

  const handleClick = (index, status) => {
    dispatch(setEleClassStatusAction(index, status))
  }

  const getParams = (key) => {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const options = currentPage.options;
    return options[key]
  }

  const clickCollect = () => {
    const param = {
      userId: userId,
      code: foodInfo.code
    }
    if (+foodInfo.isCollect === 1) {
      setUnCollectFood(param).then(() => {
        dispatch(setUserCollectStatusAction(0, foodInfo.code))
        dispatch(setFoodCodeAction(foodInfo.code, true))
      })
      return;
    }
    setCollectFood(param).then(() => {
      dispatch(setUserCollectStatusAction(1, foodInfo.code))
      dispatch(setFoodCodeAction(foodInfo.code, true))
    })
  }

  useEffect(async () => {
    const code = getParams('code') || 259;
    const info = await getFoodInfo({
      code: code,
      userId: userId,
    })
    classList.map(item => {
      if (item.code == info.classCode) {
        set_parentClass(item)
      }
    })
    dispatch(getFoodInfoAction(info))
  }, [])

  return <View className='classify-detail'>
    <View className={styles.parentClass}>食材类别：{foodInfo.className}</View>
    <AtCard className={styles.card}
    >
      <View className={styles.headerContainer}>
        <View className={styles.header} style={{ backgroundColor: `${parentClass.color}80` }}>
          {
            foodInfo.classCode && <CoverImage className={styles.logo} src={`../../image/class/${foodInfo.classCode}.png`} />
          }
          <View className={styles.name}>{foodInfo.name}</View>
        </View>
        <View className={styles.title}>
          <View className={styles.titleLeft}>
            <View className={styles.icon}></View>
            营养成分（每100克）
          </View>
          <AtIcon prefixClass='iconfont' value='shoucang' size='22' color={+foodInfo.isCollect === 1 ? '#44b9ed' : '#615f5f'} onClick={clickCollect}></AtIcon>
        </View>
      </View>
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