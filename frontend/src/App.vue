<template>
  <div class="page-wrapper">
  <div class="page-inner">
    <Nav/>
    <Content/>
  </div>
  </div>
  <!--
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div>
  -->
  
</template>



<script>
import Content from '@/components/Content.vue'
import Nav from '@/components/Nav.vue'

export default{
  components:{Content,Nav}
}
</script>

