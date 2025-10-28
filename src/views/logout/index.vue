<template>

</template>

<script setup lang="ts">
import router from '@/router';
import { goUnifiedlogin } from '@/utils/auth';
localStorage.removeItem("maasUser");
localStorage.removeItem("setup_status");
localStorage.removeItem("console_token");
localStorage.removeItem("refresh_token");
goUnifiedlogin()
</script>