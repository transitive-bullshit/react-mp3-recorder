import React, { Component } from 'react'

import Recorder from 'react-mp3-recorder'
import ReactAudioPlayer from 'react-audio-player'

import blobToBuffer from 'blob-to-buffer'
import ribbon from './ribbon.png'

export default class App extends Component {
  state = {
    url: ''
  }

  render () {
    const {
      url
    } = this.state

    return (
      <div>
        <a href='https://github.com/transitive-bullshit/react-mp3-recorder'>
          <img
            src={ribbon}
            alt='Fork me on GitHub'
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              border: 0
            }}
          />
        </a>

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
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  _onRecordingComplete = (blob) => {
    blobToBuffer(blob, (err, buffer) => {
      if (err) {
        console.error(err)
        return
      }

      console.log('recording', blob)

      if (this.state.url) {
        window.URL.revokeObjectURL(this.state.url)
      }

      this.setState({
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
