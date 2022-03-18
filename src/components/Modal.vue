<template>
  <div
    ref="modal"
    class="modal"
    :class="shown ? 'shown' : ''"
    @click="onModalClick($event)"
  >
    <div class="modal-content">
      <div class="modal-header">
        <span
          class="close"
          @click="shown = false"
        >&times;</span>
        <slot name="header" />
      </div>
      <div class="modal-body">
        <slot name="body" />
      </div>
      <div class="modal-footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, Ref } from 'vue-property-decorator';

@Options({})
export default class Modal extends Vue {
  @Prop({ type: Boolean, default: false }) readonly modelValue!: boolean;

  @Ref() readonly modal!: HTMLDivElement;

  get shown(): boolean {
    return this.modelValue;
  }

  set shown(value: boolean) {
    this.$emit('update:modelValue', value);
  }

  onModalClick($event: MouseEvent): void {
    if ($event.target === this.modal) {
      this.shown = false;
    }
  }
}
</script>

<style lang="scss" scoped>

  $border-radius: 10px;

  /* The Modal (background) */
  .modal {
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
    opacity: 0;
    &.shown {
      display: block;
      opacity: 1;
      animation-name: fadein;
      animation-duration: 0.4s;
    }
  }

  @keyframes fadein {
    from {opacity: 0}
    to {opacity: 1}
  }

  /* Modal Header */
  .modal-header {
    padding: 2px 16px;
    background-color: #558b2f;
    color: white;
    border-radius: $border-radius $border-radius 0 0;
  }

  /* Modal Body */
  .modal-body {
    padding: 2px 16px;
    background-color: #fefefe;
  }

  /* Modal Footer */
  .modal-footer {
    padding: 2px 16px;
    background-color: #558b2f;
    color: white;
    border-radius: 0 0 $border-radius $border-radius;
  }

  /* Modal Content */
  .modal-content {
    position: relative;
    margin: 20px auto;
    padding: 0;
    border: 1px solid #888;
    width: 450px;
    max-width: calc(100vw - 20px);
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
    animation-name: animatetop;
    animation-duration: 0.4s;
    border-radius: $border-radius;
  }

  /* Add Animation */
  @keyframes animatetop {
    from {top: -300px;}
    to {top: 0;}
  }

  /* The Close Button */
  .close {
    color: #eee;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
</style>
