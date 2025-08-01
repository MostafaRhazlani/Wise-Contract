<script setup lang="ts">
    const props = defineProps<{
        html: string
    }>();
</script>

<template>
    <div>
        <div class="bg-white shadow-lg p-12 w-full h-full" v-html="html"></div>
    </div>
</template>

<style>
    
</style>