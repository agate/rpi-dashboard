<template>
<v-app>
  <v-navigation-drawer v-model="drawer" fixed clipped app dark>
    <v-list>
      <v-list-tile :to="{ name: 'gpios' }">
        <v-list-tile-action>
          <v-icon>home</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>GPIO</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile :to="{ name: 'about' }">
        <v-list-tile-action>
          <v-icon>info</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>About</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
  <v-toolbar fixed app dark clipped-left>
    <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
    <v-toolbar-title>RPi Dashboard &nbsp;<span class="font-weight-light">@{{ hostname }}</span></v-toolbar-title>
  </v-toolbar>
  <v-content>
    <router-view />
  </v-content>
</v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    drawer: null,
    hostname: '',
  }),
  async mounted() {
    const resp = await this.$http.get('hostname');
    this.hostname = resp.data.result;
  },
};
</script>
