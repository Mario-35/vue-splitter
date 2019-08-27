
<template>
  <panel-splitter layout="vertical" startValue="66" minValue="25" maxValue="75" mode="active">
      <composant1 slot="prev-panel" />
      <composant2 slot="next-panel" />
  </panel-splitter>
</template>

<script>
import composant1 from "./components/comp1/comp1.vue";
import composant2 from "./components/comp2/comp2.vue";

import panelSplitter from "./components/splitter/panel-splitter.vue";

export default {
  components: {
    composant1,
    composant2,
    panelSplitter,
  },
};
</script>

<style>
html,
body {
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
</style>
