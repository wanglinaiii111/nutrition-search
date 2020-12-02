// import React, { useEffect, useState, useRef } from 'react';
// import { View, ScrollView } from '@tarojs/components'
// import styles from './index.module.scss'
// import { useSelector } from 'react-redux';
// import { getFoodInfo } from '../../utils/api'
// import Line from '../../components/barChart/index'

// const xData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
// const yData = [820, 932, 901, 934, 1290, 1330, 1320]

// const BarChart = (props) => {
//   const userId = useSelector(state => state.user.userId)
//   const elementMap = useSelector(state => state.food.elementMap)
//   const selectedFood = useSelector(state => state.food.selectedFood)
//   const [tableData, set_tableData] = useState([])
//   const chartEl = useRef(null);
//   const [barChart, set_barChart] = useState({})

//   useEffect(() => {
//     let arr = [];
//     Object.keys(selectedFood).map(key => {
//       arr.push(getFoodInfo({
//         code: key,
//         userId: userId,
//       }))
//     })
//     Promise.all(arr).then(res => {
//       set_tableData(res)
//     })
//   }, [selectedFood])


//   return <View className={styles.barChart}>
//     <Line  xData={xData} yData={yData} />
//   </View>
// }

// export { BarChart }

import React, { useEffect, useState, useRef } from 'react';
import { View } from '@tarojs/components'
import styles from './index.module.scss'
import { useSelector } from 'react-redux';
import { getFoodInfo } from '../../utils/api'
import { EChart } from 'echarts-taro3-react'

const xData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const yData = [820, 932, 901, 934, 1290, 1330, 1320]

const BarChart = (props) => {
  const userId = useSelector(state => state.user.userId)
  const elementMap = useSelector(state => state.food.elementMap)
  const selectedFood = useSelector(state => state.food.selectedFood)
  const [tableData, set_tableData] = useState([])
  const refLineChart = useRef(null);

  const init = (xdata, series, names) => {
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: names,
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '210',
        top: 0,
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: 'category',
        data: xdata
      },
      series: series
      // [
      //   {
      //     name: '2011年',
      //     type: 'bar',
      //     label: {
      //       show: true,
      //       position: 'right',
      //       formatter: '{c}',
      //       fontSize: 12
      //     },
      //     data: yData
      //   },
      //   {
      //     name: '2012年',
      //     type: 'bar',
      //     label: {
      //       show: true,
      //       position: 'right',
      //       formatter: '{c}',
      //       fontSize: 12
      //     },
      //     data: yData
      //   }
      // ]
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
    tableData.map(item => {
      xdata.push(item.name)
    })
    elementMap.map(ele => {
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
          fontSize: 12
        },
        data: ydata
      })
    })

    console.log(xdata, series, legendName);
    init(xdata, series, legendName)
  }, [tableData])


  return <View className={styles.barChart} style={{ height: `${elementMap.length * 2 * 50}px` }}>
    <EChart ref={refLineChart} canvasId='line-chart' />
  </View>
}

export { BarChart }