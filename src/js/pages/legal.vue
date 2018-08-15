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
    <h1>Whats the deal?</h1>
    <p><a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a> has been chosen by <a href="http://scp-wiki.net/licensing-guide">SCP Foundation</a>.</p>
    <p>Under that license anyone is free to share and adapt the material. One also must give appropriate credit and release his work under the same license.</p>
    <p>Let's take <a href="http://www.scpcbgame.com">SCP: Containment Breach</a> for example. You are free to use any models, map tiles, geometry, sound clips from the game. CC BY-SA 3.0 also enforces you into either releasing binary or source code under same license. So you may either decompile binary or <a href="https://github.com/Regalis11/scpcb">use source code directly</a>.</p>
    <p>SCP: Secret Laboratory has <a rel="nofollow" href="https://store.steampowered.com/eula/700330_eula_0">EULA</a> and license text which is distributed with the game itself. After reading them and CC BY-SA 3.0 one may judge that License Grant, part 3 and 4, and parts of Intellectual Property and Ownership break CC BY-SA 3.0.</p>
    <h1>Why is it important? The game is free!</h1>
    <p>SCP: Containment Breach was released under CC BY-SA 3.0.<br>Creator of the game let others to take his work and build upon it. This is how we are still getting updates on it.</p>
    <p>SCP: Secret Laboratory was released under private EULA.<br>You are prohibited from modifying source code and it is unclear if you are allowed to unpack resource files for models and sound clips or not since one may find 'source code' or 'the Software' in EULA covering models and sound clips too. On other hand, if we judge that you may extract models, then one may replace walls with transparency – basically making a wallhack.</p>
    <h1>What now?</h1>
    <p>I've reported those violations to SCP Foundation <a href="http://05command.wikidot.com/license-experts-main">Licensing Team</a>. Apparently they were already aware of this situation.</p>
    <p>Hopefully it will change. For now, all we can do is spread the word around the issue.</p>
  </layout-default>
</template>
