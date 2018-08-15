<script>
import { mapActions, mapGetters, mapState } from 'vuex'

import ServerOnline from './server-online.vue'

export default {
  computed: {
    ...mapState({
      isTrackingLoaded: state => state.tracking.loaded,
      servers: state => state.tracking.servers,
    })
  },
  methods: {
    ...mapActions([
      'loadTrackedServers',
    ]),
  },
  created () {
    if (!this.isTrackingLoaded) {
      this.loadTrackedServers();
    }
  },
  components: {
    ServerOnline,
  }
}
</script>

<template>
  <div>
    <h1 class="mt-3">Servers</h1>
    <ServerOnline :server="server" v-for="server in servers" :key="server.ipport" />
  </div>
</template>
