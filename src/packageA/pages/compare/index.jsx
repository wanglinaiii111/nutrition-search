import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import FilterFood from '../filter-food/index'
import FilterElement from '../filter-element/index'
import styles from './index.module.scss'
import { PanelTitle } from '../panel-title/index'
import { batch, useDispatch, useSelector } from 'react-redux'
import { setSelectedFoodAction, deleteSelectedFoodAction, setSelectedEleAction, deleteSelectedEleAction } from '../../../actions/food'
import { alert } from '../../../utils/util'
import { Table } from '../table/index'
import { BarChart } from '../barChart/index'
import { ele } from './config'

const _ = require('underscore')

const Compare = (props) => {
  const dispatch = useDispatch()
  const [showFilter, set_showFilter] = useState(1)
  const selectedFood = useSelector(state => state.food.selectedFood)
  const selectedElement = useSelector(state => state.food.selectedElement)

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
    Taro.setStorage({
      key: "selectedFood",
      data: selectedFood
    })
  }, [selectedFood])

  useEffect(() => {
    Taro.setStorage({
      key: "selectedElement",
      data: selectedElement
    })
  }, [selectedElement])

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
      <View className={styles.filter}>
        <AtButton type={showFilter === 4 && 'primary'} size='small' onClick={() => set_showFilter(4)}>查看报告</AtButton>
      </View>
    </View>
    <View className={`${styles.filterContainer} filterContainer`}>
      {
        _.find([
          showFilter === 1 && <FilterFood selectedFood={selectedFood} handleClickadd={handleClickadd} handleDelete={handleDelete}></FilterFood>,
          showFilter === 2 && <FilterElement selectedElement={selectedElement} handleClickaddEle={handleClickaddEle} handleDeleteEle={handleDeleteEle}></FilterElement>,
          showFilter === 3 &&
          <View className={styles.table}>
            <View className={styles.save}>
              <AtButton size='small'>保存报告</AtButton>
            </View>
            <View>

            </View>
            <PanelTitle>营养元素含量对比表</PanelTitle>
            <Table></Table>
            <PanelTitle>营养元素含量对比条形图</PanelTitle>
            <BarChart></BarChart>
          </View>
        ], Boolean)
      }
    </View>
  </View>
}

export default React.memo(Compare);