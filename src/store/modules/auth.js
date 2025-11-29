export default {
  namespaced: true,
  
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null
  },
  
  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user,
    userRole: state => state.user?.role || null
  },
  
  mutations: {
    SET_USER(state, user) {
      state.user = user
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        localStorage.removeItem('user')
      }
    },
    
    SET_TOKEN(state, token) {
      state.token = token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    }
  },
  
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        })
        
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Ошибка входа')
        }
        
        commit('SET_USER', data.user)
        commit('SET_TOKEN', data.token)
        return data
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },
    
    async register({ commit }, userData) {
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        })
        
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Ошибка регистрации')
        }
        
        commit('SET_USER', data.user)
        commit('SET_TOKEN', data.token)
        return data
      } catch (error) {
        console.error('Registration error:', error)
        throw error
      }
    },
    
    logout({ commit }) {
      commit('SET_USER', null)
      commit('SET_TOKEN', null)
    }
  }
}

