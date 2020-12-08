import React, { useEffect, useState } from 'react'
import { View, ScrollView, Text } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtList, AtListItem, AtFab, AtDrawer, AtIcon } from 'taro-ui'
import { useSelector } from 'react-redux'
import styles from './index.module.scss'
import { getHeight } from '../../../utils/util'
import { PanelTitle } from '../panel-title/index'

const FilterElement = (props) => {
  const { handleClickaddEle, selectedElement, handleDeleteEle } = props;
  const [current, set_current] = useState(0)
  const [scrollHeight, setScrollHeight] = useState(0);
  const [showElementModal, set_showElementModal] = useState(false)
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
    <AtFab className={styles.fabBtn} onClick={() => set_showElementModal(true)}>
      <Text>已选</Text>
    </AtFab>
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
                      return <AtListItem className={selectedElement[listItem.code] && styles.listItemActive} title={listItem.name}
                        onClick={handleClickaddEle(listItem)} arrow={selectedElement[listItem.code] && 'right'} />
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
    <AtDrawer
      show={showElementModal}
      onClose={() => set_showElementModal(false)}
      mask
      right
    >
      <View className={styles.drawer}>
        <PanelTitle>元素列表</PanelTitle>
        {
          Object.keys(selectedElement).map(key => {
            return <View className={styles.drawerItem}>
              <View className={styles.content}>{selectedElement[key].name}</View>
              <AtIcon value='close' size='15' color='#e00f0f' onClick={() => handleDeleteEle(key)} />
            </View>
          })
        }
      </View>
    </AtDrawer>
  </View>
}

export default React.memo(FilterElement);