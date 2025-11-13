import { createStore } from 'vuex'
import auth from './modules/auth'
import requests from './modules/requests'
import offers from './modules/offers'

export default createStore({
  modules: {
    auth,
    requests,
    offers
  }
})



