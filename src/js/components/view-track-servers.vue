<script>
import { mapActions, mapGetters, mapState } from 'vuex'

import ServerOnline from './server-online.vue'

export default {
  components: {
    ServerOnline,
  },
  computed: {
    ...mapState({
      isTrackingLoaded: state => state.tracking.loaded,
      servers: state => state.tracking.servers,
    }),
    ...mapGetters([
      'getTrackedCount'
    ]),
  },
  created () {
    if (!this.isTrackingLoaded) {
      this.loadTrackedServers();
    }
  },
  methods: {
    ...mapActions([
      'loadTrackedServers',
    ]),
  },
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
