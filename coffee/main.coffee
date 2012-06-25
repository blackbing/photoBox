require [
  'module'
  'jquery.photoBox'
], (module)->


  $('.imageRow a').photoBox(
    thumb : ->
      return $(@).find('img').attr('src')
    original: ->
      return $(@).attr('href')
  )

