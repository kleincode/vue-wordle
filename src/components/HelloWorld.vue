<template>
  <div class="hello">
    Hallo! <br>
    <input placeholder="word" v-model="word">
    <button @click="searchWord">Suche</button>
    <span>{{ output }}</span>
  </div>
</template>

<script lang="ts">
import Dictionary from '@/dict/dictionary';
import { Options, Vue } from 'vue-class-component';

@Options({})
export default class HelloWorld extends Vue {
  word = '';

  output = '';

  readonly dictionary = new Dictionary();

  searchWord(): void {
    const exists = this.dictionary.check(this.word);
    if (exists) {
      this.output = 'Wort existiert!';
    } else {
      this.output = 'Wort existiert nicht!';
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
