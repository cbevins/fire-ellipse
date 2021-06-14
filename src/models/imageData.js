/**
 * Methods for getting/setting <canvas> imageData
 * All methods take an 'img' argument, which is the value returned by:
 *  const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
 *
 */

export function channelPixelCount (img, channel, value) {
  let n = 0
  for (let p = 0; p < img.data.length; p += 4) {
    if (img.data[p+channel] === value) n++
  }
  return n
}

// Returns the value of the r, g, b, or a channel at col x, row y of img
export function getChannel (img, x, y, c) {
  return img.data[((y * (img.width * 4)) + (x * 4)) + c]
}

// Returns the {r, g, b, a} at col x, row y of img
export function getRgba (img, x, y, c) {
  const i = (y * (img.width * 4)) + (x * 4)
  return {r: img.data[i], g: img.data[i+1], b: img.data[i+2], a: img.data[i+3]}
}

// Returns the value of the red channel at col x, row y of img
export function getRed (img, x, y) { return getChannel(img, x, y, 0) }

// Returns the value of the green channel at col x, row y of img
export function getGreen (img, x, y) { return getChannel(img, x, y, 1) }

// Returns the value of the blue channel at col x, row y of img
export function getBlue (img, x, y) { return getChannel(img, x, y, 2) }

// Returns the value of the alpha channel at col x, row y of img
export function getAlpha (img, x, y) { return getChannel(img, x, y, 3) }

// Sets the value of the red, green, blue, or alpha channel at col x, row y of img
export function setChannel (img, x, y, c, value) {
  img.data[((y * (img.width * 4)) + (x * 4)) + c] = value
}

// Sets the value of the red, green, blue, and alpha channels at col x, row y of img
export function setRgba (img, x, y, obj) {
  const i = 4 * (x + y * img.width)
  img.data[i+0] = obj.r
  img.data[i+1] = obj.g
  img.data[i+2] = obj.b
  img.data[i+3] = obj.a
}

// Sets the value of the red channel at col x, row y of img
export function setRed (img, x, y, value) { return setChannel(img, x, y, 0, value) }

// Sets the value of the green channel at col x, row y of img
export function setGreen (img, x, y, value) { return setChannel(img, x, y, 1, value) }

// Sets the value of the blue channel at col x, row y of img
export function setBlue (img, x, y, value) { return setChannel(img, x, y, 2, value) }

// Sets the value of the alpha channel at col x, row y of img
export function setAlpha (img, x, y, value) { return setChannel(img, x, y, 3, value) }

// From svelte tutorial to dynamically update canvas bitmap
export function updateImageData (canvas, ctx) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  let n = 0
  for (let p = 0; p < imageData.data.length; p += 4) {
    const i = p / 4
    const x = i % canvas.width
    const y = i / canvas.height >>> 0

	  // const r = 64 + (128 * x / canvas.width) + (64 * Math.sin(t / 1000))
	  // const g = 64 + (128 * y / canvas.height) + (64 * Math.cos(t / 1000))
	  // const b = 128;

	  // imageData.data[p + 0] = r
	  // imageData.data[p + 1] = g
	  // imageData.data[p + 2] = b
	  // imageData.data[p + 3] = 255
    // ctx.putImageData(imageData, 0, 0)
  }
}

// -----------------------------------------------------------------------------
// Higher order constants and methods for fire modeling
// -----------------------------------------------------------------------------

export const burned = 127 // red value for pixels ignited during previous time steps
export const burning = 255 // red value for pixels ignited at the current time step
export const unburned = 0 // red value for unignited pixels

const unburnableMin = 64
const unburnableMax = 80
export const snow = 64 // unburnable: snow-field, ice-field
export const rock = 65 // unburnable: rock, talus
export const water = 66 // unburnable: water
export const paved = 67 // unburnable: pavement, concrete
export const roadway = 68 // unburnable: pavement, gravel
export const fireline = 69 // unburnable: constructed fireline, hoseline, retardant

export const burnedRgba = `rgba(${burned}, 0, 0, 10)`
export const burningRgba = `rgba(${burning}, 0, 0, 10)`
export const unburnedRgba = `rgba(${unburned}, 255, 0, 10)`

export function isBurnable (img, x, y) {
  const red = getRed(img, x, y)
  return red < unburnableMin || red > unburnableMax
}

export function isBurned (img, x, y) { return getRed(img, x, y) === burned }

export function isBurnedOrBurning (img, x, y) {
  if (x<0 || y < 0 || x>=img.width || y>= img.height) return false
  const v = getRed(img, x, y)
  return v === burned || v === burning
}

export function isBurning (img, x, y) { return getRed(img, x, y) === burning }

export function isUnburnable (img, x, y) {
  const red = getRed(img, x, y)
  return red >= unburnableMin && red <= unburnableMax
}

export function isUnburned (img, x, y) { return getRed(img, x, y) === unburned }

export function setBurned (img, x, y) { setChannel(img, x, y, burned)}
export function setBurning (img, x, y) { setChannel(img, x, y, burning)}
export function setUnburned (img, x, y) { setChannel(img, x, y, unburned)}

// Returns number of burning pixels
export function burnedPixelCount (img) { return channelPixelCount(img, 0, burned) }
export function burningPixelCount (img) { return channelPixelCount(img, 0, burning) }

// Finds all unburned, burnable pixels adjacent to burning or burned pixels
export function burnableAdjacentPixels (img) {
  const pixels = []
  for (let y=0; y<img.height; y++) {
    for (let x=0; x<img.width; x++) {
      if (isUnburned(img, x, y) && isBurnable(img, x, y)) {
        if (isBurnedOrBurning(img, x+1, y) // east pixels
          || isBurnedOrBurning(img, x-1, y) // west pixel
          || isBurnedOrBurning(img, x, y+1) // south pixel
          || isBurnedOrBurning(img, x, y-1) // north pixel
          || isBurnedOrBurning(img, x+1, y+1) // se pixel, 8-way
          || isBurnedOrBurning(img, x+1, y-1) // ne pixel, 8-way
          || isBurnedOrBurning(img, x-1, y+1) // sw pixel 8-way
          || isBurnedOrBurning(img, x-1, y-1) // nw pixel
        ) adjacentPixels.push([x,y])
      }
    }
  }
  return pixels
}