<template>
  <GToastContainer/>



</template>

<script setup>

import {ref} from 'vue'
import {useToast} from "@/components/shared/useToast.js";

import { ICON_PATHS, MULTI_PATH_ICONS } from '@/components/iconLibary.js'


const toast = useToast()

</script>

<style scoped>


</style>
