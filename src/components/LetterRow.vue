<template>
    <div class="letter-row" :class="active ? 'active' : ''">
        <LetterBox v-for="i in 5" :key="i" :letter="i - 1 < word.length ? word[i - 1] : ''"
        :state="states[i - 1]" />
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import LetterBox from './LetterBox.vue';

@Options({
  components: {
    LetterBox,
  },
})
export default class LetterRow extends Vue {
    @Prop(Boolean) readonly active!: boolean;

    @Prop(Boolean) readonly complete!: boolean;

    @Prop({ type: String, default: '' }) readonly word!: string;

    @Prop(String) readonly targetWord!: string;

    states: number[] = [0, 0, 0, 0, 0];

    // returns the number of occurences of targetChar in searchString
    static count(targetChar: string, searchString: string): number {
      return (searchString.match(new RegExp(targetChar, 'g')) || []).length;
    }

    @Watch('complete')
    @Watch('word')
    @Watch('targetWord')
    onStateChange(): void {
      if (this.complete) {
        this.states = [1, 1, 1, 1, 1];
        // number at index i indicates the index of targetWord[i] in word
        const markedLetters = [-1, -1, -1, -1, -1];
        // iterate over target word (!)
        for (let i = 0; i < 5; i += 1) {
          if (this.targetWord[i] === this.word[i]) {
            // mark as exact match
            this.states[i] = 3;
            markedLetters[i] = i;
          }
        }
        // iterate over target word again and check for misplaced letters
        for (let i = 0; i < 5; i += 1) {
          if (markedLetters[i] < 0) {
            // iterate over word letters
            for (let j = 0; j < 5; j += 1) {
              if (this.word[j] === this.targetWord[i] && !markedLetters.includes(j)) {
                this.states[j] = 2;
                markedLetters[i] = j;
                break;
              }
            }
          }
        }
      } else {
        this.states = [0, 0, 0, 0, 0];
      }
    }
}
</script>
<style lang="scss" scoped>

.letter-row {
    display: flex;
    justify-content: center;
    &.active > * {
      box-shadow: 1px 1px 5px rgba(1, 1, 1, 0.4), inset 0 0 5px #81d4fa;
    }
}

</style>
