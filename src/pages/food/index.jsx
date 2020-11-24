import React, { useEffect, useState } from 'react'
import { View, ScrollView, Text } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtIcon, AtFloatLayout, AtRadio, AtActivityIndicator, AtSearchBar, AtDrawer, AtTag, AtButton } from 'taro-ui'
import styles from './index.module.scss'
import '../../custom.scss'
import { ListItem } from './listItem/listItem'
import { PanelTitle } from '../panel-title/index'
import { batch, useDispatch, useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { getFoodClass, getFoodList, getElementClass, getElement } from '../../utils/api'
import {
  getClassAction, getListAction, getElementClassAction, getElementAction, getMoreListAction,
  setTabDataAction, setCurrentAction, setFoodCodeAction
} from '../../actions/food'
import { alert } from '../../utils/util'

const _ = require("underscore");

const typeOptions = [
  { label: '全部', value: 'all' },
  { label: '收藏', value: 'collect' }
]

const Food = (props) => {
  const dispatch = useDispatch();
  const [isOpened, setIsOpened] = useState(false);
  const [checkedList, setCheckedList] = useState({
    "Edible": true,
    "Water": true,
    "Energy": true,
    "Protein": true,
    "Fat": true,
  });
  const [saveCheckedList, set_saveCheckedList] = useState({});
  const [radioVal, setRadioVal] = useState('all');
  const [upDragStyle] = useState({ height: 50 + 'px' });
  const [isShowMore, setIsShowMore] = useState(false);
  const [searchVal, set_searchVal] = useState('');
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [loadText, set_loadText] = useState('上拉加载更多');
  const [scrollHeight, setScrollHeight] = useState(0);

  const classList = useSelector(state => state.food.classList)
  const foodList = useSelector(state => state.food.foodList)
  const tabData = useSelector(state => state.food.tabData)
  const elementMap = useSelector(state => state.food.elementMap)
  const userId = useSelector(state => state.user.userId)
  const current = useSelector(state => state.food.current)

  const getListData = (current) => {
    const len = tabData[current]['data'].length;
    const code = classList[current].code;
    const ele = [];
    Object.keys(checkedList).map(key => {
      checkedList[key] && ele.push(key)
    })
    set_saveCheckedList(checkedList)
    let lastValue = ''
    if (tabData[current].condition !== null && len > 0) {
      if (isShowMore) {
        lastValue = tabData[current]['data'][len - 1].code
      } else {
        lastValue = tabData[current]['condition'].lastValue
      }
    }
    const param = {
      sortCol: 'code',
      direction: 1,
      lastValue: lastValue,
      classCode: code,
      searchWord: searchVal,
      elements: ele,
      userId: userId
    }
    const isEqual = _.isEqual(param, tabData[current].condition);
    let list = []

    batch(async () => {
      if (isEqual) {
        list = tabData[current].data;
      } else {
        list = await getFoodList(param);
        const tabParams = {
          condition: param,
          data: [...tabData[current].data, ...list]
        }
        list.map(item => {
          if (+item.isCollect === 1) {
            dispatch(setFoodCodeAction(item.code, true))
          }
        })
        dispatch(setTabDataAction(current, tabParams))
      }

      if (isShowMore) {
        dispatch(getMoreListAction(list));
      } else {
        dispatch(getListAction(list));
      }

      setIsShowMore(false);
      if (list.length === 0) {
        return set_loadText('没有更多了~')
      }
      return set_loadText('上拉加载更多')
    })
  }

  const handleClickTab = (current) => {
    dispatch(setCurrentAction(current))
    set_loadText('上拉加载更多')
    getListData(current);
  }

  const handleIsShowModal = (status) => {
    return () => setIsOpened(status)
  }

  const handleIsShowMenu = (status) => {
    return () => setIsShowMenu(status)
  }

  const handleChangeCheck = (item) => {
    return () => {
      if (checkedList[item.code]) {
        return setCheckedList({ ...checkedList, [item.code]: false })
      }
      const len = getTagsLength();
      if (len === 5) {
        return alert('最多选择5个标签~')
      }
      setCheckedList({ ...checkedList, [item.code]: true })
    }
  }
  
  const getTagsLength = () => {
    let len = 0;
    Object.keys(checkedList).map(key => {
      checkedList[key] && len++
    });
    return len;
  }

  const clickConfirm = () => {
    const len = getTagsLength();
    if (len === 0) {
      alert('至少选择1个标签~')
    }
    getListData(current);
    setIsOpened(false);
  }

  const clickReset = () => {
    setCheckedList(saveCheckedList)
  }

  const handleChangeRadioVal = (val) => {
    setRadioVal(val)
  }

  const onScrolltolower = (e) => {
    setIsShowMore(true)
  }

  const clickToDetail = (code) => {
    return () => {
      Taro.navigateTo({
        url: '../classifyDetail/index?code=' + code
      })
    }
  }

  const changeSearchVal = (val) => {
    set_searchVal(val)
  }

  const onActionClick = () => {
    console.log(searchVal)
    dispatch(setTabDataAction(current, { ...tabData[current], condition: null, data: [] }))
  }

  const load = () => {
    batch(async () => {
      if (isShowMore) {
        if (loadText === '没有更多了~') {
          return;
        }
        getListData(current)
        console.log('停止上拉加载更多~')
      }
    })
  }

  const clickQuickNav = (current) => {
    return () => {
      setIsShowMenu(false);
      dispatch(setCurrentAction(current))
      getListData(current);
    }
  }

  const getheaderH = () => {
    return new Promise(resolve => {
      const query = Taro.createSelectorQuery()
      query.select('.food-myTabs').boundingClientRect(rec => {
        resolve(rec)
      }).exec();
    })
  }

  const getTabH = () => {
    return new Promise(resolve => {
      const query = Taro.createSelectorQuery()
      query.select('.food-myTabs .at-tabs__header').boundingClientRect(rec => {
        resolve(rec)
      }).exec();
    })
  }

  useEffect(() => {
    load()
  }, [isShowMore])

  useEffect(async () => {
    setTimeout(async () => {
      const h1 = await getheaderH();
      const h2 = await getTabH();
      setScrollHeight(h1.height - h2.height)
    }, 100)
    Taro.showLoading({
      title: '加载中',
    })
    const [elementC, element, foodC] = await Promise.all([getElementClass(), getElement(), getFoodClass()])
    Taro.hideLoading()
    batch(() => {
      dispatch(getElementClassAction(elementC));
      dispatch(getElementAction(element));
      dispatch(getClassAction(foodC));
    })
  }, [])

  useEffect(() => {
    if (classList.length > 0) {
      getListData(current);
    }
  }, [classList]);

  useEffect(() => {
    if (tabData.length > 0 && tabData[current]['condition'] === null) {
      getListData(current);
    }
  }, [tabData]);

  return (
    <View className={styles.index}>
      <View className={`${styles.header} foodHeader`}>
        <AtSearchBar
          className={`${styles.search} food-search`}
          value={searchVal}
          onChange={changeSearchVal}
          onActionClick={onActionClick}
        />
        <View className={styles.filter} onClick={handleIsShowModal(true)}>
          <AtIcon value='filter' size='20' color='#9a9a9a'></AtIcon>
        </View>
      </View>

      <View className={`${styles.nav} menu`} onClick={handleIsShowMenu(true)}>
        <AtIcon value='menu' size='20' color='#9a9a9a'></AtIcon>
      </View>
      <AtTabs
        className='food-myTabs'
        current={current}
        scroll
        tabList={classList}
        onClick={handleClickTab}>
        {
          classList.map((item, index) => {
            return <AtTabsPane current={current} index={index}>
              <ScrollView
                scroll-y
                onScrolltolower={onScrolltolower}
                className={styles.scrollView}
                style={{ height: `${scrollHeight}px` }}
              >

                <View className={styles.tabs}>
                  {
                    current === index &&
                    foodList.map((item) => {
                      return <ListItem clickToDetail={clickToDetail(item.code)} data={item}></ListItem>
                    })
                  }

                </View>

                <View className={styles.upDragBox} style={upDragStyle}>
                  {
                    isShowMore && loadText === '上拉加载更多' ?
                      <AtActivityIndicator content='加载中...' mode='center'></AtActivityIndicator>
                      : <Text>{loadText}</Text>
                  }
                </View>

              </ScrollView>
            </AtTabsPane>
          })
        }
      </AtTabs>
      <AtFloatLayout className='food-filter' isOpened={isOpened} title="筛选列表" onClose={handleIsShowModal(false)}>
        <PanelTitle>类型</PanelTitle>
        <AtRadio
          options={typeOptions}
          value={radioVal}
          onClick={handleChangeRadioVal}
        />
        <PanelTitle>元素</PanelTitle>
        {
          elementMap.map(item => {
            return <AtTag type='primary' active={checkedList[item.code] ? true : false} onClick={handleChangeCheck(item)}>{item.name}</AtTag>
          })
        }
        <AtButton className={styles.confirm} type='primary' size='small' onClick={clickConfirm}>确定</AtButton>
        <AtButton className={styles.reset} size='small' onClick={clickReset}>重置</AtButton>
      </AtFloatLayout>
      <AtDrawer
        show={isShowMenu}
        width='77.35vw'
        right={true}
        mask
        onClose={handleIsShowMenu(false)}
      >
        <View className={styles.drawer}>
          <PanelTitle>导航</PanelTitle>
          <View className={styles.tagContainer}>
            {
              classList.map((item, index) => {
                return <View className={styles.tags} onClick={clickQuickNav(index)}>
                  <Text>{item.name}</Text>
                </View>
              })
            }
          </View>
        </View>
      </AtDrawer>
    </View>
  )
}

export default React.memo(Food);

