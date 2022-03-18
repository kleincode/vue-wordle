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
    <button
      :disabled="gameOver"
      @click="giveUp()"
    >
      Aufgeben
    </button>
    <button
      class="submit-button"
      @click="gameOver ? reset($event) : submit()"
    >
      {{ gameOver ? "Nochmal" : "Eingabe" }}
    </button>
    <button @click="helpModalShown = true">
      Hilfe
    </button>
  </div>
  <Modal v-model="modalShown">
    <template #header>
      <template v-if="gameOver">
        <h1>{{ modalTitle }}</h1>
      </template>
    </template>
    <template #body>
      <p>Das gesuchte Wort war '{{ targetWord }}'.</p>
      <p v-if="triesToWin > 0">
        Du hast es in {{ triesToWin }} Versuchen erraten.
      </p>
    </template>
    <template #footer>
      <div class="modal-button-row">
        <button
          class="text"
          @click="reset($event)"
        >
          Neues Spiel
        </button>
      </div>
    </template>
  </Modal>
  <Modal v-model="helpModalShown">
    <template #header>
      <h1>Hilfe</h1>
    </template>
    <template #body>
      <p>
        Du hast {{ numWords }} Versuche, um das Wort zu erraten.
        Jeder Versuch gibt dir dabei Hinweise:
      </p>
      <div class="explainer-box">
        <LetterBox
          letter="a"
          :state="3"
        />
        <p>
          Grün heißt: Der Buchstabe steht an der richtigen Stelle.
        </p>
      </div>
      <div class="explainer-box">
        <LetterBox
          letter="a"
          :state="2"
        />
        <p>
          Gelb heißt: Der Buchstabe ist richtig, steht aber an der falschen Stelle.
        </p>
      </div>
      <div class="explainer-box">
        <LetterBox
          letter="a"
          :state="1"
        />
        <p>
          Grau heißt: Der Buchstabe kommt nicht vor.
        </p>
      </div>
    </template>
    <template #footer>
      <div class="modal-button-row">
        <button
          class="text"
          @click="helpModalShown = false"
        >
          Alles klar!
        </button>
      </div>
    </template>
  </Modal>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import LetterRow from './components/LetterRow.vue';
import Modal from './components/Modal.vue';
import Dictionary from './dict/dictionary';
import german5 from './dict/german5';
import german5Simple from './dict/german5_simple';
import GameOverReason from './GameOverReason';
import LetterBox from './components/LetterBox.vue';

@Options({
  components: {
    LetterRow,
    LetterBox,
    Modal,
  },
})
export default class App extends Vue {
  activeRow = 0;

  output = 'Versuche, das Wort zu erraten!';

  words: string[] = [];

  targetWord = 'felix';

  readonly allowedLetters = 'abcdefghijklmnopqrstuvwxyz';

  // Dictionary with all valid words
  readonly dictionary = new Dictionary(german5);

  // Dictionary with all possible target words (simpler)
  readonly targetDictionary = new Dictionary(german5Simple);

  readonly numWords = 6;

  gameOver = true;

  triesToWin = -1;

  modalShown = false;

  helpModalShown = false;

  reason: GameOverReason = GameOverReason.CRASH;

  mounted(): void {
    this.reset(null);
    document.addEventListener('keyup', this.onKeyUp);
  }

  @Watch('modalShown')
  onModalShownChange(newVal: boolean): void {
    if (newVal) this.helpModalShown = false;
  }

  reset($event: Event | null): void {
    this.targetWord = this.targetDictionary.getRandomWord();
    this.words = new Array(this.numWords).fill('');
    this.activeRow = 0;
    this.output = 'Versuche, das Wort zu erraten!';
    this.gameOver = false;
    this.triesToWin = -1;
    if ($event?.target) ($event.target as HTMLElement).blur();
    this.modalShown = false;
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

  get modalTitle(): string {
    switch (this.reason) {
      case GameOverReason.CRASH:
        return 'Fehler';
      case GameOverReason.USER_GAVE_UP:
        return 'Aufgegeben';
      case GameOverReason.USER_LOST:
        return 'Spiel vorbei';
      case GameOverReason.USER_WON:
        return 'Gut gemacht!';
      default:
        return '';
    }
  }

  giveUp(): void {
    this.triesToWin = -1;
    this.output = 'Spiel vorbei!';
    this.reason = GameOverReason.USER_GAVE_UP;
    this.gameOver = true;
    this.modalShown = true;
  }

  win(tries: number): void {
    this.triesToWin = tries;
    this.output = `Richtig! (${tries} Versuche)`;
    this.reason = GameOverReason.USER_WON;
    this.gameOver = true;
    this.modalShown = true;
  }

  lose(): void {
    this.triesToWin = -1;
    this.output = 'Spiel vorbei!';
    this.reason = GameOverReason.USER_LOST;
    this.gameOver = true;
    this.modalShown = true;
  }

  submit(): void {
    if (this.gameOver) return;
    // try to submit word
    if (this.activeWord?.length === 5) {
      const word = this.activeWord;
      if (this.dictionary.contains(word)) {
        // valid word
        if (this.activeRow < this.numWords) {
          // go to next word
          this.activeRow += 1;
        }
        if (word === this.targetWord) {
          this.win(this.activeRow);
        } else if (this.activeRow === this.numWords) {
          this.lose();
        }
      } else {
        this.output = `Unbekanntes Wort: ${this.activeWord}`;
      }
    }
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
    width: 92px;
  }
}

.modal-button-row {
  display: flex;
  justify-content: flex-end;
  & button {
    color: white;
  }
}

button {
  margin: 5px;
  border: 2px solid #000000;
  background-color: #ffffff;
  padding: 6px 8px;
  font-size: 16px;
  border-radius: 10px;
  transition: all .05s linear;
  cursor: pointer;
  &[disabled] {
    cursor: default;
    border-color: #cfd8dc;
  }
  &:hover:not([disabled]) {
    background-color: #cfd8dc;
  }
  &.submit-button {
    background-color: #558b2f;
    color: #ffffff;
    &:hover {
      background-color: #8bc34a;
    }
  }
  &.text {
    border: none;
    background: none;
    &:hover {
      background-color: rgba(139, 195, 74, 0.5);
    }
  }
}

.info-text {
  margin: 4px;
}

.explainer-box {
  display: flex;
  align-items: center;
  text-align: left;
  & div {
    flex: 0 0 auto;
  }
  & p {
    margin: 0;
    padding: 10px;
  }
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
