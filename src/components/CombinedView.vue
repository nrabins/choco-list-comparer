<template>
  <div>
    <v-row v-for="(p, index) in packages" :key="index">
      <v-col cols="8">
        {{p.name}}
      </v-col>
      <v-col cols="2">
        {{p.left ? p.left.versionStr : ""}}
      </v-col>
      <v-col cols="2">
        {{p.right ? p.right.versionStr : ""}}
      </v-col>

    </v-row>
  </div>
</template>

<script>
export default {
  name: "combined-view",
  props: {
    packages: {
      required: true
    }
  }
};
</script>

<style>
</style>