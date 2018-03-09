/**
 * @class RecordingAnimation
 */

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import now from 'performance-now'
import { findDOMNode } from 'react-dom'
import raf from 'raf'

const NUM_PARTICLES = 20

export default class RecordingAnimation extends PureComponent {
  static propTypes = {
    size: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number
    }).isRequired
  }

  componentDidMount() {
    this._reset()
  }

  componentWillUnmount() {
    raf.cancel(this._tickRaf)
  }

  render() {
    const {
      size,
      ...rest
    } = this.props

    return (
      <canvas
        ref={this._canvasRef}
        width={size.width}
        height={size.height}
        {...rest}
      />
    )
  }

  _canvasRef = (ref) => {
    this._canvas = ref
  }

  _tick = () => {
    this._update()
    this._draw()

    this._tickRaf = raf(this._tick)
  }

  _update() {
    for (let i = 0; i < this._particles.length; ++i) {
      let y = this._particles[i]
      this._particles[i] = Math.max(0, Math.min(1, y + (0.01 - Math.random() * 0.02)))
    }
  }

  _draw() {
    if (!this._canvas) return
    const canvas = findDOMNode(this._canvas)
    if (!canvas) return

    const delta = now() - this._start

    const {
      width,
      height
    } = this.props.size

    const ctx = canvas.getContext('2d')
    const n = this._particles.length

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.fillRect(0, 0, width, height)

    ctx.lineWidth = 1.0
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)'

    ctx.beginPath()
    ctx.moveTo(0, this._particles[0] * height)

    for (let i = 1; i < n; ++i) {
      const x = i * width / n
      const y = Math.abs(Math.sin(delta / 10000 + i)) * this._particles[i] * height

      ctx.lineTo(x, y)
    }

    ctx.stroke()
  }

  _reset() {
    const particles = []

    for (let i = 0; i < NUM_PARTICLES; ++i) {
      particles.push(Math.random())
    }

    this._start = now()
    this._particles = particles
    this._tick()
  }
}
