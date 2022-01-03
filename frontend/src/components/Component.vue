<template>
  <div>
    <h1 class="container border border-success bg-dark text-white rounded">{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'Component',
  props: {
    msg: String
  }
}
</script>