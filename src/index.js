/**
 * @class Recorder
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import vmsg from 'vmsg'

import MicIcon from 'material-ui/svg-icons/av/mic'

import styles from './styles.css'

export default class Recorder extends Component {
  static propTypes = {
    wasmURL: PropTypes.string.isRequired,
    shimURL: PropTypes.string,
    recorderParams: PropTypes.object,
    onRecordingComplete: PropTypes.func,
    onRecordingError: PropTypes.func,
    className: PropTypes.string
  }

  static defaultProps = {
    shimURL: 'https://unpkg.com/wasm-polyfill.js@0.2.0/wasm-polyfill.js',
    recorderParams: { },
    onRecordingComplete: () => { }
  }

  state = {
    isRecording: false
  }

  _recorder = null

  componentWillUnmount() {
    this._cleanup()
  }

  render() {
    const {
      wasmURL,
      shimURL,
      recorderParams,
      onRecordingComplete,
      onRecordingError,
      className,
      ...rest
    } = this.props

    return (
      <div
        className={classNames(styles.button, className)}
        onMouseDown={this._onMouseDown}
        onMouseUp={this._onMouseUp}
        {...rest}
      >
        <MicIcon color='#fff' />
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
      wasmURL,
      shimURL,
      recorderParams
    } = this.props

    this._cleanup()

    this._recorder = new vmsg.Recorder({
      ...recorderParams,
      wasmURL,
      shimURL
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
