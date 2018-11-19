<template lang="html">
  <v-navigation-drawer v-model="drawer" fixed clipped app dark>
    <v-list>
      <v-list-tile :to="{ name: d.name }" v-for="d in lst" :key="d.title">
        <v-list-tile-action>
          <v-icon>{{ d.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ d.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: ['drawer'],
  data: () => ({
    lst: [{
      name: 'gpios',
      title: 'GPIO',
      icon: 'home',
    }, {
      name: 'about',
      title: 'About',
      icon: 'info',
    }],
  }),
};
</script>
