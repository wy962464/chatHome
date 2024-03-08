<script setup>
import { onMounted } from 'vue';
import autofit from 'autofit.js';

onMounted(() => {
    autofit.init(
        {
            designHeight: 667,
            designWidth: 375,
            renderDom: '#app',
            resize: true,
        },
        false
    );
});
</script>

<template>
    <n-message-provider>
        <router-view />
    </n-message-provider>
</template>

<style scoped lang="scss"></style>
