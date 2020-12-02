import React, { useEffect, useState } from 'react'
import { View, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtList, AtListItem, AtSearchBar } from 'taro-ui'
import { useDispatch, useSelector } from 'react-redux'
import styles from './index.module.scss'
import { getHeight } from '../../utils/util'

const checkedList = {};

const FilterElement = (props) => {
  const { handleClickadd } = props;
  const dispatch = useDispatch()
  const [current, set_current] = useState(0)
  const [scrollHeight, setScrollHeight] = useState(0);
  const elementMap = useSelector(state => state.food.elementMap)
  const elementClassMap = useSelector(state => state.food.elementClassMap)

  const handleClick = async (index) => {
    set_current(index)
  }

  useEffect(() => {
    (async () => {
      setTimeout(async () => {
        const h1 = await getHeight('.filterContainer');
        setScrollHeight(h1.height)
      }, 100)
    })()
  }, [])

  return <View className='filterFood'>
    <AtTabs
      current={current}
      scroll
      height={`${scrollHeight}px`}
      tabDirection='vertical'
      tabList={elementClassMap}
      onClick={handleClick}>
      {
        elementClassMap.map((item, index) => {
          return <AtTabsPane tabDirection='vertical' current={current} index={index}>
            <ScrollView
              scroll-y
              style={{ height: `${scrollHeight}px` }}
            >
              <AtList hasBorder={false}>
                {
                  index === current && elementMap.map((listItem, listIndex) => {
                    if (listItem.class === item.code) {
                      return <AtListItem className={checkedList[listItem.code] && styles.listItemActive} title={listItem.name}
                        onClick={handleClickadd(listItem)} arrow={checkedList[listItem.code] && 'right'} />
                    }
                    return null;
                  })
                }
              </AtList>
            </ScrollView>
          </AtTabsPane>
        })
      }
    </AtTabs>
  </View>
}

export default React.memo(FilterElement);