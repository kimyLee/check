/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Bitmap input field.
 * @author gregoryc@outlook.com (Greg Cannon)
 */

import Blockly from 'blockly/core'
import { openModalOfLightColor } from '@/lib/blockly/blockly-use-vuex/index'

export const DEFAULT_HEIGHT = 4
export const DEFAULT_WIDTH = 5
const PIXEL_SIZE = 15
const FILLED_PIXEL_COLOR = '#363d80'
const EMPTY_PIXEL_COLOR = 'white'

/**
 * Field for inputting a small bitmap image.
 * Includes a grid of clickable pixels that's exported as a bitmap.
 */
export class FieldLight extends Blockly.Field {
  /**
   *Constructor for the bitmap field.
   * @param {!Array<!Array<number>>=} value 2D rectangular array of 1s and 0s.
   * @param {Function=} validator A function that is called to validate.
   * @param {!Object=} config Config A map of options used to
   * configure the field.
   */
  imgHeight_ = 0
  imgWidth_ = 0
  blockDisplayPixels_ = null as any
  constructor (value = undefined, validator = undefined, config: any = undefined) {
    super(value, validator, config)

    this.SERIALIZABLE = true

    this.imgHeight_ = DEFAULT_HEIGHT
    this.imgWidth_ = DEFAULT_WIDTH

    // Set a default empty value
    console.log(this.getValue(), 'init')
    if (this.getValue() === null) {
      this.setValue(this.getEmptyArray_())
    }

    /** References to UI elements */
    this.fieldGroup_ = null
    this.blockDisplayPixels_ = null

    /** Stateful variables */
  }

  /**
   * Constructs a FieldLight from a JSON arg object.
   * @param {!Object} options A JSON object with options.
   * @return {!FieldLight} The new field instance.
   * @package
   * @nocollapse
   */
  static fromJson (options: any) {
    console.log(options, '????')
    return new FieldLight(options && options.value, undefined, options)
  }

  /**
   * Validates that a new value meets the requirements for a valid bitmap array.
   * @param {*} newValue The new value to be tested.
   * @return {Object} The new value if it's valid, or null.
   */
  doClassValidation_ (newValue: any = undefined) {
    // ????????????????????????
    console.log('doClassValidation_', newValue)
    if (!newValue) {
      return null
    }
    // Check if the new value is an array
    if (!Array.isArray(newValue)) {
      return null
    }
    const newLength = newValue.length
    // The empty list is not an acceptable
    if (newLength !== 12) {
      return null
    }
    return newValue
  }

  /**
   * Called when a new value has been validated and is about to be set.
   * @param {*} newValue The value that's about to be set.
   */
  doValueUpdate_ (newValue: any) {
    console.log('doValueUpdate_', 233)
    super.doValueUpdate_(newValue)
    if (newValue) {
      const newHeight = newValue.length
      const newWidth = newValue[0] ? newValue[0].length : 0
      if (this.imgHeight_ !== newHeight || this.imgWidth_ !== newWidth) {
        this.imgHeight_ = newHeight
        this.imgWidth_ = newWidth
      }

      this.imgHeight_ = newValue.length
      this.imgWidth_ = newValue[0] ? newValue[0].length : 0
    }
  }

  /**
   * Show the bitmap editor dialog.
   * @param {!Event=} e Optional mouse event that triggered the field to
   *     open, or undefined if triggered programmatically.
   * @param {boolean=} _quietInput Quiet input.
   * @protected
   */
  showEditor_ (e = undefined, _quietInput = undefined) {
    console.log('showEditor_')
    openModalOfLightColor(this.getValue(), (val: any) => {
      this.setValue(val)
    })
    // ???????????? setValue
  }

  /**
   * Updates the block display and editor dropdown when the field re-renders.
   * @protected
   * @override
   */
  render_ () {
    console.log('render')
    super.render_()

    if (!this.getValue()) {
      return
    }

    const arr = this.getValue()

    for (let i = 0; i < this.blockDisplayPixels_.length; i++) {
      this.blockDisplayPixels_[i].style.fill = arr[i]
    }
  }

  /**
   * Determines whether the field is editable.
   * @return {boolean} True since it is always editable.
   */
  updateEditable () {
    return true
  }

