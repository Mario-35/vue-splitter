<template>
  <div class="mystyle">
    {{ message }}
    <ul>
      <li v-for="(item, index) in items" :key="`items-${index}`">{{`${message}-${index}` }}</li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      items: new Array(145),
      message: "Composant 2",
    };
  },
};
</script>
<style scoped>
.mystyle {
  background-color: rgb(228, 204, 173);
}
</style>