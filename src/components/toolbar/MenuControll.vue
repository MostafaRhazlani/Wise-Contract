<template>
    <div class="bg-white border-b border-gray-200 p-2 relative z-20">
        <nav class="mb-2">
            <ul class="flex gap-6 list-none m-0 p-0">
                <li v-for="item in menuItems" :key="item.key" @click="setActive(item.key)" :class="[
                    'cursor-pointer font-medium p-1 transition-colors text-xs',
                    activeItem === item.key
                        ? 'border-b-4 border-green-500'
                        : 'text-gray-500 hover:text-gray-800'
                ]">
                    {{ item.label }}
                </li>
            </ul>
        </nav>
        <div class="max-w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div class="min-w-max flex">
                <template v-if="activeItem === 'home'">
                    <div class="flex items-center text-gray-600">
                        <div class="grid grid-cols-2 gap-1">
                            <UndoButton :editor="editor" />
                            <RedoButton :editor="editor" />
                            <ClearMarks :editor="editor" />
                        </div>
        
                        <!-- break -->
                        <div class="w-px h-16 bg-gray-200 mx-4"></div>
        
                        <div class="flex flex-col gap-1">
                            <div class="space-x-1 flex">
                                <FontSize class="w-full" :editor="editor" />
                                <FontFamily class="w-full" :editor="editor" />
                            </div>
                            <div class="space-x-1 w-full">
                                <BoldButton :editor="editor" />
                                <ItalicButton :editor="editor" />
                                <UnderlineButton :editor="editor" />
                                <StrikeButton :editor="editor" />
                                <SuperscriptButton :editor="editor" />
                                <SubscriptButton :editor="editor" />
                                <TextColorButton :editor="editor" />
                                <HighlightButton :editor="editor" />
                            </div>
                        </div>
        
                        <!-- break -->
                        <div class="w-px h-16 bg-gray-200 mx-4"></div>
        
                        <div class="flex flex-col">
                            <div class="space-x-1 w-full">
                                <AlignLeftButton :editor="editor" />
                                <AlignCenterButton :editor="editor" />
                                <AlignRightButton :editor="editor" />
                                <AlignJustifyButton :editor="editor" />
                            </div>
                            <div class="space-x-1 w-full">
                                <NumberedListButton :editor="editor" />
                                <BulletedList :editor="editor" />
                                <LineHeight :editor="editor" />
                            </div>
                        </div>
        
                        <!-- break -->
                        <div class="w-px h-16 bg-gray-200 mx-4"></div>
        
                        <div class="flex flex-col">
                            <div class="space-x-1 w-full">
                                <HeadingSize :editor="editor" />
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else-if="activeItem === 'table'">
                    <div class="flex items-center">
                        <InsertTable :editor="editor" />
        
                        <!-- break -->
                        <div class="w-px h-16 bg-gray-200 mx-4"></div>
        
                        <div class="flex">
                            <div>
                                <InsertRowAbove :editor="editor" />
                                <InsertRowBelow :editor="editor" />
                            </div>
                            <div>
                                <InsertColumnBefore :editor="editor" />
                                <InsertColumnAfter :editor="editor" />
                            </div>
                            <div>
                                <DeleteRow :editor="editor" />
                                <DeleteColumn :editor="editor" />
                            </div>
                        </div>
        
                        <!-- break -->
                        <div class="w-px h-16 bg-gray-200 mx-4"></div>
        
                        <div class="flex flex-col">
                            <MergeCells :editor="editor" />
                            <SplitCell :editor="editor" />
                        </div>
        
                        <!-- break -->
                        <div class="w-px h-16 bg-gray-200 mx-4"></div>
                        
                        <div class="flex items-start">
                            <div>
                                <HeaderRow :editor="editor" />
                                <HeaderColumn :editor="editor" />
                            </div>
                            <HeaderCell :editor="editor" />
                        </div>
                    </div>
        
                </template>
                <template v-else-if="activeItem === 'page'">
                    <SizeSelector :editor="editor" />
                    <PageOrientation />
                    <PageBackground />
                </template>
                <template v-else-if="activeItem === 'insert'">
                    <InsertColumns :editor="editor" @insert-columns="handleInsertColumns" />
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import UndoButton from './menu/base/UndoButton.vue';
import RedoButton from './menu/base/RedoButton.vue';
import ClearMarks from './menu/base/ClearMarks.vue';
import FontSize from './menu/base/FontSize.vue';
import FontFamily from './menu/base/FontFamily.vue';
import BoldButton from './menu/base/BoldButton.vue';
import ItalicButton from './menu/base/ItalicButton.vue';
import UnderlineButton from './menu/base/UnderlineButton.vue';
import StrikeButton from './menu/base/StrikeButton.vue';
import SuperscriptButton from './menu/base/SuperscriptButton.vue';
import SubscriptButton from './menu/base/SubscriptButton.vue';
import ColorPicker from './menu/base/ColorPicker.vue';
import InsertTable from './menu/table/InsertTable.vue';
import AlignLeftButton from './menu/base/AlignLeftButton.vue';
import AlignCenterButton from './menu/base/AlignCenterButton.vue';
import AlignRightButton from './menu/base/AlignRightButton.vue';
import AlignJustifyButton from './menu/base/AlignJustifyButton.vue';
import NumberedListButton from './menu/base/NumberedListButton.vue';
import BulletedList from './menu/base/BulletedList.vue';
import LineHeight from './menu/base/LineHeight.vue';
import HeadingSize from './menu/base/HeadingSize.vue';
import InsertColumns from './menu/insert/InsertColumns.vue';
import SizeSelector from './menu/page/SizeSelector.vue';
import PageOrientation from './menu/page/PageOrientation.vue';
import PageBackground from './menu/page/PageBackground.vue';
import InsertRowAbove from './menu/table/InsertRowAbove.vue';
import InsertRowBelow from './menu/table/InsertRowBelow.vue';
import InsertColumnBefore from './menu/table/InsertColumnBefore.vue';
import InsertColumnAfter from './menu/table/InsertColumnAfter.vue';
import DeleteRow from './menu/table/DeleteRow.vue';
import DeleteColumn from './menu/table/DeleteColumn.vue';
import MergeCells from './menu/table/MergeCells.vue';
import SplitCell from './menu/table/SplitCell.vue';
import HeaderRow from './menu/table/HeaderRow.vue';
import HeaderColumn from './menu/table/HeaderColumn.vue';
import HeaderCell from './menu/table/HeaderCell.vue';
import CellAlignment from './menu/table/CellAlignment.vue';
import CellBackground from './menu/table/CellBackground.vue';
import TextColorButton from './menu/base/TextColorButton.vue';
import HighlightButton from './menu/base/HighlightButton.vue';

const props = defineProps<{ editor: any }>();

const menuItems = [
    { key: 'home', label: 'Home' },
    { key: 'table', label: 'Table' },
    { key: 'page', label: 'Page' },
    { key: 'insert', label: 'Insert' },
];


const activeItem = ref('home');

function setActive(key: string) {
    activeItem.value = key;
}

// Define the emits so child components can trigger these functions
const emit = defineEmits(['insert-table', 'insert-columns']);

function handleInsertColumns(columnData: any) {
    emit('insert-columns', columnData);
}
</script>
