import {
  combineReducers
} from 'redux'
import food from './food'
import user from './user'

export default combineReducers({
  food,
  user
})
