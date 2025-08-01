<template>
    <div class="relative inline-block">
        <el-tooltip content="Page Orientation" placement="bottom">
            <!-- Main Button -->
            <button @click="toggleDropdown" class="flex flex-col items-center text-sm p-2 text-gray-500 hover:text-green-500 hover:bg-green-100 rounded-md transition-colors">
                <Icon icon="fluent:orientation-24-regular" width="36" height="36" />
                <span>Orientation</span>
            </button>
        </el-tooltip>

        <!-- Dropdown -->
        <transition name="fade">
            <div v-if="showDropdown" class="fixed z-50 mt-2 bg-white border border-gray-200 rounded shadow-md w-48 p-3"
                @click.stop>
                <div class="space-y-1">
                    <button v-for="orientation in orientations" :key="orientation.value"
                        @click="setOrientation(orientation.value)"
                        class="w-full flex items-center justify-between px-3 py-2 text-xs rounded transition-colors"
                        :class="{
                            'bg-green-100 text-green-800': isOrientation(orientation.value),
                            'hover:bg-gray-100': !isOrientation(orientation.value)
                        }">
                        <Icon icon="fluent-mdl2:landscape-orientation" width="20px" height="20px" :class="orientation.value === 'portrait' ? '-rotate-90' : ''" />
                        <span>{{ orientation.label }}</span>
                        <Icon v-if="isOrientation(orientation.value)" icon="mdi:check" class="w-4 h-4" />
                    </button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import { ElTooltip } from 'element-plus';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { usePageSizeStore } from '@/store/pageSizeStore';

const pageSizeStore = usePageSizeStore();
const showDropdown = ref(false);

const orientations = [
    { label: 'Portrait', value: 'portrait'},
    { label: 'Landscape', value: 'landscape' },
];

const isLandscape = computed(() => {
    return pageSizeStore.pageWidth > pageSizeStore.pageHeight;
});

const isOrientation = (orientation) => {
    return (orientation === 'landscape' && isLandscape.value) ||
        (orientation === 'portrait' && !isLandscape.value);
};

const toggleDropdown = (e) => {
    e.stopPropagation();
    showDropdown.value = !showDropdown.value;
};

const closeDropdown = () => {
    showDropdown.value = false;
};

const setOrientation = (orientation) => {
    if ((orientation === 'landscape' && !isLandscape.value) ||
        (orientation === 'portrait' && isLandscape.value)) {
        pageSizeStore.toggleOrientation();
    }
    closeDropdown();
};

const handleClick = (e) => {
    if (showDropdown.value && !e.target.closest('.relative')) {
        closeDropdown();
    }
};

onMounted(() => {
    document.addEventListener('click', handleClick);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClick);
});
</script>

<style scoped>

</style>
