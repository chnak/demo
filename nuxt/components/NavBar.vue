<template>
  <b-navbar type="dark" variant="dark">
    <b-navbar-brand to="/">DEMO</b-navbar-brand>
  </b-navbar>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'NavBar',
  computed: {
    ...mapState('auth', ['loggedIn', 'user'])
  },
  methods: {
    async logout() {
      await this.$auth.logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style></style>
