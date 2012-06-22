require [
  'module'
  'photoBox'
], (module, PhotoBox)->

  $.fn.photoBox = ()->
    $el = @
    data = []

    $el.each((idx, val)->
      data.push(
        thumb: $(val).find('img').attr('src')
        original: $(val).attr('href')
      )
    ).on('click', (event)->
      idx = $el.index(@)
      photoBox.open(idx)
      event.preventDefault()
    )


    photoBox = new PhotoBox(data)


