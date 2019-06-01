<template>
  <panel-splitter layout="horizontal" mode="resize" startValue="33" minValue="15" maxValue="85" hasparent>
      <composant3 slot="prev-panel" />
      <composant4 slot="next-panel" />
  </panel-splitter>
</template>

<script>
import composant3 from "../comp3/comp3.vue";
import composant4 from "../comp4/comp4.vue";
import panelSplitter from "../splitter/panel-splitter.vue";

export default {
  components: {
    composant3,
    composant4,
    panelSplitter,
  },
  data() {
    return {
      items: new Array(125),
      message: "Composant 1",
    };
  },
};
</script>

<style scoped>
.mystyle {
  background-color: rgb(173, 228, 173);
}
</style>
