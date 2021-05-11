import React, { useEffect, useState } from 'react'
import { View, ScrollView, Text } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtIcon, AtFloatLayout, AtRadio, AtActivityIndicator, AtSearchBar, AtDrawer, AtTag, AtButton } from 'taro-ui'
import styles from './index.module.scss'
import '../../custom.scss'
import { ListItem } from './listItem/listItem'
import { PanelTitle } from '../../packageA/pages/panel-title/index'
import { batch, useDispatch, useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { getFoodClass, getFoodList, getElementClass, getElement } from '../../utils/api'
import {
  getClassAction, getListAction, getElementClassAction, getElementAction, getMoreListAction,
  setTabDataAction, setCurrentAction, setFoodCodeAction
} from '../../actions/food'
import { alert, getHeight } from '../../utils/util'
import { typeOptions, initialCheckedList } from './config'

const _ = require("underscore");

const Food = (props) => {
  const dispatch = useDispatch();
  const [isOpened, setIsOpened] = useState(false);
  const [checkedList, setCheckedList] = useState(initialCheckedList);
  const [saveCheckedList, set_saveCheckedList] = useState({});
  const [radioVal, setRadioVal] = useState('all');
  const [upDragStyle] = useState({ height: 50 + 'px' });
  const [isShowMore, setIsShowMore] = useState(false);
  const [searchVal, set_searchVal] = useState('');
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [loadText, set_loadText] = useState('上拉加载更多');
  const [scrollHeight, setScrollHeight] = useState(0);
  const [sortCode, set_sortCode] = useState('code');
  const [sortDirection, set_sortDirection] = useState(1);
  const [scrollTop, set_scrollTop] = useState(0);

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
      checkedList[key]['status'] && ele.push(key)
    })
    set_saveCheckedList(checkedList)
    const param = {
      sortCol: sortCode,
      direction: sortDirection,
      count: len,
      classCode: code,
      searchWord: searchVal,
      elements: ele,
      userId: userId,
      collect: radioVal === 'all' ? 0 : 1
    }
    const isEqual = _.isEqual(param, { ...tabData[current].condition, count: len });
    let list = []

    batch(async () => {
      if (isEqual && !isShowMore) {
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
        set_scrollTop(Math.random())
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
      if (checkedList[item.code] && checkedList[item.code]['status']) {
        if (sortCode === item.code) {
          set_sortCode('code')
        }
        return setCheckedList({ ...checkedList, [item.code]: { ...checkedList[item.code], status: false } })
      }
      const len = getTagsLength();
      if (len === 5) {
        return alert('最多选择5个标签~')
      }
      return setCheckedList({ ...checkedList, [item.code]: { ...checkedList[item.code], status: true, name: item.name } })
    }
  }

  const getTagsLength = () => {
    let len = 0;
    Object.keys(checkedList).map(key => {
      checkedList[key]['status'] && len++
    });
    return len;
  }

  const clickConfirm = () => {
    const len = getTagsLength();
    if (len === 0) {
      alert('至少选择1个元素标签~')
      return;
    }
    const code = classList[current].code;
    const ele = [];
    Object.keys(checkedList).map(key => {
      checkedList[key]['status'] && ele.push(key)
    })
    const param = {
      sortCol: sortCode,
      direction: sortDirection,
      count: tabData[current].condition.count,
      classCode: code,
      searchWord: searchVal,
      elements: ele,
      userId: userId
    }
    const isEqual = _.isEqual(param, tabData[current].condition);

    if (!isEqual) {
      dispatch(setTabDataAction(current, { ...tabData[current], condition: null, data: [] }))
    }
    setIsOpened(false);
  }

  const clickReset = () => {
    setCheckedList(saveCheckedList)
    set_sortCode('code')
    set_sortDirection(1)
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

  useEffect(() => {
    load()
  }, [isShowMore])

  useEffect(async () => {
    setTimeout(async () => {
      const h1 = await getHeight('.food-myTabs');
      const h2 = await getHeight('.food-myTabs .at-tabs__header');
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
                scrollTop={scrollTop}
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
        <PanelTitle>数据类型</PanelTitle>
        <AtRadio
          options={typeOptions}
          value={radioVal}
          onClick={handleChangeRadioVal}
        />
        <PanelTitle>展示元素</PanelTitle>
        {
          elementMap.map(item => {
            return <AtTag type='primary' active={checkedList[item.code] && checkedList[item.code]['status'] ? true : false}
              onClick={handleChangeCheck(item)}>{item.name}</AtTag>
          })
        }
        <PanelTitle>排序类型</PanelTitle>
        <AtTag type='primary' active={sortDirection === 1 ? true : false} onClick={() => set_sortDirection(1)}>升序</AtTag>
        <AtTag type='primary' active={sortDirection === -1 ? true : false} onClick={() => set_sortDirection(-1)}>倒序</AtTag>
        <PanelTitle>排序字段</PanelTitle>
        <AtTag type='primary' active={sortCode === 'code' || !checkedList[sortCode]['status'] ? true : false} onClick={() => set_sortCode('code')}>默认</AtTag>
        {
          Object.keys(checkedList).map(key => {
            if (checkedList[key]['status']) {
              return <AtTag type='primary' active={sortCode === key ? true : false} onClick={() => set_sortCode(key)}>{checkedList[key]['name']}</AtTag>
            }
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

