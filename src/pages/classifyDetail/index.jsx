import React from 'react';
import { View,Text } from '@tarojs/components'
import styles from './index.module.scss'
import { AtCard, AtList, AtListItem } from 'taro-ui'
import { PanelTitle } from '../panel-title/index'

const Detail = (props) => {

  const handleClickBack = () => {
    console.log('back')
  }
  return <View>
    <Text className={styles.title}>营养成分（每100克）</Text>
    <AtCard
      extra='谷类及制品'
      title='小麦粉(标准粉)'
      thumb='http://www.logoquan.com/upload/list/20180421/logoquan15259400209.PNG'
    >
      <PanelTitle>能量与相关成分</PanelTitle>
      <AtList>
        <AtListItem title='水分(Water)' extraText='12.7g' />
        <AtListItem title='能量(Energy)' extraText='1497KJ' />
        <AtListItem title='蛋白质(Protein)' extraText='11.2g' />
      </AtList>
      <PanelTitle>维生素</PanelTitle>
      <AtList>
        <AtListItem title='硫胺素(Thiamin)' extraText='12.7g' />
        <AtListItem title='核黄素(Riboflavin)' extraText='1497KJ' />
        <AtListItem title='烟酸(Niacin)' extraText='11.2g' />
      </AtList>
    </AtCard>
  </View>
}

export default React.memo(Detail)