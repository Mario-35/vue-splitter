<template>
  <div class="main">
    {{ message }}
  </div>
</template>

<script lang="ts" >


export default {
  data() {
    return {
      items: new Array(25),
      essais: Number(Math.floor((Math.random() * 10) + 1)),
      adam: Number(Math.floor((Math.random() * 10) + 1)),
      message: "Composant 4",
    };
  },
};
</script>
<style scoped>

.main {
  height: 100%;
  background-color: rgb(228, 173, 194);
  list-style: none;
  overflow-y: auto;
}

.flexbox {
  display: flex;
  width: 80%;
  padding: 16px;
	margin: 60px auto 0;
	border: 6px solid #36E7EB;
	border-radius: 10px;
}
li {
	font-size: 12px;
  width: 100px;
  height: 100px;
	padding: 10px;
  margin-right: 14px;
	border-radius: 10px;
  background-color: #FEDD57;
  /* flex-grow: 0; */
}
.essai {
  flex: 1;
}

</style>

