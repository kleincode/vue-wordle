<template>
    <div class="letter-box" :class="'state-' + state">
        {{ letter }}
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({})
export default class LetterBox extends Vue {
    @Prop({ type: String, default: '' }) readonly letter!: string;

    @Prop({ type: Number, default: 0 }) readonly state!: number;
}
</script>
<style lang="scss" scoped>

.letter-box {
    width: 54px;
    height: 54px;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    font-size: 40px;
    text-align: center;
    line-height: 54px;
    margin: 5px;
    text-transform: uppercase;
    transition: all .4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    box-shadow: 1px 1px 5px rgba(1, 1, 1, 0.4);

    &.state-1 {
        background-color: grey;
        color: white;
        text-shadow: 0 0 2px #000000;
    }
    &.state-2 {
        background: linear-gradient(#fbc02d, #fdd835, #fbc02d);
        color: white;
        text-shadow: 0 0 2px #000000;
    }
    &.state-3 {
        background: linear-gradient(#7cb342, #8bc34a, #7cb342);
        color: white;
        text-shadow: 0 0 2px #000000;
    }
}

@media only screen and(max-width: 350px) {
    .letter-box {
        width: calc(20vw - 8px);
        height: calc(20vw - 8px);
        line-height: calc(20vw - 8px);
        margin: 2px;
        font-size: 32px;
    }
}

</style>
