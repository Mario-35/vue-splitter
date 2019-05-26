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
      items: new Array(125),
      message: "Composant 3",
    };
  },
};
</script>
<style scoped>
.mystyle {
  background-color: rgb(173, 212, 228);
}
</style>

