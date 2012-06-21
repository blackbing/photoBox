require [
  'module'
  'photoBox'
], (module, PhotoBox)->

  photoBox = new PhotoBox()


  $('#show').text('show photoBox')
  .click(->
    photoBox.open()
  )



