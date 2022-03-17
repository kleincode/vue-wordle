<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld /><br>
  <LetterRow v-for="i in 5" :key="i" :active="i - 1 === activeRow" :word="words[i - 1]"
  :complete="i - 1 < activeRow" :targetWord="targetWord" /> <br>
  {{ output }} <br>
  <span @click="reset()" style="cursor: pointer;">Reset</span>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import HelloWorld from './components/HelloWorld.vue';
import LetterRow from './components/LetterRow.vue';
import Dictionary from './dict/dictionary';

@Options({
  components: {
    HelloWorld,
    LetterRow,
  },
})
export default class App extends Vue {
  activeRow = 0;

  output = '';

  words: string[] = [];

  targetWord = 'felix';

  readonly allowedLetters = 'abcdefghijklmnopqrstuvwxyz';

  readonly dictionary = new Dictionary();

  mounted(): void {
    this.reset();
    document.addEventListener('keyup', this.onKeyUp);
  }

  reset(): void {
    this.words = ['', '', '', '', ''];
    this.activeRow = 0;
  }

  // returns the currently typed word
  get activeWord(): string | null {
    return this.activeRow >= 0 && this.activeRow < 5 ? this.words[this.activeRow] : null;
  }

  set activeWord(newWord: string | null) {
    if (newWord !== null && this.activeRow >= 0 && this.activeRow < 5) {
      this.words[this.activeRow] = newWord;
    }
  }

  private onKeyUp(e: KeyboardEvent): void {
    if (e.code === 'Enter') {
      // try to submit word
      if (this.activeWord?.length === 5) {
        if (this.dictionary.check(this.activeWord)) {
          // valid word
          if (this.activeRow < 4) {
            // go to next word
            this.activeRow += 1;
          } else {
            // last word --> game over
            this.activeRow = 5;
            this.output = 'Game ended';
          }
        } else {
          this.output = `Unknown word: ${this.activeWord}`;
        }
      }
    } else if (e.code === 'Backspace') {
      // try to remove last letter from active word
      if (this.activeWord && this.activeWord.length > 0) {
        // word contains at least one letter
        this.activeWord = this.activeWord.substring(0, this.activeWord.length - 1);
      }
    } else if (this.activeWord !== null && this.activeWord.length < 5) {
      // insert letter
      const letter = e.key.toLocaleLowerCase();
      if (this.allowedLetters.includes(letter)) {
        // letter is allowed, append to word
        this.activeWord += letter;
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
