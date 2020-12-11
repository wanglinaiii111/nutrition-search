import React, { useEffect } from 'react'
import { View } from '@tarojs/components'
import { AtAccordion, AtList, AtListItem } from 'taro-ui'
import styles from './index.module.scss'
import { getCompareRecode } from '../../../utils/api'
import { useDispatch, useSelector } from 'react-redux'
import { setHistoryListAction, setListOpenAction } from '../../../actions/tool'

const History = () => {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.user.userId)
  const historyList = useSelector(state => state.tool.historyList)

  const handleClick = (index) => {
    return () => {
      dispatch(setListOpenAction(index))
    }
  }

  useEffect(() => {
    (async () => {
      const data = await getCompareRecode({ userId });
      dispatch(setHistoryListAction(data))
    })()
  }, [])

  return <View>
    {
      historyList.map((item, index) => {
        return <AtAccordion
          open={item.open}
          onClick={handleClick(index)}
          title='标题一'
        >
          <AtList hasBorder={false}>
            <AtListItem
              title='标题文字'
              arrow='right'
            />
          </AtList>
        </AtAccordion>
      })
    }
  </View>
}

export default React.memo(History)