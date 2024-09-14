<template>
  <MdEditor
    v-model="text"
    :toolbars="toolbars"
    :footers="footers"
    :preview="false"
    @on-upload-img="handleUploadImg"
  ></MdEditor>
</template>

<script setup lang="ts">
import { Footers, MdEditor, ToolbarNames } from 'md-editor-v3'
import { uploadMulti } from '@/api/upload'
import 'md-editor-v3/lib/style.css'

const text = ref('')

const toolbars: ToolbarNames[] = [
  'bold',
  'underline',
  'italic',
  'strikeThrough',
  '-',
  'title',
  'quote',
  'unorderedList',
  'orderedList',
  'table',
  '-',
  'link',
  'image',
  '=',
  'pageFullscreen',
  'preview'
]

const footers: Footers[] = []

const handleUploadImg = async (files: File[], callback: (urls: string[]) => void) => {
  const res = await uploadMulti(files)
  callback(res.map(r => r.full_path))
}
</script>

<style lang="scss" scoped></style>
