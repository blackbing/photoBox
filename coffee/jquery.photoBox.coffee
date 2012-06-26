define [
  'module'
  './photoBox'
], (module, PhotoBox)->

  $.fn.photoBox = (opts)->
    $el = @
    data = []

    $el.each((idx, val)->

      thumb = if opts? and opts.thumb? then opts.thumb.call(@) else $(@).find('img').attr('src')
      original= if opts? and opts.original? then opts.original.call(@) else $(@).attr('href')

      #console.log thumb, original

      data.push(
        thumb: thumb
        original: original
      )
    ).on('click', (event)->
      idx = $el.index(@)
      photoBox.open(idx)
      event.preventDefault()
    )


    photoBox = new PhotoBox(data)


