import React, { Component } from 'react'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Recorder from 'react-mp3-recorder'
import ReactAudioPlayer from 'react-audio-player'

import getMP3Duration from 'get-mp3-duration'
import blobToBuffer from 'blob-to-buffer'

import wasmURL from './vmsg.wasm'

export default class App extends Component {
  state = {
    duration: 0,
    url: ''
  }

  render () {
    const {
      duration,
      url
    } = this.state

    return (
      <MuiThemeProvider>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            minHeight: '100vh'
          }}
        >
          <div>
            <Recorder
              wasmURL={wasmURL}
              onRecordingComplete={this._onRecordingComplete}
              onRecordingError={this._onRecordingError}
              style={{
                margin: '0 auto'
              }}
            />

            <p>
              Click and hold to start recording.
            </p>

            {url && (
              <div>
                <ReactAudioPlayer
                  src={url}
                  controls
                  style={{
                    minWidth: '500px'
                  }}
                />

                <p>
                  Recording duration: {duration} ms.
                </p>
              </div>
            )}
          </div>
        </div>
      </MuiThemeProvider>
    )
  }

  _onRecordingComplete = (blob) => {
    blobToBuffer(blob, (err, buffer) => {
      if (err) {
        console.error(err)
        return
      }

      const duration = getMP3Duration(buffer)
      console.log('recording', blob, duration, 'ms')

      if (this.state.url) {
        window.URL.revokeObjectURL(this.state.url)
      }

      this.setState({
        duration,
        url: window.URL.createObjectURL(blob)
      })
    })
  }

  _onRecordingError = (err) => {
    console.log('error recording', err)

    if (this.state.url) {
      window.URL.revokeObjectURL(this.state.url)
    }

    this.setState({ url: null })
  }
}
