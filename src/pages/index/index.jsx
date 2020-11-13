import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Image, Swiper, SwiperItem } from '@tarojs/components'
import styles from './index.module.scss'
// const _ = require("underscore");

const Index = (props) => {
  const dispatch = useDispatch();

  return (
    <View className={styles.index}>
      <Swiper
        className='test-h'
        indicatorColor='#999'
        indicatorActiveColor='#333'
        vertical={false}
        circular
        indicatorDots
        autoplay>
        <SwiperItem>
          <View className='demo-text-1'>
            <Image className="sliderImage"
              src='https://img14.360buyimg.com/babel/s700x360_jfs/t1/4099/12/2578/101668/5b971b4bE65ae279d/89dd1764797acfd9.jpg!q90!cc_350x180'></Image>
          </View>
        </SwiperItem>
        <SwiperItem>
          <View className='demo-text-2'>
            <Image className="sliderImage"
              src='https://img10.360buyimg.com/babel/s700x360_jfs/t25855/203/725883724/96703/5a598a0f/5b7a22e1Nfd6ba344.jpg!q90!cc_350x180'></Image></View>
        </SwiperItem>
        <SwiperItem>
          <View className='demo-text-3'>
            <Image className="sliderImage"
              src='https://img11.360buyimg.com/babel/s700x360_jfs/t1/4776/39/2280/143162/5b9642a5E83bcda10/d93064343eb12276.jpg!q90!cc_350x180'></Image></View>
        </SwiperItem>
      </Swiper>
    </View>
  )
}


export default React.memo(Index);

