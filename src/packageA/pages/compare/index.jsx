import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, CoverImage } from '@tarojs/components'
import { AtBadge, AtButton, AtDrawer, AtIcon } from 'taro-ui'
import FilterFood from '../filter-food/index'
import FilterElement from '../filter-element/index'
import styles from './index.module.scss'
import { PanelTitle } from '../panel-title/index'
import { batch, useDispatch, useSelector } from 'react-redux'
import { setSelectedFoodAction, deleteSelectedFoodAction, setSelectedEleAction, deleteSelectedEleAction } from '../../../actions/food'
import { alert } from '../../../utils/util'
import { CONFIG } from '../../../utils/config'
import { Table } from '../table/index'
import { BarChart } from '../barChart/index'

const domain = CONFIG.domain
const _ = require('underscore')
const ele = {
  Water: {
    class: "C1",
    code: "Water",
    name: "水分",
  },
  Energy: {
    class: "C1",
    code: "Energy",
    name: "能量",
  },
  Protein: {
    class: "C1",
    code: "Protein",
    name: "蛋白质",
  }
}

const Compare = (props) => {
  const dispatch = useDispatch()
  const [showFilter, set_showFilter] = useState(3)
  const [showListModal, set_showListModal] = useState(false)
  const [showElementModal, set_showElementModal] = useState(false)
  // const [showTable, set_showTable] = useState(true)
  const [badgeVal, set_badgeVal] = useState(0)
  const [elementVal, set_elementVal] = useState(0)
  const [classListMap, set_classListMap] = useState({})
  const selectedFood = useSelector(state => state.food.selectedFood)
  const selectedElement = useSelector(state => state.food.selectedElement)
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

  const handleClickaddEle = (item) => {
    return () => {
      if (selectedElement[item.code]) {
        handleDeleteEle(item.code)
        return;
      }
      dispatch(setSelectedEleAction(item))
      alert('添加成功')
    }
  }

  const handleDeleteEle = (code) => {
    dispatch(deleteSelectedEleAction(code))
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

    let selectedEle = Taro.getStorageSync('selectedElement')
    if (!selectedEle) {
      selectedEle = ele;
    }
    batch(() => {
      Object.keys(selectedEle).map(key => {
        dispatch(setSelectedEleAction(selectedEle[key]))
      })
    })
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
    const eleLen = Object.keys(selectedElement).length || 0;
    set_elementVal(eleLen)
    Taro.setStorage({
      key: "selectedElement",
      data: selectedElement
    })
  }, [selectedElement])

  useEffect(() => {
    let obj = {}
    classList.map(item => {
      obj[item.code] = item
    })
    set_classListMap(obj)
  }, [classList])

  return <View className={styles.compare}>
    <View className={styles.tools}>
      <View className={styles.filter} onClick={() => set_showFilter(1)}>
        <AtButton type={showFilter === 1 && 'primary'} size='small'>食材</AtButton>
      </View>
      <View className={styles.filter} onClick={() => set_showFilter(2)}>
        <AtButton type={showFilter === 2 && 'primary'} size='small'>元素</AtButton>
      </View>
      <View className={styles.filter}>
        <AtButton type={showFilter === 3 && 'primary'} size='small' onClick={() => set_showFilter(3)}>生成报表</AtButton>
      </View>
      <AtBadge className={styles.badgeVal} value={badgeVal} maxValue={99}>
        <AtButton size='small' onClick={() => set_showListModal(true)}>已选食材</AtButton>
      </AtBadge>
      <AtBadge value={elementVal}>
        <AtButton size='small' onClick={() => set_showElementModal(true)}>已选元素</AtButton>
      </AtBadge>
    </View>
    <View className={`${styles.filterContainer} filterContainer`}>
      {
        _.find([
          showFilter === 1 && <FilterFood checkedList={selectedFood} handleClickadd={handleClickadd}></FilterFood>,
          showFilter === 2 && <FilterElement checkedList={selectedElement} handleClickaddEle={handleClickaddEle}></FilterElement>,
          showFilter === 3 &&
          <>
            {/* <View className={styles.icons}>
              <AtIcon onClick={() => set_showTable(true)} className={styles.iconBtn} prefixClass='iconfont' value='liebiao' size='22' color={showTable ? '#44b9ed' : '#333'}></AtIcon>
              <AtIcon onClick={() => set_showTable(false)} className={styles.iconBtn} prefixClass='iconfont' value='tubiao-zhuzhuangtu' size='22' color={!showTable ? '#44b9ed' : '#333'}></AtIcon>
            </View> */}
            {/* {
              showTable ? <Table></Table> : !showElementModal && !showListModal ? <BarChart></BarChart> : null
            } */}
            <PanelTitle>营养元素含量对比表</PanelTitle>
            <Table></Table>
            <PanelTitle>营养元素含量对比条形图</PanelTitle>
            <BarChart></BarChart>
          </>
        ], Boolean)
      }
    </View>

    <AtDrawer
      show={showElementModal}
      onClose={() => set_showElementModal(false)}
      mask
      right
    >
      <View className={styles.drawer}>
        <PanelTitle>元素列表</PanelTitle>
        {
          Object.keys(selectedElement).map(key => {
            return <View className={styles.drawerItem}>
              <View className={styles.content}>{selectedElement[key].name}</View>
              <AtIcon value='close' size='15' color='#e00f0f' onClick={() => handleDeleteEle(key)} />
            </View>
          })
        }
      </View>
    </AtDrawer>
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

export default React.memo(Compare);