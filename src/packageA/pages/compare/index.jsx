import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtIcon } from 'taro-ui'
import FilterFood from '../filter-food/index'
import FilterElement from '../filter-element/index'
import styles from './index.module.scss'
import { PanelTitle } from '../panel-title/index'
import { batch, useDispatch, useSelector } from 'react-redux'
import { setSelectedFoodAction, deleteSelectedFoodAction, setSelectedEleAction, deleteSelectedEleAction, setTableData } from '../../../actions/food'
import { alert } from '../../../utils/util'
import { Table } from '../table/index'
import { BarChart } from '../barChart/index'
import { PieChart } from '../pieChart/index'
import { ele } from './config'
import { getFoodInfo, saveCompareRecode } from '../../../utils/api'

const _ = require('underscore')

const Compare = (props) => {
  const dispatch = useDispatch()
  const [showFilter, set_showFilter] = useState(3)
  const selectedFood = useSelector(state => state.food.selectedFood)
  const selectedElement = useSelector(state => state.food.selectedElement)
  const userId = useSelector(state => state.user.userId)
  const [showHistory, set_showHistory] = useState(false)

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

  const saveCompare = () => {
    if (Object.keys(selectedFood).length === 0) {
      alert('您还没有添加食材哦~')
      return;
    }
    const param = {
      food: Object.keys(selectedFood),
      element: Object.keys(selectedElement),
      userId
    }
    saveCompareRecode(param)
  }

  const navTo = ()=>{
    Taro.navigateTo({
      url:'../history/index'
    })
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
    let arr = [];
    Object.keys(selectedFood).map(key => {
      arr.push(getFoodInfo({
        code: key,
        userId: userId,
      }))
    })
    Promise.all(arr).then(res => {
      dispatch(setTableData(res))
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
        <AtButton type={showFilter === 3 && 'primary'} size='small' onClick={() => set_showFilter(3)}>报告</AtButton>
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
              <AtIcon onClick={saveCompare} prefixClass='iconfont' value='-baocun' size='26' color='#615f5f'></AtIcon>
              <AtIcon onClick={navTo} prefixClass='iconfont' value='jilu' size='24' color={showFilter === 4 ? '#44b9ed' : '#615f5f'}></AtIcon>
            </View>
            {
              !showHistory
                ? <>
                  <PanelTitle>营养元素含量对比表</PanelTitle>
                  <Table></Table>
                  <PanelTitle>营养元素含量对比条形图</PanelTitle>
                  <BarChart></BarChart>
                  <PanelTitle>营养元素含量分布图</PanelTitle>
                  {
                    Object.keys(selectedElement).map((item, index) => {
                      return <PieChart ele={selectedElement[item]} canvasId={'pie-chart' + index}></PieChart>
                    })
                  }
                </>
                : <>
                </>
            }
          </View>
        ], Boolean)
      }
    </View>
  </View>
}

export default React.memo(Compare);