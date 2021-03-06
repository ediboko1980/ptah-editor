<template>
  <div class="b-picker">
    <div class="b-picker__row">
      <div class="b-picker__label">
        <base-label v-if="label !== ''">
          {{ label }}
        </base-label>
      </div>

      <slot />
      <slot name="buttons" />

      <BaseDropdownMenu
        class="b-picker__palette"
        positionDropdown="right"
      >
        <div class="b-picker__preview"
          :style="{ 'background-color': pickerValue.rgba || pickerValue }"
          :class="{ 'b-picker__preview_transparent': isTransparent }"
          :title="pickerValue.rgba || pickerValue || 'Choose color'"
          tooltip="Pick a color"
          tooltip-position="left"
        />
        <div slot="list">
          <Sketch
            :value="pickerValue"
            @input="changeColor"
            :presetColors="palette"
          />
        </div>
      </BaseDropdownMenu>
    </div>
  </div>
</template>

<script>
import { Sketch } from 'vue-color'
import { mapGetters } from 'vuex'

const DEFAULT_COLOR = 'rgba(0,0,0,1)'
const DEFAULT_PALETTE_COLORS = [
  'rgba(0,0,0,1)',
  'rgba(155,155,155,1)',
  'rgba(255,255,255,1)',
  'rgba(0,0,0,0)'
]

export default {
  name: 'BaseColorPicker',
  model: {
    prop: 'value',
    event: 'change'
  },
  components: {
    Sketch
  },
  props: {
    value: {
      default: DEFAULT_COLOR
    },
    label: {
      type: String
    }
  },
  computed: {
    ...mapGetters(['colorsPalette']),

    palette () {
      return [...new Set(this.colorsPalette.concat(DEFAULT_PALETTE_COLORS))]
    },

    isTransparent () {
      let isOpacity = false

      if (this.pickerValue && this.pickerValue.indexOf('0)') !== -1) {
        isOpacity = true
      }

      if (this.pickerValue.rgba && this.pickerValue.rgba.indexOf('0)') !== -1) {
        isOpacity = true
      }

      if (this.pickerValue === '') {
        isOpacity = true
      }

      return isOpacity
    }
  },
  watch: {
    value (value) {
      this.pickerValue = this.getPreparedValue(this.value)
    }
  },
  data () {
    return {
      expanded: false,
      pickerValue: this.getPreparedValue(this.value)
    }
  },
  methods: {
    getPreparedValue (value) {
      if (typeof value === 'object' && !!value.rgba) {
        const color = Object.values(value.rgba).toString()
        return `rgba(${color})`
      }
      return value
    },
    changeColor (color) {
      this.$emit('change', color)
    }
  }
}
</script>

<style lang="sass" scoped="">
@import '../../assets/sass/_colors.sass'
@import '../../assets/sass/_variables.sass'

.b-picker
  position: relative
  width: 100%
  // max-width: 24rem
  &__row
    display: flex
    justify-content: space-between
    align-items: center

    width: 100%
  &__preview
    width: 2rem
    height: 2rem

    border-radius: 1rem
    background-color: $white
    border: 2px solid $ligth-grey

    margin: 0 0 0 1.6rem
    &_transparent
      background-image: url(https://cdn.ptah.pro/prod/5ee8d62d480c4e00018c404d/ff83fe5c-d7eb-42e9-a92b-e352785b1049.png)
      width: 2rem
      height: 2rem
      background-size: 100%
    &:hover
      border-color: $main-green
  &__label
    width: 100%
    max-width: 16rem
    margin-right: $size-step/2
    overflow: hidden
    text-overflow: ellipsis
    &:first-letter
      text-transform: uppercase
  &__palette
    margin-top: 0
  &_color-hover
    /deep/
      .b-pth-base-dropdown-menu__list
        &:before
         margin-left: 10.8rem
        &:after
         margin-left: 10.8rem
      .b-pth-base-dropdown-menu__dropdown
        &_left
          left: -12.5rem !important

/deep/
  .b-pth-base-dropdown-menu__dropdown
    width: $size-step*7.5 !important
    max-height: none !important
    box-shadow: 0px 0 8rem rgba($black, 0.15) !important
    &_right
      right: -2.2rem !important
      padding: 0 0 1rem 0 !important

  .vc-sketch
    box-shadow: none

    //margin: 1.6rem

    background: $white none
    border: none

    //transform: scale(1.155)
    border-radius: 0.2rem !important
  .vc-sketch *
    border-radius: 0.2rem !important
  .vc-sketch-field
    .vc-input__input
      font-size: 1.4rem
      box-shadow: none !important
      border-bottom: 1px solid rgba($black, 0.15)
      padding: $size-step/4 0
    .vc-input__label
      color: $grey-middle
      text-align: left
  .vc-sketch-presets
    border-top: none
  .vc-sketch-color-wrap
    display: none

</style>
