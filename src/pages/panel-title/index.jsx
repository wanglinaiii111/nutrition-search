import React from 'react';
import { View } from '@tarojs/components'
import styles from './index.module.scss'

const PanelTitle = (props) => {
  return <View className={styles.title}>{props.children}</View>
}

export { PanelTitle }