import React, { useEffect, useState } from 'react'
import { View, ScrollView, Text } from '@tarojs/components'
import { getSystemInfo } from '../../utils/sdk'
import { AtTabs, AtTabsPane, AtIcon, AtFloatLayout, AtCheckbox, AtRadio, AtActivityIndicator, AtSearchBar, AtDrawer, AtTag } from 'taro-ui'
import styles from './index.module.scss'
import '../../custom.scss'
import { ListItem } from './listItem/listItem'
import { PanelTitle } from '../panel-title/index'
import { batch, useDispatch, useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { getFoodClass, getFoodList, getElementClass, getElement, getFoodInfo } from '../../utils/api'
import { getClassAction, getListAction, getElementClassAction, getElementAction, getMoreListAction, setTabDataAction } from '../../actions/food'

const _ = require("underscore");

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
  const dispatch = useDispatch();
  const [current, setCurrent] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [isOpened, setIsOpened] = useState(false);
  const [checkedList, setCheckedList] = useState([]);
  const [radioVal, setRadioVal] = useState('all');
  const [upDragStyle, setUpDragStyle] = useState({ height: 50 + 'px' });
  const [isShowMore, setIsShowMore] = useState(false);
  const [start_posi, set_start_posi] = useState({});
  const [searchVal, set_searchVal] = useState('');
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [loadText, set_loadText] = useState('上拉加载更多');

  const classList = useSelector(state => state.food.classList)
  const foodList = useSelector(state => state.food.foodList)
  const tabData = useSelector(state => state.food.tabData)

  const getListData = (current) => {
    console.log(tabData, current, tabData[current])
    const len = tabData[current]['data'].length;
    const code = classList[current].code;
    let lastValue = ''
    if (tabData[current].condition !== null && len > 0) {
      console.log(tabData[current], tabData[current]['data'])
      lastValue = tabData[current]['data'][len - 1].code
    }
    const param = {
      sortCol: 'code',
      direction: 1,
      lastValue: lastValue,
      classCode: code,
      searchWord: searchVal,
      elements: ["Edible", "Water"]
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
    setCurrent(current)
    set_loadText('上拉加载更多')
    getListData(current);
  }

  const handleIsShowModal = (status) => {
    return () => setIsOpened(status)
  }

  const handleIsShowMenu = (status) => {
    return () => setIsShowMenu(status)
  }

  const handleChangeCheckBox = (val) => {
    setCheckedList(val)
  }
  const handleChangeRadioVal = (val) => {
    setRadioVal(val)
  }

  const touchStart = (e) => {
    set_start_posi(e.touches[0])
  }

  const touchmove = (e) => {
    if (loadText === '没有更多了~') {
      return;
    }
    let move_posi = e.touches[0],
      deviationX = 0.30, //左右偏移量(超过这个偏移量不执行下拉操作)
      maxY = 50; //拉动的最大高度

    let start_x = start_posi.clientX,
      start_y = start_posi.clientY,
      move_x = move_posi.clientX,
      move_y = move_posi.clientY;

    //得到偏移数值
    let dev = Math.abs(move_x - start_x) / Math.abs(move_y - start_y);
    if (dev < deviationX) {//当偏移数值大于设置的偏移数值时则不执行操作
      let pY = Math.abs(move_y - start_y) / 3.5;//拖动倍率（使拖动的时候有粘滞的感觉--试了很多次 这个倍率刚好）

      if (start_y - move_y > 0) {//上拉操作
        if (pY >= maxY) {
          pY = maxY
        }
        batch(() => {
          if (!isShowMore) {
            setIsShowMore(true)
            setUpDragStyle({
              height: pY < 30 ? 50 : pY + 'px'
            })
          }
        })
      }
    }
  }

  const touchEnd = () => {
    if (isShowMore) {
      load()
    }
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
      setCurrent(current);
      getListData(current);
    }
  }

  const getSearchH = () => {
    return new Promise(resolve => {
      const query = Taro.createSelectorQuery()
      query.select('.foodHeader').boundingClientRect(rec => {
        resolve(rec)
      }).exec();
    })
  }
  const getTabH = () => {
    return new Promise(resolve => {
      const query = Taro.createSelectorQuery()
      query.select('.menu').boundingClientRect(rec => {
        resolve(rec)

      }).exec();
    })
  }
  useEffect(async () => {
    const systemInfo = await getSystemInfo()
    setTimeout(async () => {
      const h1 = await getSearchH();
      const h2 = await getTabH();
      console.log(h1, h2, 'h1')
      setScrollHeight(systemInfo.windowHeight - h1.height - h2.height)
    }, 100)

    const [elementC, element, foodC] = await Promise.all([getElementClass(), getElement(), getFoodClass()])

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
              <View style={{ height: `${scrollHeight}px` }}>
                <ScrollView
                  scroll-y
                  style={{ height: `${scrollHeight}px` }}
                  onTouchMove={touchmove}
                  onTouchStart={touchStart}
                  onTouchEnd={touchEnd}
                >

                  <View className={styles.tabs}>
                    {
                      current === index &&
                      foodList.map((item) => {
                        return <ListItem clickToDetail={clickToDetail(item.code)} data={item} current={current}></ListItem>
                      })
                    }

                  </View>

                  <View className={styles.upDragBox} style={upDragStyle}>
                    {
                      isShowMore ?
                        <AtActivityIndicator content='加载中...' mode='center'></AtActivityIndicator>
                        : <Text>{loadText}</Text>
                    }
                  </View>

                </ScrollView>
              </View>
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
      <AtDrawer
        show={isShowMenu}
        width='250px'
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

