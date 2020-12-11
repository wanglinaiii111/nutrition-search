import {
  combineReducers
} from 'redux'
import food from './food'
import user from './user'
import tool from './tool'

export default combineReducers({
  food,
  user,
  tool
})
