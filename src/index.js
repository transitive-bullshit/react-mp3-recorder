/**
 * @class Recorder
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import vmsg from './vmsg'

import micIcon from './mic-icon-white.svg'
import vmsgWASMBase64 from './vmsg.wasm'

import styles from './styles.css'

const shimURL = 'https://unpkg.com/wasm-polyfill.js@0.2.0/wasm-polyfill.js'

function toArrayBuffer (base64Data) {
  const isBrowser = typeof window !== 'undefined' && typeof window.atob === 'function'
  const binary = isBrowser ? window.atob(base64Data) : Buffer.from(base64Data, 'base64').toString('binary')
  const bytes = new Uint8Array(binary.length)

  for (var i = 0; i < binary.length; ++i) {
    bytes[i] = binary.charCodeAt(i)
  }

  return bytes.buffer
}

export default class Recorder extends Component {
  static propTypes = {
    recorderParams: PropTypes.object,
    onRecordingComplete: PropTypes.func,
    onRecordingError: PropTypes.func,
    className: PropTypes.string
  }

  static defaultProps = {
    recorderParams: { },
    onRecordingComplete: () => { },
    onRecordingError: () => { }
  }

  state = {
    isRecording: false
  }

  _recorder = null
  static _wasmURL

  componentDidMount() {
    if (!Recorder._wasmURL) {
      // for ease of use, we embed the vmsg.wasm file directly via base64-encoding.
      // the first time the recorder is instantiated, we convert it into a wasm-
      // compatible binary URL that vmsg's webworker can parse.
      const source = vmsgWASMBase64.substring('data:application/wasm;base64,'.length)
      const buffer = toArrayBuffer(source)
      const blob = new window.Blob([ buffer ], { type: 'application/wasm' })
      const wasmURL = window.URL.createObjectURL(blob)
      Recorder._wasmURL = wasmURL
    }
  }

  componentWillUnmount() {
    this._cleanup()
  }

  render() {
    const {
      recorderParams,
      onRecordingComplete,
      onRecordingError,
      className,
      ...rest
    } = this.props

    return (
      <div
        className={classNames(styles.container, className)}
        {...rest}
      >
        <div
          className={styles.button}
          onMouseDown={this._onMouseDown}
          onMouseUp={this._onMouseUp}
        >
          <img src={micIcon} width={24} height={24} />
        </div>
      </div>
    )
  }

  _cleanup() {
    if (this._recorder) {
      this._recorder.stopRecording()
      this._recorder.close()
      delete this._recorder
    }
  }

  _onMouseDown = () => {
    const {
      recorderParams
    } = this.props

    this._cleanup()

    this._recorder = new vmsg.Recorder({
      wasmURL: Recorder._wasmURL,
      shimURL,
      ...recorderParams
    })

    this._recorder.init()
      .then(() => {
        this._recorder.startRecording()
        this.setState({ isRecording: true })
      })
      .catch((err) => this.props.onRecordingError(err))
  }

  _onMouseUp = () => {
    if (this._recorder) {
      this._recorder.stopRecording()
        .then((blob) => this.props.onRecordingComplete(blob))
        .catch((err) => this.props.onRecordingError(err))
    }
  }
}
