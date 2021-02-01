<template>
  <v-card>
    <v-toolbar color="primary" dark flat>
      <v-toolbar-title>
        <slot name="title" />
      </v-toolbar-title>
    </v-toolbar>
    <slot />
  </v-card>
</template>
