import {
  HISTOTY_LIST,
  LIST_OPEN,
  DETELE_LIST_ITEM
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

export const deleteListItemAction = (_id) => {
  return {
    type: DETELE_LIST_ITEM,
    _id
  }
}
