import React, { useEffect, useState } from 'react'
import { View, ScrollView } from '@tarojs/components'
import { getSystemInfo } from '../../utils/sdk'
import { AtTabs, AtTabsPane, AtIcon, AtFloatLayout, AtCheckbox, AtRadio } from 'taro-ui'
import styles from './index.module.scss'
import '../../custom.scss'
import { ListItem } from './listItem/listItem'
import { PanelTitle } from '../panel-title/index'

const tabList = [
  {
    title: '蔬菜',
    list: [{ name: '菠菜菠菜菠菜菠菜菠菜菠菜菠菜菠菜菠', content: { '钠': '20g', '镁': '20mg', '铁': '20KJ', '钠1': '20%' } },
    { name: '菜花', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克', '钠1': '20%' } },
    { name: '菜花', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克', '钠1': '20%' } },
    { name: '菜花', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克', '钠1': '20%' } },
    { name: '菜花', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克', '钠1': '20%' } }]
  },
  {
    title: '水果',
    list: [{ name: '苹果', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克' } }]
  },
  { title: '豆制品', list: [{ name: '豆浆', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克' } }] },
  { title: '肉类', list: [{ name: '牛肉', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克' } }] },
  { title: '油盐酱醋', list: [{ name: '盐', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克' } }] },
  { title: '粮油', list: [{ name: '小麦', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克' } }] }
]

const checkboxOption = [{
  value: 'list1',
  label: 'iPhone X',
}, {
  value: 'list2',
  label: 'HUAWEI P20'
}, {
  value: 'list3',
  label: 'OPPO Find X',
}, {
  value: 'list4',
  label: 'vivo NEX',
}]
const typeOptions = [
  { label: '全部', value: 'all' },
  { label: '收藏', value: 'collect' }
]


const Food = (props) => {
  const [current, setCurrent] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [isOpened, setIsOpened] = useState(false);
  const [checkedList, setCheckedList] = useState([]);
  const [radioVal, setRadioVal] = useState('all');

  const handleClick = (current) => {
    setCurrent(current)
  }

  const handleIsShowModal = (status) => {
    return () => setIsOpened(status)
  }

  const handleChangeCheckBox = (val) => {
    setCheckedList(val)
  }
  const handleChangeRadioVal = (val) => {
    setRadioVal(val)
  }

  useEffect(async () => {
    const systemInfo = await getSystemInfo()
    setScrollHeight(systemInfo.windowHeight - 35)
  }, [])

  return (
    <View className={styles.index}>
      <View className={styles.filter} onClick={handleIsShowModal(true)}>
        <AtIcon value='filter' size='20' color='#9a9a9a'></AtIcon>
      </View>
      <AtTabs
        className='food-myTabs'
        current={current}
        scroll
        tabList={tabList}
        onClick={handleClick}>
        {
          tabList.map((item, index) => {
            return <AtTabsPane current={current} index={index}>
              <ScrollView scroll-y style={{ height: `${scrollHeight}px` }}>
                <View className={styles.tabs}>
                  {
                    item.list.map((listItem) => {
                      return <ListItem data={listItem}></ListItem>
                    })
                  }
                </View>
              </ScrollView>
            </AtTabsPane>
          })
        }
      </AtTabs>
      <AtFloatLayout isOpened={isOpened} title="筛选列表" onClose={handleIsShowModal(false)}>
        <PanelTitle>类型</PanelTitle>
        <AtRadio
          options={typeOptions}
          value={radioVal}
          onClick={handleChangeRadioVal}
        />
        <PanelTitle>元素</PanelTitle>
        <AtCheckbox
          options={checkboxOption}
          selectedList={checkedList}
          onChange={handleChangeCheckBox}
        />
      </AtFloatLayout>
    </View>
  )
}

export default React.memo(Food);

