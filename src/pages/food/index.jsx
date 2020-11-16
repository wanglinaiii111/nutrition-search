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
import { getClassAction, getListAction, getElementClassAction, getElementAction, getMoreListAction } from '../../actions/food'

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
  const dispatch = useDispatch();
  const [tabList, set_tabList] = useState(data);
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

  const handleClickTab = async (current) => {
    dispatch(getListAction([]));
    setCurrent(current)
    const cur = classList[current]
    const param = {
      sortCol: 'code',
      direction: 1,
      lastValue: '',
      classCode: cur.code,
      searchWord: '',
      elements: ["Edible", "Water"]
    }
    const list = await getFoodList(param);
    dispatch(getListAction(list));
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

  const refresherRefresh = async () => {
    console.log('下拉刷新被触发')
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

  const clickToDetail = () => {
    Taro.navigateTo({
      url: '../classifyDetail/index'
    })
  }

  const changeSearchVal = (val) => {
    set_searchVal(val)
  }

  const onActionClick = () => {
    console.log(searchVal)
  }

  const load = () => {
    batch(async () => {
      if (isShowMore) {
        if (loadText === '没有更多了~') {
          return;
        }
        const len = foodList.length;
        const cur = classList[current]
        const param = {
          sortCol: 'code',
          direction: 1,
          lastValue: foodList[len - 1].code,
          classCode: cur.code,
          searchWord: '',
          elements: ["Edible", "Water"]
        }
        const list = await getFoodList(param);
        dispatch(getMoreListAction(list));

        console.log('停止上拉加载更多~')
        setIsShowMore(false);
        if (list.length === 0) {
          return set_loadText('没有更多了~')
        }
        return set_loadText('上拉加载更多')
      }
    })
  }

  useEffect(async () => {
    const systemInfo = await getSystemInfo()
    setScrollHeight(systemInfo.windowHeight - 35)
    const [elementC, element, foodC] = await Promise.all([getElementClass(), getElement(), getFoodClass()])
    console.log(elementC, element, foodC, '+++++')
    const param = {
      sortCol: 'code',
      direction: 1,
      lastValue: '',
      classCode: 1,
      searchWord: '',
      elements: ["Edible", "Water"]
    }
    const list = await getFoodList(param)
    const foodinfo = await getFoodInfo({
      code: 259
    })
    console.log(foodinfo, 'foodinfo')
    batch(() => {
      dispatch(getElementClassAction(elementC));
      dispatch(getElementAction(element));
      dispatch(getClassAction(foodC));
      dispatch(getListAction(list));
    })
  }, [])

  // useEffect(() => {
  //   load()
  // }, [isShowMore])

  return (
    <View className={styles.index}>
      <View className={styles.header}>
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

      <View className={styles.nav} onClick={handleIsShowMenu(true)}>
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
                style={{ height: `${scrollHeight}px` }}
                refresherEnabled
                refresherTriggered={item.isFresh}
                onRefresherRefresh={refresherRefresh}
                enableBackToTop
                onTouchMove={touchmove}
                onTouchStart={touchStart}
                onTouchEnd={touchEnd}
              >
                <View className={styles.tabs}>
                  {current === index &&
                    foodList.map((item) => {
                      return <ListItem clickToDetail={clickToDetail} data={item}></ListItem>
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
            </AtTabsPane>
          })
        }
        {/* {
          tabList.map((item, index) => {
            return <AtTabsPane current={current} index={index}>
              <ScrollView
                scroll-y
                style={{ height: `${scrollHeight}px` }}
                refresherEnabled
                refresherTriggered={item.isFresh}
                onRefresherRefresh={refresherRefresh}
                enableBackToTop
                onTouchMove={touchmove}
                onTouchStart={touchStart}
              >
                <View className={styles.tabs}>
                  {
                    item.list.map((listItem) => {
                      return <ListItem clickToDetail={clickToDetail} data={listItem}></ListItem>
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
        } */}
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
            <View className={styles.tags}>
              <Text>薯类、淀粉及制品</Text>
            </View>
            <View className={styles.tags}>
              <Text>干豆类及制品</Text>
            </View>
            <View className={styles.tags}>
              <Text>菌藻类</Text>
            </View>
            <View className={styles.tags}>
              <Text>蔬菜类及制品</Text>
            </View>
          </View>
        </View>
      </AtDrawer>
    </View>
  )
}

export default React.memo(Food);

