export const getters = {
  loggedInUser(state) {
    return state.user
  }
}

export const actions = {
  async register(context, userDetails) {
    const response = await this.$axios.$post('/auth/register/', userDetails)
    return response
  }
}

export const state = () => ({
  busy: false,
  loggedIn: false,
  strategy: `local`,
  user: false
})
