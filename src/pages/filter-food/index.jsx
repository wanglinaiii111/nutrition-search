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
  const [searchVal, set_searchVal] = useState('')
  const [scrollHeight, setScrollHeight] = useState(0);
  const [searchCondition, setsearchCondition] = useState({});
  const classList = useSelector(state => state.food.classList)
  const foodAllList = useSelector(state => state.food.foodAllList)

  const handleClick = async (index) => {
    set_current(index)
    if (index === 0) {
      return set_page(1)
    }
    if (foodAllList[index].length > 0 && searchCondition.searchVal === searchVal) {
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
    set_searchVal(val)
  }

  const onActionClick = () => {
    getList().then((res) => {
      if (current === 0) {
        return
      }
      const list = res.filter(item => {
        return item.classCode === classList[current].code
      })
      dispatch(setFoodAllListAction(current, list))
    })
  }

  const getList = async () => {
    return new Promise(async (resolve) => {
      const param = { searchWord: searchVal }
      const list = await getFoodAllList(param)
      dispatch(setFoodAllListAction(0, list))
      setsearchCondition(param)
      resolve(list)
    })
  }

  useEffect(() => {
    (async () => {
      setTimeout(async () => {
        const h1 = await getHeight('.filterContainer');
        const h2 = await getHeight('.search');
        setScrollHeight(h1.height - h2.height)
      }, 100)
      getList()
    })()
  }, [])

  return <View className='filterFood'>
    <AtSearchBar
      className='search'
      value={searchVal}
      onChange={onChangeSearch}
      onActionClick={onActionClick}
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