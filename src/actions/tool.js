import {
  batch
} from 'react-redux';
import {
  HISTOTY_LIST,
  LIST_OPEN
} from '../constants'

export const setHistoryListAction = (data) => {
  const res = data.map(item => {
    return {
      ...item,
      open: false
    }
  })
  return {
    type: HISTOTY_LIST,
    data: res
  }
}

export const setListOpenAction = (index) => {
  return {
    type: LIST_OPEN,
    index
  }
}
