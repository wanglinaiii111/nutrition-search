import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { AtButton, AtIcon, AtModal, AtModalContent, AtModalAction, AtModalHeader, AtInput } from 'taro-ui'
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
import { getFoodInfo, saveCompareRecode, getCompareRecode } from '../../../utils/api'

const _ = require('underscore')

const Compare = (props) => {
  const dispatch = useDispatch()
  const [showFilter, set_showFilter] = useState(3)
  const selectedFood = useSelector(state => state.food.selectedFood)
  const selectedElement = useSelector(state => state.food.selectedElement)
  const userId = useSelector(state => state.user.userId)
  const [isOpened, set_isOpened] = useState(false)
  const [inputVal, set_inputVal] = useState('')

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
    set_isOpened(true)
  }

  const handleConfirm = async () => {
    if (!inputVal) return alert('请输入报告名称~');

    const param = {
      food: selectedFood,
      element: selectedElement,
      userId,
      name: inputVal
    }
    let is = false;
    let isName = false;
    const data = await getCompareRecode();
    data.map(item => {
      const isEqualE = _.isEqual(selectedElement, item.element);
      const isEqualF = _.isEqual(selectedFood, item.food);
      if (item.name === inputVal) {
        isName = true
      }
      if (!isEqualE || !isEqualF) {
        return;
      }
      is = true;
    })
    if (is === true) {
      return alert('该报告已存在~')
    }
    if(isName === true){
      return alert('该报告名称已存在，请重新输入~')
    }
    saveCompareRecode(param).then(() => {
      alert('保存成功~')
      set_isOpened(false)
    })
  }

  const navTo = () => {
    Taro.navigateTo({
      url: '../history/index'
    })
  }

  const handleChangeInput = (val) => {
    set_inputVal(val)
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

  return <View className={`${styles.compare} compare`}>
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
          </View>
        ], Boolean)
      }
    </View>
    <AtModal isOpened={isOpened} onClose={() => set_isOpened(false)}>
      <AtModalHeader>将建立新的报告，是否保存？</AtModalHeader>
      <AtModalContent>
        <View className={styles.modal}>
          <AtInput
            name='value'
            type='text'
            placeholder='请输入报告名称'
            value={inputVal}
            onChange={handleChangeInput}
          />
        </View>
      </AtModalContent>
      <AtModalAction>
        <Button onClick={() => set_isOpened(false)}>取消</Button>
        <Button onClick={handleConfirm}>保存</Button> </AtModalAction>
    </AtModal>
  </View>
}

export default React.memo(Compare);