import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, CoverImage } from '@tarojs/components'
import { AtBadge, AtButton, AtDrawer, AtIcon, AtSearchBar } from 'taro-ui'
import FilterFood from '../filter-food/index'
import styles from './index.module.scss'
import { PanelTitle } from '../panel-title/index'
import { batch, useDispatch, useSelector } from 'react-redux'
import { setSelectedFoodAction, deleteSelectedFoodAction } from '../../actions/food'
import { alert } from '../../utils/util'
import { CONFIG } from '../../utils/config'

const domain = CONFIG.domain

const Compare = (props) => {
  const dispatch = useDispatch()
  const [showFilter, set_showFilter] = useState(false)
  const [showListModal, set_showListModal] = useState(false)
  const [badgeVal, set_badgeVal] = useState(0)
  const [classListMap, set_classListMap] = useState({})
  const selectedFood = useSelector(state => state.food.selectedFood)
  const classList = useSelector(state => state.food.classList)

  const handleClickadd = (item) => {
    return () => {
      if (selectedFood[item.code]) {
        handleDelete(item.code)
        return;
      }
      dispatch(setSelectedFoodAction(item))
      alert('添加成功')
    }
  }

  const handleDelete = (code) => {
    dispatch(deleteSelectedFoodAction(code))
    alert('删除成功')
  }

  useEffect(() => {
    const selected = Taro.getStorageSync('selectedFood')
    if (selected) {
      batch(() => {
        Object.keys(selected).map(key => {
          dispatch(setSelectedFoodAction(selected[key]))
        })
      })
    }
  }, [])

  useEffect(() => {
    const len = Object.keys(selectedFood).length || 0;
    set_badgeVal(len)
    Taro.setStorage({
      key: "selectedFood",
      data: selectedFood
    })
  }, [selectedFood])

  useEffect(() => {
    let obj = {}
    classList.map(item => {
      obj[item.code] = item
    })
    set_classListMap(obj)
  }, [classList])

  return <View className={styles.compare}>
    <View className={styles.tools}>
        <View className={styles.filter} onClick={() => set_showFilter(true)}>
          <AtButton type={showFilter && 'primary'} size='small'>筛选食材</AtButton>
        </View>
        <View className={styles.filter}>
          <AtButton type={!showFilter && 'primary'} size='small' onClick={() => set_showFilter(false)}>生成报表</AtButton>
        </View>
        <AtBadge value={badgeVal} maxValue={99}>
          <AtButton size='small' onClick={() => set_showListModal(true)}>已选食材</AtButton>
        </AtBadge>
    </View>
    <View className={`${styles.filterContainer} filterContainer`}>
    {
      showFilter && <FilterFood checkedList={selectedFood} handleClickadd={handleClickadd}></FilterFood>
    }
    </View>
    
    <AtDrawer
      show={showListModal}
      onClose={() => set_showListModal(false)}
      mask
      right
    >
      <View className={styles.drawer}>
        <PanelTitle>对比列表</PanelTitle>
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

export default React.memo(Compare);