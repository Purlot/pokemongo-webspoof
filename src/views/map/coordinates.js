import React from 'react'
import { action, observable } from 'mobx'
import { observer } from 'mobx-react'

import userLocation from '../../models/user-location.js'

const handleChange = (idx) => action(({ target: { value } }) => {
  userLocation[idx] = parseFloat(value)
})

const isValidLocation = /^\s*([-+]?\d{1,2}([.]\d+)?),\s*([-+]?\d{1,3}([.]\d+)?)\s*$/
const buttonText = observable('Spoof!')
const coordBox = observable('')

const toRad = (ang) => ang / 180 * Math.PI

const distBetweenCoords = (coordA, coordB) => {
  const [latA, lngA] = [toRad(coordA[0]), toRad(coordA[1])]
  const [latB, lngB] = [toRad(coordB[0]), toRad(coordB[1])]
  const deltaLat = latA - latB
  const deltaLng = lngA - lngB
  const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(latA) * Math.cos(latB) * Math.sin(deltaLng / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = c * 6371
  return d
}

const parseCoord = (coord) => coord.split(',').map(x => parseFloat(x.trim()))

const updateCoord = (val) => {
  coordBox.set(val)
  if (isValidLocation.test(val)) {
    const dist = distBetweenCoords(parseCoord(val), userLocation)
    buttonText.set(`${dist.toFixed(2)}km`)
  } else {
    buttonText.set('Spoof!')
  }
}

const handleCoordChange = () => action(({ target: { value } }) => updateCoord(value))

const handleCoordSubmit = () => action(() => {
  const coord = coordBox.get()
  if (isValidLocation.test(coord)) {
    userLocation.replace(parseCoord(coord))
    buttonText.set('Spoof!')
  }
})

const Coordinates = observer(() =>
  <div className='clearfix coordinates'>
    <div className='input-group'>
      {['lat', 'lng'].map((_, idx) =>
        <input
          key={idx}
          type='text'
          className='pull-xs-left form-control'
          placeholder={userLocation[idx]}
          aria-describedby='basic-addon1'
          value={userLocation[idx]}
          onChange={handleChange(idx)} />
      )}
    </div>
    <div className='input-group'>
      <input
        type='text'
        className='spoof-coord-box form-control'
        onChange={handleCoordChange()}
        value={coordBox.get()}
        placeholder={`${userLocation[0]},${userLocation[1]}`} />
      <button
        type='button'
        className='btn btn-primary spoof-button'
        onClick={handleCoordSubmit()}>
        {buttonText.get()}
      </button>
    </div>
  </div>
)

export default { Coordinates, updateCoord, isValidLocation, parseCoord }
