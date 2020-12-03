import React, { useEffect, useState, useRef } from 'react';
import { View } from '@tarojs/components'
import styles from './index.module.scss'
import { useSelector } from 'react-redux';
import { getFoodInfo } from '../../../utils/api'
import { EChart } from 'echarts-taro3-react'

const BarChart = (props) => {
  const userId = useSelector(state => state.user.userId)
  const elementMap = useSelector(state => state.food.elementMap)
  const selectedFood = useSelector(state => state.food.selectedFood)
  const selectedElement = useSelector(state => state.food.selectedElement)
  const [tableData, set_tableData] = useState([])
  const refLineChart = useRef(null);
  const [height, set_height] = useState(0)

  const init = (xdata, series, names, selected) => {
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: names,
        bottom: 0,
        // selected: selected
      },
      grid: {
        left: '3%',
        right: '10%',
        bottom: Math.ceil(Object.keys(selectedElement).length / 4) * 40,
        top: 0,
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: 'category',
        data: xdata,
      },
      series: series
    }

    refLineChart.current.refresh(option)
  }

  useEffect(() => {
    let arr = [];
    Object.keys(selectedFood).map(key => {
      arr.push(getFoodInfo({
        code: key,
        userId: userId,
      }))
    })
    Promise.all(arr).then(res => {
      set_tableData(res)
    })
  }, [selectedFood])

  useEffect(() => {
    if (tableData.length === 0) return;
    let series = [];
    let xdata = [];
    let legendName = []
    let selected = {};
    tableData.map(item => {
      xdata.push(item.name)
    })
    Object.keys(selectedElement).map(key => {
      const ele = selectedElement[key]
      legendName.push(ele.name)
      // selected[ele.name] = false;
      let ydata = [];
      tableData.map(item => {
        ydata.push(parseInt(item[ele.code]) === 'NAN' ? 0 : parseInt(item[ele.code]))
      })
      series.push({
        name: ele.name,
        type: 'bar',
        label: {
          show: true,
          position: 'right',
          formatter: '{c}',
          fontSize: 12
        },
        data: ydata
      })
    })
    const h = Object.keys(selectedElement).length * Object.keys(selectedFood).length * 50
    console.log(h, 'height');

    set_height(h)

    // Object.keys(selectedElement).map(item => {
    //   const name = selectedElement[item]['name'];
    //   selected[name] = true;
    // })

    // console.log(xdata, series, legendName, selected);
    init(xdata, series, legendName, selected)
  }, [tableData,selectedElement])


  return <View className={styles.barChart} style={{ height: `${height}px` }}>
    <EChart ref={refLineChart} canvasId='line-chart' />
  </View>
}

export { BarChart }