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
      items: new Array(25),
      message: "Composant 4",
    };
  },
};
</script>
<style scoped>
.mystyle {
  height: 100%;
  background-color: rgb(228, 173, 194);
}
</style>

