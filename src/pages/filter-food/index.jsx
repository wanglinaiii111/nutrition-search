import React, { useEffect, useState } from 'react'
import { View, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtList, AtListItem, AtSearchBar } from 'taro-ui'
import { useDispatch, useSelector } from 'react-redux'
import { getFoodAllList } from '../../utils/api'
import { setFoodAllListAction } from '../../actions/food'
import styles from './index.module.scss'
import { getHeight } from '../../utils/util'

const FilterFood = (props) => {
  const { handleClickadd, checkedList } = props;
  const dispatch = useDispatch()
  const [current, set_current] = useState(0)
  const [page, set_page] = useState(1)
  const [searchValue, set_searchValue] = useState('')
  const [scrollHeight, setScrollHeight] = useState(0);
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

  const onChangeSearch = (val) => {

  }

  useEffect(() => {
    (async () => {
      setTimeout(async () => {
        const h1 = await getHeight('.filterContainer');
        const h2 = await getHeight('.search');
        setScrollHeight(h1.height - h2.height)
      }, 100)

      if (foodAllList.length > 0 && foodAllList[0].length === 0) {
        const list = await getFoodAllList()
        dispatch(setFoodAllListAction(current, list))
      }
    })()
  }, [])

  return <View className='filterFood'>
    <AtSearchBar
      className='search'
      value={searchValue}
      onChange={onChangeSearch}
    />
    <AtTabs
      current={current}
      scroll
      height={`${scrollHeight}px`}
      tabDirection='vertical'
      tabList={classList}
      onClick={handleClick}>
      {
        classList.map((item, index) => {
          return <AtTabsPane tabDirection='vertical' current={current} index={index}>
            <ScrollView
              scroll-y
              onScrolltolower={onScrolltolower}
              style={{ height: `${scrollHeight}px` }}
            >
              <AtList hasBorder={false}>
                {
                  index === current && foodAllList[current].map((listItem, listIndex) => {
                    if (listIndex <= page * 100) {
                      return <AtListItem className={checkedList[listItem.code] && styles.listItemActive} title={listItem.name}
                        onClick={handleClickadd(listItem)} arrow={checkedList[listItem.code] && 'right'} />
                    }
                    return null;
                  })
                }
              </AtList>
            </ScrollView>
          </AtTabsPane>
        })
      }
    </AtTabs>
  </View>
}

export default React.memo(FilterFood);