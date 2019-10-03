<script>
import { mapActions, mapGetters, mapState } from 'vuex'

import ServerOnline from './server-online.vue'

export default {
  computed: {
    ...mapState({
      isTrackingLoaded: state => state.tracking.loaded,
      servers: state => state.tracking.servers,
    }),
    ...mapGetters([
      'getTrackedCount'
    ]),
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
    <h1 class="mt-3">
      Servers
    </h1>
    <p v-if="!getTrackedCount">
      None yet!
    </p>
    <ServerOnline
      v-for="server in servers"
      :key="server.ipport"
      :server="server"
    />
  </div>
</template>
