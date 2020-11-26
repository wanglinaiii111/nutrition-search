import React, { useEffect, useState } from 'react'
import { View, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtList, AtListItem } from 'taro-ui'
import { useDispatch, useSelector } from 'react-redux'
import { getFoodAllList } from '../../utils/api'
import { setFoodAllListAction } from '../../actions/food'

const FilterFood = (props) => {
  const { handleClickadd } = props;
  const dispatch = useDispatch()
  const [current, set_current] = useState(0)
  const [page, set_page] = useState(1)
  const classList = useSelector(state => state.food.classList)
  const foodAllList = useSelector(state => state.food.foodAllList)

  const handleClick = async (index) => {
    set_current(index)
    if (index === 0) {
      return set_page(1)
    }
    if (foodAllList[index].length > 0) {
      return;
    }
    const list = foodAllList[0].filter(item => {
      return item.classCode === classList[index].code
    })
    dispatch(setFoodAllListAction(index, list))
  }

  const onScrolltolower = () => {
    set_page(page + 1)
  }

  useEffect(async () => {
    if (foodAllList[0].length === 0) {
      const list = await getFoodAllList()
      dispatch(setFoodAllListAction(current, list))
    }
  }, [])

  return <View className='filterFood'>
    <AtTabs
      current={current}
      scroll
      height='200px'
      tabDirection='vertical'
      tabList={classList}
      onClick={handleClick}>
      {
        classList.map((item, index) => {
          return <AtTabsPane tabDirection='vertical' current={current} index={index}>
            <ScrollView
              scroll-y
              onScrolltolower={onScrolltolower}
              // className={styles.scrollView}
              // style={{ height: `${scrollHeight}px` }}
              style={{ height: `200px` }}
            >
              <AtList hasBorder={false}>
                {
                  index === current && foodAllList[current].map((listItem, listIndex) => {
                    if (listIndex <= page * 100) {
                      return <AtListItem title={listItem.name} onClick={handleClickadd(listItem)} />
                    }
                    return null;
                  })
                }
              </AtList>
            </ScrollView>
            {/* <AtList hasBorder={false}>
              {
                index === current && foodAllList[current].map((listItem) => {
                  return <AtListItem title={listItem.name} onClick={handleClickadd(listItem)} />
                })
              }
            </AtList> */}
          </AtTabsPane>
        })
      }
    </AtTabs>
  </View>
}

export default React.memo(FilterFood);