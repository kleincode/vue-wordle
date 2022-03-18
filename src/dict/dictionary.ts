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
      const target = searchString.toLocaleLowerCase();
      // binary search
      let l = 0;
      let r = this.numWords - 1;
      while (l <= r) {
        const i = Math.floor((l + r) / 2);
        const iWord = this.getWord(i);
        const cmp = target.localeCompare(iWord);
        if (cmp < 0) {
          // search string comes before i word
          r = i - 1;
        } else if (cmp > 0) {
          // search string comes after i word
          l = i + 1;
        } else {
          return true;
        }
      }
      // l = r and word at r/l is not equal to search string --> search string is not in dictionary
      return false;
    }

    getRandomWord(): string {
      const index = Math.floor(Math.random() * this.numWords);
      return this.dictStr.substring(this.wordLength * index, this.wordLength * (index + 1));
    }
}

export default Dictionary;
