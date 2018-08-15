<script>
import LayoutDefault from '../layouts/default.vue'
import ViewChooseServer from '../components/view-choose-server.vue'
import ViewTrackServers from '../components/view-track-servers.vue'

export default {
  components: {
    LayoutDefault,
    ViewChooseServer,
    ViewTrackServers,
  }
}
</script>

<template>
  <layout-default>
    <ViewChooseServer />
    <ViewTrackServers />
  </layout-default>
</template>
