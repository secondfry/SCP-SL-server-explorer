<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import Fuse from 'fuse.js'

const fuseOptions = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 3,
  keys: [
    'ipport',
    'name',
  ]
};

export default {
  data () {
    return {
      needle: '',
      results: []
    }
  },
  computed: {
    ...mapState({
      isListLoaded: state => state.list.loaded,
      servers: state => state.list.servers,
      serversTracked: state => state.tracking.servers,
    }),
    ...mapGetters([
      'getTrackedCount',
    ]),
    areServerAvailable () {
      return Object.values(this.servers).length !== 0;
    },
  },
  watch: {
    needle (newData, oldData) {
      this.results = this.fuse.search(this.needle);
    },
    servers (newData, oldData) {
      this.fuse = new Fuse(Object.values(this.servers), fuseOptions);
    }
  },
  created () {
    if (!this.isListLoaded) {
      this.loadServerList();
    }
  },
  methods: {
    ...mapActions([
      'loadServerList',
      'trackServer',
    ]),
    track (server) {
      this.needle = '';

      if (this.getTrackedCount > 4) {
        return;
      }

      this.trackServer(server);
    }
  },
}
</script>

<template>
  <div>
    <input
      v-model="needle"
      class="form-control"
      type="text"
      placeholder="Start typing server IP or name"
      :disabled="!areServerAvailable || getTrackedCount > 4"
    >
    <div
      v-if="results.length"
      class="form-control server-box"
    >
      <div
        v-for="server in results"
        :key="server.ipport"
        class="server-line"
      >
        <a
          href="#"
          @click="track(server)"
        >{{ server.ipport }}<span v-if="server.name"> – {{ server.name }}</span></a>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.server-box {
  position: absolute;
  width: auto;
  max-height: 10rem;
  overflow-y: scroll;
  z-index: 1;
}
.server-line {
  margin: 0.5rem 0;

  &:first-of-type {
    margin-top: 0;
  }

  &:last-of-type {
    margin-bottom: 0;
  }
}
</style>