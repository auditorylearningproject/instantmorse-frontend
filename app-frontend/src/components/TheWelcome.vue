<script setup lang="ts">
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'
</script>

<template>
  <WelcomeItem>
    <!-- <template #icon>
      <DocumentationIcon />
    </template> -->
    <template #heading>Project Members</template>

  </WelcomeItem>

  <WelcomeItem>
    <!-- <template #icon>
      <ToolingIcon />
    </template>
    Calvin -->
    Calvin
  </WelcomeItem>

  <WelcomeItem>
    <!-- <template #icon>
      <EcosystemIcon />
    </template> -->
    David
  </WelcomeItem>

  <WelcomeItem>
    <!-- <template #icon>
      <CommunityIcon />
    </template> -->

    Kento
  </WelcomeItem>

  <WelcomeItem>
    Luke
  </WelcomeItem>
</template>
