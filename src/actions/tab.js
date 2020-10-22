import {
  SET_PAGE
} from '../constants'

export const setPage = (page) => {
  return {
    type: SET_PAGE,
    page
  }
}
