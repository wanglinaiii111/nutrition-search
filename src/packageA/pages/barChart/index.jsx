import React, { useEffect, useState, useRef } from 'react';
import { View } from '@tarojs/components'
import styles from './index.module.scss'
import { useSelector } from 'react-redux';
import { getFoodInfo } from '../../../utils/api'
import { EChart } from 'echarts-taro3-react'

const color = ['#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE', '#3BA272',
  '#FC8452', '#9A60B4', '#EA7CCC', '#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae',
  '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3']

const BarChart = (props) => {
  const userId = useSelector(state => state.user.userId)
  const selectedFood = useSelector(state => state.food.selectedFood)
  const selectedElement = useSelector(state => state.food.selectedElement)
  const [tableData, set_tableData] = useState([])
  const refLineChart = useRef(null);
  const [height, set_height] = useState(0)

  const init = (xdata, series, names, selected) => {
    const option = {
      color: color,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        type: 'scroll',
        padding: [5, 20],
        data: names,
        bottom: 10,
        itemWidth: 8,
        itemHeight: 8,
        textStyle: {
          fontSize: 10,
        },
      },
      grid: {
        left: '3%',
        right: '10%',
        bottom: 40,
        top: 0,
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        axisLabel: {
          show: true,
          textStyle: {
            color: '#333'
        }
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#cccccc6e'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#cccccc6e'
          }
        },
      },

      yAxis: {
        type: 'category',
        axisTick: {
          show: false
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          lineHeight: 13,
          fontSize: 10,
          formatter: function (value) {
            if (value.length > 12) {
              return value.substring(0, 6) + '\n' + value.substring(6, 11) + "...";
            }
            if (value.length > 6) {
              return value.substring(0, 6) + '\n' + value.substring(6);
            }
            return value;
          }
        },
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
          fontSize: 10
        },
        data: ydata
      })
    })
    const h = Object.keys(selectedElement).length * Object.keys(selectedFood).length * 23

    set_height(h)

    init(xdata, series, legendName, selected)
  }, [tableData, selectedElement])

  return <View className={styles.barChart} style={{ height: `${height}px` }}>
    <EChart ref={refLineChart} canvasId='line-chart' />
  </View>
}

export { BarChart }