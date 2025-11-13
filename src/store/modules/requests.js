export default {
  namespaced: true,
  
  state: {
    requests: [],
    loading: false
  },
  
  getters: {
    allRequests: state => state.requests,
    isLoading: state => state.loading
  },
  
  mutations: {
    SET_REQUESTS(state, requests) {
      state.requests = requests
    },
    
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    
    ADD_REQUEST(state, request) {
      state.requests.unshift(request)
    }
  },
  
  actions: {
    async fetchRequests({ commit, rootState }) {
      commit('SET_LOADING', true)
      try {
        const token = rootState.auth.token
        const response = await fetch('/api/requests', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) throw new Error('Failed to fetch requests')
        
        const data = await response.json()
        commit('SET_REQUESTS', data)
      } catch (error) {
        console.error('Error fetching requests:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async createRequest({ commit, rootState }, requestData) {
      try {
        const token = rootState.auth.token
        const response = await fetch('/api/requests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(requestData)
        })
        
        if (!response.ok) throw new Error('Failed to create request')
        
        const data = await response.json()
        commit('ADD_REQUEST', data)
        return data
      } catch (error) {
        console.error('Error creating request:', error)
        throw error
      }
    }
  }
}



