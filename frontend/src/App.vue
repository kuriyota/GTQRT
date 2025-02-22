<script setup>

import { RouterView } from 'vue-router';

</script>


<template>
    <div id="content">
        <RouterView></RouterView>
    </div>
</template>

<style scoped>

#content {
    height:100dvh;
    width: 100%;
    padding: 40px;
    margin: 0 auto;
}

</style>