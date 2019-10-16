<template>
  <div style="height: 500px;">
    <a-spin size="large" />
  </div>
</template>
<script>
export default {
  name: 'loading',
    props: {
        visible: { type: Boolean, default: true },
    },
    data() {
        return {
           testurl : '',
           c:6,
        };
    },
    computed:{
        isvisible:{
          get:function(){
            return this.visible;
          }
        }
    },
    methods: {

    },
}
</script>
<style scoped>
.ant-spin{
  position: absolute;
  top: 50%;
  left: 50%;
}
</style>
