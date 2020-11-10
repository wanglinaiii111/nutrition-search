import React, { useEffect, useState } from 'react'
import { View, ScrollView, Text } from '@tarojs/components'
import { getSystemInfo } from '../../utils/sdk'
import { AtTabs, AtTabsPane, AtIcon, AtFloatLayout, AtCheckbox, AtRadio, AtActivityIndicator } from 'taro-ui'
import styles from './index.module.scss'
import '../../custom.scss'
import { ListItem } from './listItem/listItem'
import { PanelTitle } from '../panel-title/index'
import Taro from '@tarojs/taro'

const data = [
  {
    title: '蔬菜',
    isFresh: true,
    list: [{ name: '菠菜菠菜菠菜菠菜菠菜菠菜菠菜菠菜菠', content: { '钠': '20g', '镁': '20mg', '铁': '20KJ', '钠1': '20%' } },
    { name: '菜花', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克', '钠1': '20%' } },
    { name: '菜花', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克', '钠1': '20%' } },
    { name: '菜花', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克', '钠1': '20%' } },
    { name: '菜花', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克', '钠1': '20%' } }]
  },
  {
    title: '水果',
    isFresh: true,
    list: [{ name: '苹果', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克' } }]
  },
  { title: '豆制品', isFresh: true, list: [{ name: '豆浆', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克' } }] },
  { title: '肉类', isFresh: true, list: [{ name: '牛肉', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克' } }] },
  { title: '油盐酱醋', isFresh: true, list: [{ name: '盐', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克' } }] },
  { title: '粮油', isFresh: true, list: [{ name: '小麦', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克' } }] }
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
  const [tabList, set_tabList] = useState(data);
  const [current, setCurrent] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [isOpened, setIsOpened] = useState(false);
  const [checkedList, setCheckedList] = useState([]);
  const [radioVal, setRadioVal] = useState('all');
  const [upDragStyle, setUpDragStyle] = useState({ height: 50 + 'px' })
  const [isShowMore, setIsShowMore] = useState(false)
  const [totalPage, set_totalPage] = useState(2)

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

  const scrollToUpper = () => {
    console.log('滚动到顶部')
  }

  const scrollToLower = () => {
    if (totalPage > 1) {
      setIsShowMore(true)
      console.log('scrollToLower-滚动到底部事件-上拉加载更多')

      setTimeout(() => {
        console.log('停止上拉加载更多~')
        setIsShowMore(false)
      }, 2000);
    }
  }

  const refresherRefresh = () => {
    setIsShowMore(false)
    changeListStatus(true)
    console.log('下拉刷新被触发')

    setTimeout(() => {
      console.log('停止下拉刷新~')
      changeListStatus(false)
    }, 2000);
  }

  const changeListStatus = (status) => {
    const data = tabList.map((item, index) => {
      if (index === current) {
        return { ...item, isFresh: status }
      }
      return item;
    })
    set_tabList(data);
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
              <ScrollView
                scroll-y
                style={{ height: `${scrollHeight}px` }}
                refresherEnabled
                refresherTriggered={item.isFresh}
                onRefresherRefresh={refresherRefresh}
                enableBackToTop
                onScrollToUpper={scrollToUpper}
                onScrollToLower={scrollToLower}
              >
                <View className={styles.tabs}>
                  {
                    item.list.map((listItem) => {
                      return <ListItem data={listItem}></ListItem>
                    })
                  }
                </View>

                <View className={styles.upDragBox} style={upDragStyle}>
                  {
                    isShowMore ?
                      <AtActivityIndicator content='加载中...' mode='center'></AtActivityIndicator>
                      : totalPage > 1 && <Text>上拉加载更多</Text>
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

