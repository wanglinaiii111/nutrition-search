import React, { useEffect, useState } from 'react'
import { View, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtTag, AtIcon, AtModal, AtModalContent, AtModalAction } from 'taro-ui'
import styles from './index.module.scss'
import { getCompareRecode, deleteCompareRecode } from '../../../utils/api'
import { batch, useDispatch, useSelector } from 'react-redux'
import { setHistoryListAction, setListOpenAction, deleteListItemAction } from '../../../actions/tool'
import { setSelectedFoodAction, deleteSelectedFoodAction, setSelectedEleAction, deleteSelectedEleAction, } from '../../../actions/food'
import { PanelTitle } from '../panel-title/index'
import { alert, dateFormat } from '../../../utils/util'

const History = () => {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.user.userId)
  const historyList = useSelector(state => state.tool.historyList)
  const [isOpened, set_isOpened] = useState(false)
  const [deleteItem, set_deleteItem] = useState({})
  const selectedFood = useSelector(state => state.food.selectedFood)
  const selectedElement = useSelector(state => state.food.selectedElement)

  const handleClick = (index) => {
    return () => {
      dispatch(setListOpenAction(index))
    }
  }

  const handleToDetail = (item) => {
    return () => {
      Taro.navigateBack({
        success: () => {
          batch(() => {
            Object.keys(selectedFood).map(code => {
              dispatch(deleteSelectedFoodAction(code))
            })
            Object.keys(selectedElement).map(code => {
              dispatch(deleteSelectedEleAction(code))
            })
            Object.keys(item.food).map(key => {
              dispatch(setSelectedFoodAction(item.food[key]))
            })
            Object.keys(item.element).map(key => {
              dispatch(setSelectedEleAction(item.element[key]))
            })
          })
        }
      })
    }
  }

  const handleDelete = (item) => {
    set_isOpened(true)
    set_deleteItem(item)
  }

  const handleConfirm = () => {
    deleteCompareRecode({
      _id: deleteItem._id
    }).then(() => {
      alert('删除成功~')
      set_isOpened(false)
      dispatch(deleteListItemAction(deleteItem._id))
    }).catch(() => {
      alert('删除失败，请重试~')
    })
  }

  useEffect(() => {
    (async () => {
      const data = await getCompareRecode({ userId });
      dispatch(setHistoryListAction(data))
    })()
  }, [])

  return <View className='history'>
    {
      historyList.map((item, index) => {
        return <>
          <View className={styles.header}>
            <View className={styles.info} onClick={handleToDetail(item)}>
              <View className={styles.info_title}>{item.name}</View>
              <View className={styles.info_note}>{dateFormat(item.saveTime)}</View>
            </View>
            <AtIcon className={styles.close} value='close' size='17' color='#e00f0f' onClick={() => handleDelete(item)} />
            <View className={`${styles.arrow} at-icon ${item.open ? 'at-icon-chevron-up' : 'at-icon-chevron-down'}`} onClick={handleClick(index)}></View>
          </View>
          {
            item.open && <View className={styles.container}>
              <PanelTitle>食材</PanelTitle>
              {Object.keys(item.food).map(f => {
                return <AtTag className={styles.tag}>
                  {
                    item.food[f].name
                  }
                </AtTag>
              })}
              <PanelTitle>元素</PanelTitle>
              {Object.keys(item.element).map(e => {
                return <AtTag className={styles.tag}>
                  {
                    item.element[e].name
                  }
                </AtTag>
              })}
            </View>
          }
        </>
      })
    }
    <AtModal isOpened={isOpened} onClose={() => set_isOpened(false)}>
      <AtModalContent>
        <View className={styles.modal}>确定要删除该条记录么？</View>
      </AtModalContent>
      <AtModalAction>
        <Button onClick={() => set_isOpened(false)}>取消</Button>
        <Button onClick={handleConfirm}>确定</Button> </AtModalAction>
    </AtModal>

  </View>
}

export default React.memo(History)