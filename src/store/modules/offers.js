export default {
  namespaced: true,
  
  state: {
    offers: [],
    loading: false
  },
  
  getters: {
    allOffers: state => state.offers,
    isLoading: state => state.loading
  },
  
  mutations: {
    SET_OFFERS(state, offers) {
      state.offers = offers
    },
    
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    
    ADD_OFFER(state, offer) {
      state.offers.unshift(offer)
    }
  },
  
  actions: {
    async fetchOffers({ commit, rootState }) {
      commit('SET_LOADING', true)
      try {
        const token = rootState.auth.token
        const response = await fetch('/api/offers', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) throw new Error('Failed to fetch offers')
        
        const data = await response.json()
        commit('SET_OFFERS', data)
      } catch (error) {
        console.error('Error fetching offers:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async createOffer({ commit, rootState }, offerData) {
      try {
        const token = rootState.auth.token
        const response = await fetch('/api/offers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(offerData)
        })
        
        if (!response.ok) throw new Error('Failed to create offer')
        
        const data = await response.json()
        commit('ADD_OFFER', data)
        return data
      } catch (error) {
        console.error('Error creating offer:', error)
        throw error
      }
    }
  }
}



