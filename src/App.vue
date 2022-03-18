<template>
  <h1>wordguesser DE</h1>
  <LetterRow
    v-for="i in numWords"
    :key="i"
    :active="i - 1 === activeRow"
    :word="words[i - 1]"
    :complete="i - 1 < activeRow"
    :target-word="targetWord"
  />
  <div class="info-text">
    {{ output }}
  </div>
  <div class="button-row">
    <button @click="giveUp()">
      Aufgeben
    </button>
    <button
      class="submit-button"
      @click="submit"
    >
      Eingabe
    </button>
    <button @click="showHelp">
      Hilfe
    </button>
  </div>
  <Modal v-model="modalShown">
    <template #header>
      <h1>Spiel vorbei</h1>
    </template>
    <template #body>
      <p>Das Spiel ist beendet.</p>
    </template>
    <template #footer>
      ...
    </template>
  </Modal>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import LetterRow from './components/LetterRow.vue';
import Modal from './components/Modal.vue';
import Dictionary from './dict/dictionary';
import GameOverReason from './GameOverReason';

@Options({
  components: {
    LetterRow,
    Modal,
  },
})
export default class App extends Vue {
  activeRow = 0;

  output = 'Versuche, das Wort zu erraten!';

  words: string[] = [];

  targetWord = 'felix';

  readonly allowedLetters = 'abcdefghijklmnopqrstuvwxyz';

  readonly dictionary = new Dictionary();

  readonly numWords = 6;

  gameOver = true;

  triesToWin = -1;

  modalShown = true;

  reason: GameOverReason = GameOverReason.CRASH;

  mounted(): void {
    this.reset(null);
    document.addEventListener('keyup', this.onKeyUp);
  }

  reset($event: Event | null): void {
    this.words = new Array(this.numWords).fill('');
    this.activeRow = 0;
    this.output = 'Versuche, das Wort zu erraten!';
    this.gameOver = false;
    this.triesToWin = -1;
    if ($event?.target) ($event.target as HTMLElement).blur();
  }

  // returns the currently typed word
  get activeWord(): string | null {
    return this.activeRow >= 0 && this.activeRow < this.numWords
      ? this.words[this.activeRow] : null;
  }

  set activeWord(newWord: string | null) {
    if (newWord !== null && this.activeRow >= 0 && this.activeRow < this.numWords) {
      this.words[this.activeRow] = newWord;
    }
  }

  giveUp(): void {
    this.reason = GameOverReason.USER_GAVE_UP;
    this.gameOver = true;
    this.modalShown = true;
  }

  submit(): void {
    if (this.gameOver) return;
    // try to submit word
    if (this.activeWord?.length === 5) {
      const word = this.activeWord;
      if (this.dictionary.check(word)) {
        // valid word
        if (this.activeRow < this.numWords) {
          // go to next word
          this.activeRow += 1;
        }
        if (word === this.targetWord) {
          this.triesToWin = this.activeRow;
          this.output = `Richtig! (${this.triesToWin} Versuche)`;
          this.gameOver = true;
        } else if (this.activeRow === this.numWords) {
          this.output = 'Spiel vorbei!';
          this.triesToWin = -1;
          this.gameOver = true;
        }
      } else {
        this.output = `Unbekanntes Wort: ${this.activeWord}`;
      }
    }
  }

  showHelp(): void {
    this.output = 'Hilfe';
  }

  private onKeyUp(e: KeyboardEvent): void {
    if (this.gameOver) return;
    if (e.code === 'Enter') {
      this.submit();
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

h1 {
  margin: 16px 0;
  font-size: 2.4em;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.button-row {
  display: flex;
  justify-content: center;
  & button {
    margin: 5px;
    border: 2px solid #000000;
    background-color: #ffffff;
    padding: 6px 8px;
    font-size: 16px;
    width: 92px;
    border-radius: 10px;
    transition: all .05s linear;

    &.submit-button {
      background-color: #558b2f;
      color: #ffffff;
      &:hover {
        background-color: #8bc34a;
      }
    }
    &:hover {
      background-color: #cfd8dc;
    }
  }
}

.info-text {
  margin: 4px;
}

@media only screen and (max-width: 600px) {
  #app {
    margin-top: 0;
  }
  h1 {
    margin: 5px 0;
    font-size: 1.8em;
  }
}
</style>