  /**
   * Creates the bitmap editor and add event listeners.
   * @return {!Element} The newly created dropdown menu.
   * @private
   */
  dropdownCreate_ () {
    console.log('dropdownCreate_') // ?
  }

  /**
   * Initializes the on-block display.
   * @override
   */
  initView () {
    console.log('initView', this.getValue())
    this.blockDisplayPixels_ = []
    const position = [ // ?????????????????? PIXEL_SIZE = 15
      [15, 0], // ?????????????????????
      [35, 0],
      [50, 15],
      [50, 35],
      [35, 50],
      [15, 50],
      [0, 35],
      [0, 15],
    ]
    const positionCenter = [25, 25]
    const row = []
    for (let i = 0; i < position.length; i++) {
      console.log(position[i][0])
      const square = Blockly.utils.dom.createSvgElement(
        'circle',
        {
          cx: position[i][0] + 5,
          cy: position[i][1] + 5,
          r: PIXEL_SIZE / 2,
          fill: EMPTY_PIXEL_COLOR,
          fill_opacity: 1,
        },
        this.fieldGroup_,
      )
      row.push(square)
    }
    row.push(Blockly.utils.dom.createSvgElement(
      'circle',
      {
        cx: positionCenter[0] + 5,
        cy: positionCenter[1] + 5,
        r: PIXEL_SIZE * 0.75,
        fill: EMPTY_PIXEL_COLOR,
        fill_opacity: 1,
      },
      this.fieldGroup_,
    ))
    this.blockDisplayPixels_ = row
  }

  /**
   * Updates the size of the block based on the size of the underlying image.
   * @override
   * @protected
   */
  updateSize_ () {
    const newWidth = PIXEL_SIZE * this.imgWidth_
    const newHeight = PIXEL_SIZE * this.imgHeight_
    if (this.borderRect_) {
      this.borderRect_.setAttribute('width', String(newWidth))
      this.borderRect_.setAttribute('height', String(newHeight))
    }
    this.size_.width = 85
    this.size_.height = 60 // todo???newHeight???
  }

  /**
   * Disposes of events belonging to the bitmap editor.
   * @private
   */
  dropdownDispose_ () {
    console.log('dropdownDispose_')
  }

  /**
   * Constructs an array of zeros with the specified width and height.
   * @return {!Array<!Array<number>>}The new value.
   */
  getEmptyArray_ () {
    const newVal = Array(12).fill('#000000')
    return newVal
  }

  /**
   * Creates a new element with the specified type and class.
   * @param {string} elementType Type of html element.
   * @param {string} className ClassName of html element.
   * @return {!HTMLElement} The created element.
   */
  createElementWithClassname_ (elementType: any, className: any) {
    const newElt = document.createElement(elementType)
    newElt.className = className
    return newElt
  }

  // saveState (doFullSerialization) {
  //   const state = { lights: this.getValue() }
  //   // if (doFullSerialization) {
  //   //   // state.name = this.variable_.name
  //   //   // state.type = this.variable_.type
  //   // }
  //   console.log('saveState', state)
  //   return state
  // }

  // loadState (state) {
  //   console.log('loadState', state)
  //   // const variable = Blockly.Variables.getOrCreateVariablePackage(
  //   //   this.getSourceBlock().workspace,
  //   //   state.id,
  //   //   state.name, // May not exist.
  //   //   state.type) // May not exist.
  //   this.setValue(state.lights)
  // }

  // fromXml (fieldElement: any) { // ???????????????????????????
  //   this.setValue(fieldElement.textContent.split(','))
  // }
}

Blockly.fieldRegistry.register('field_light', FieldLight)

/**
 * CSS for bitmap field.
 */
// Blockly.Css.register(`
// .dropdownEditor {
//   align-items: center;
//   flex-direction: column;
//   display: flex;
//   justify-content: center;
//   margin-bottom: 20px;
// }
// .pixelContainer {
//   margin: 20px;
// }
// .pixelRow {
//   display: flex;
//   flex-direction: row;
//   padding: 0;
//   margin: 0;
//   height: ${PIXEL_SIZE}
// }
// .pixelButton {
//   width: ${PIXEL_SIZE}px;
//   height: ${PIXEL_SIZE}px;
//   border: 1px solid black;
// }
// .pixelDisplay {
//   white-space:pre-wrap;
// }
// .controlButton {
//   margin: 5px 0;
// }
// `)
