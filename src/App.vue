<template>
  <div class="tetris" @keyup.down="down">
    PC端使用键盘方向键操作
    <canvas id="tetris-canvas"></canvas>
    <div style="margin-top: 10px;">
      <button @click="start" v-if="status==0" :disabled="status!=0">开始</button>
      <button @click="suspend" v-if="status==1" :disabled="status!=1">暂停</button>
      <button @click="continueGame" v-if="status==2" :disabled="status!=2">继续</button>
<!--      <button @click="reStart">重新开始</button>-->
      <button v-if="status==1" @click="rotate">⬆</button>
      <button v-if="status==1" @click="down">⬇</button>
      <button v-if="status==1" @click="left">⬅</button>
      <button v-if="status==1" @click="right">➡</button>
      得分：{{score}}
    </div>
  </div>
</template>
<script>
import Tetris from "./lib/tetris"
export default {
  name: "Index",
  data(){
    return {
      game: null,
    }
  },
  computed:{
    status(){
      if (this.game==null){
        return 0
      }
      return this.game.status
    },
    score(){
      if (this.game==null){
        return 0
      }
      return this.game.score
    }
  },
  mounted() {
    const canvas = document.getElementById("tetris-canvas")
    this.game = new Tetris(10, 20, canvas)
    window.removeEventListener('keydown', this.handler)
    window.addEventListener('keydown', this.handler)
  },
  methods: {
    reStart(){
      this.game.reStart()
    },
    start(){
      this.game.start()
    },
    suspend(){
      this.game.suspend()
    },
    continueGame(){
      this.game.continue()
    },
    down(){
      this.game.down()
    },
    left(){
      this.game.left()
    },
    right(){
      this.game.right()
    },
    rotate(){
      this.game.rotate()
    },
    handler(e){
      switch (e.which) {
        case 38:
          this.game.rotate()
          break
        case 40:
          this.game.down()
          break
        case 37:
          this.game.left()
          break
        case 39:
          this.game.right()
          break
      }
    }
  }
}
</script>
<style scoped>
.tetris{
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.tetris button{
  margin-right: 10px;
}
</style>
