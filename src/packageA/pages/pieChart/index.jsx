import React, { useEffect, useRef } from 'react';
import { View } from '@tarojs/components'
import styles from './index.module.scss'
import { useSelector } from 'react-redux';
import { EChart } from 'echarts-taro3-react'

const color = ['#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE', '#3BA272',
  '#FC8452', '#9A60B4', '#EA7CCC', '#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae',
  '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3']

const PieChart = (props) => {
  const { canvasId, ele } = props;
  const selectedElement = useSelector(state => state.food.selectedElement)
  const refPieChart = useRef(null);
  const tableData = useSelector(state => state.food.tableData)

  const init = (data, legendName) => {
    const option = {
      color: color,
      title: {
        text: ele.name + '分布',
        left: 'center',
        textStyle: {
          fontWeight: 'lighter',
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'item',
        textStyle: {
          fontSize: 12
        },
        formatter: '{a} \n{b} \n {c} ({d}%)'
      },
      legend: {
        type: 'scroll',
        bottom: 0,
        itemWidth: 8,
        itemHeight: 8,
        textStyle: {
          fontSize: 10,
        },
        data: legendName
      },
      grid: {
        left: '0',
        right: '0',
        top: 0,
        bottom:70,
        containLabel: true
      },
      series: [
        {
          name: ele.name,
          type: 'pie',
          radius: ['25%', '45%'],
          center: ['50%', '50%'],
          label: {
            fontSize: 10,
            formatter: '{b}\n{d}%',
          },
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    refPieChart.current.refresh(option)
  }

  useEffect(() => {
    if (tableData.length === 0) return;
    let data = [];
    let legendName = [];
    tableData.map(item => {
      legendName.push(item.name)
      data.push({
        name: item.name,
        value: item[ele.code]
      })
    })
    init(data, legendName)
  }, [tableData, selectedElement])

  return <View className={styles.pieChart}>
    <EChart ref={refPieChart} canvasId={canvasId} />
  </View>
}

export { PieChart }
