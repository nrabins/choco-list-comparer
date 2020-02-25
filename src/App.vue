<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <span class="title">
        Choco List Comparer
      </span>
    </v-app-bar>
    <v-content>
      <compare-layout />
    </v-content>
  </v-app>
</template>

<script>
import CompareLayout from '@/components/CompareLayout'

export default {
  name: 'App',

  components: {
    CompareLayout,
  },

};
</script>
