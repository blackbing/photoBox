require [
  'module'
  'photoBox'
], (module, PhotoBox)->

  photoBox = new PhotoBox()

  $('#show').click(->
    photoBox.open()
  )



