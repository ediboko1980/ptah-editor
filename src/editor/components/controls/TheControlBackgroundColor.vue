<script>
import { mapState } from 'vuex'
import { getPseudoTemplate, randomPoneId } from '../../util'

export default {
  data () {
    return {
      bgColor: '',
      bgColorHover: '',
      label: '',
      labelHover: ''
    }
  },

  created () {
    this.bgColor = this.styles['background-color']

    if (this.settingObjectType !== 'button') {
      this.label = this.$t('c.background')
    } else {
      this.label = this.$t('c.buttonColor')
      this.labelHover = this.$t('c.bgHover')
    }

    if (this.settingObjectType === 'button') {
      const pBackgroundColor = this.pseudo['hover']['background-color'].split('!')[0]
      this.bgColorHover = pBackgroundColor || this.styles['background-color']
    }
  },

  computed: {
    ...mapState('Sidebar', [
      'settingObjectOptions',
      'settingObjectElement',
      'settingObjectType'
    ]),

    styles () {
      return this.settingObjectOptions.styles
    },

    pseudo () {
      return this.settingObjectOptions.pseudo
    }

  },

  methods: {
    changeColor () {
      const color = this.bgColor.rgba ? `rgba(${Object.values(this.bgColor.rgba).toString()})` : this.bgColor

      this.styles['background-color'] = color
      this.settingObjectOptions.customColor = true
    },

    changeHoverBgColor () {
      const color = this.bgColorHover.rgba ? `rgba(${Object.values(this.bgColorHover.rgba).toString()})` : this.bgColorHover
      this.changePseudo('background-color', color)
    },

    changePseudo (attr, style, pseudoClass = 'hover') {
      if (style !== '') {
        this.changePseudoStyle(attr, style + ' !important')
        this.pseudo[pseudoClass][attr] = style + ' !important'
      }
    },

    changePseudoStyle (attr, style, pseudoClass = 'hover') {
      const poneId = this.settingObjectElement.id || randomPoneId()
      let el = document.querySelector(`style[id=${poneId}-style]`)
      let styleTemplate = getPseudoTemplate(poneId, this.settingObjectOptions.pseudo)

      this.pseudo[pseudoClass][attr] = style
      this.settingObjectElement.dataset.pone = poneId

      if (el) {
        el.remove()
      }

      document.head.insertAdjacentHTML('beforeend', styleTemplate)
      this.settingObjectOptions.customColor = true
    }
  }
}
</script>

<template>
  <div>
    <div class="b-panel__col">
      <div class="b-panel__control">
        <base-color-picker
          :label="label"
          v-model="bgColor"
          @change="changeColor"
        />
      </div>
      <div class="b-panel__control" v-if="settingObjectType === 'button'">
        <base-color-picker
          :label="labelHover"
          v-model="bgColorHover"
          @change="changeHoverBgColor"
        />
      </div>
    </div>
  </div>
</template>
