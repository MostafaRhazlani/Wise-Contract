<template>
  <div id="app" class="min-h-screen bg-slate-100">
    <!-- Header -->
    <HeaderView v-if="route.meta.showHeader" :sidebarExpanded="sidebarExpanded" />
    <!-- Sidebar -->
    <SidebarView v-if="route.meta.showSidebar" v-model:sidebarExpanded="sidebarExpanded" />
    <!-- Main Content -->
    <div class="transition-all duration-300 ease-in-out" :class="!route.meta.showSidebar ? 'lg:ml-0' : (sidebarExpanded ? 'lg:ml-64' : 'lg:ml-16')">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router';
import SidebarView from '@/views/layouts/SidebarView.vue'
import HeaderView from '@/views/layouts/HeaderView.vue'

const sidebarExpanded = ref(false)
const route = useRoute();
</script>

<style>
/* Global styles are in main.css */
</style>
