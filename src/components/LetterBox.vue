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
    width: 50px;
    height: 50px;
    border: 2px solid #000000;
    border-radius: 5px;
    font-weight: 600;
    font-size: 40px;
    text-align: center;
    margin: 5px;
    text-transform: uppercase;

    &.state-1 {
        background-color: grey;
        color: white;
        text-shadow: 0 0 2px #000000;
    }
    &.state-2 {
        background-color: #fbc02d;
        color: white;
        text-shadow: 0 0 2px #000000;
    }
    &.state-3 {
        background-color: green;
        color: white;
        text-shadow: 0 0 2px #000000;
    }
}

</style>
