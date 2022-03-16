import german5 from './german5';

class Dictionary {
    readonly dictStr = german5;

    readonly wordLength = 5;

    readonly numWords: number;

    constructor() {
      if (this.dictStr.length % this.wordLength !== 0) {
        throw new Error('Dictionary length is not multiple of 5');
      }
      this.numWords = Math.floor(this.dictStr.length / this.wordLength);
    }

    private getWord(i: number): string {
      if (i < 0 || i >= this.numWords) return '';
      return this.dictStr.substring(5 * i, 5 * (i + 1));
    }

    check(searchString: string): boolean {
      // binary search
      let l = 0; let
        r = this.numWords;
      do {
        const i = Math.floor((l + r) / 2);
        const iWord = this.getWord(i);
        const cmp = searchString.localeCompare(iWord);
        if (cmp < 0) {
          // search string comes before i word
          r = i;
        } else if (cmp > 0) {
          // search string comes after i word
          l = i;
        } else {
          return true;
        }
      } while (l < r);
      // l = r and word at r/l is not equal to search string --> search string is not in dictionary
      return false;
    }
}

export default Dictionary;
