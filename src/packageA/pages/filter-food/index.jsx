import React, { useEffect, useState } from 'react'
import { View, ScrollView, CoverImage, Text } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtList, AtListItem, AtSearchBar, AtDrawer, AtIcon, AtFab } from 'taro-ui'
import { useDispatch, useSelector } from 'react-redux'
import { getFoodAllList } from '../../../utils/api'
import { setFoodAllListAction } from '../../../actions/food'
import styles from './index.module.scss'
import { getHeight } from '../../../utils/util'
import { CONFIG } from '../../../utils/config'
import { PanelTitle } from '../panel-title/index'

const domain = CONFIG.domain

const FilterFood = (props) => {
  const { handleClickadd, selectedFood, handleDelete } = props;
  const dispatch = useDispatch()
  const [current, set_current] = useState(0)
  const [page, set_page] = useState(1)
  const [searchVal, set_searchVal] = useState('')
  const [scrollHeight, setScrollHeight] = useState(0);
  const [showListModal, set_showListModal] = useState(false)
  const [searchCondition, set_searchCondition] = useState({});
  const classList = useSelector(state => state.food.classList)
  const foodAllList = useSelector(state => state.food.foodAllList)
  const [classListMap, set_classListMap] = useState({})

  const handleClick = async (index) => {
    console.log(searchCondition, searchVal);
    let data = foodAllList[0];
    if (searchCondition.searchWord !== searchVal) {
      data = await getList()
    }
    set_current(index)
    if (index === 0) {
      return set_page(1)
    }
    const list = data.filter(item => {
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
      set_searchCondition(param)
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

  useEffect(() => {
    let obj = {}
    classList.map(item => {
      obj[item.code] = item
    })
    set_classListMap(obj)
  }, [classList])

  return <View className='filterFood'>
    <AtFab className={styles.fabBtn} onClick={() => set_showListModal(true)}>
      <Text>已选</Text>
    </AtFab>
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
                      return <AtListItem className={selectedFood[listItem.code] && styles.listItemActive} title={listItem.name}
                        onClick={handleClickadd(listItem)} arrow={selectedFood[listItem.code] && 'right'} />
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
    <AtDrawer
      show={showListModal}
      onClose={() => set_showListModal(false)}
      mask
      right
    >
      <View className={styles.drawer}>
        <PanelTitle>食材列表</PanelTitle>
        {
          Object.keys(selectedFood).map(key => {
            return <View className={styles.drawerItem}>
              <View className={styles.thumb} style={{
                backgroundColor: `${classListMap[selectedFood[key]['classCode']] &&
                  classListMap[selectedFood[key]['classCode']]['color']}`
              }}>
                <CoverImage src={`${domain}/images/class/${selectedFood[key]['classCode']}.png`} />
              </View>
              <View className={styles.content}>{selectedFood[key].name}</View>
              <AtIcon value='close' size='15' color='#e00f0f' onClick={() => handleDelete(key)} />
            </View>
          })
        }
      </View>
    </AtDrawer>
  </View>
}

export default React.memo(FilterFood);