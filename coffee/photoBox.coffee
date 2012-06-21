define [
  'module'
  'photoBoxView'
], (module, PhotoBoxView)->
  _selfPrefix = module.id

  class PhotoBox
    constructor:()->
      @photoBoxView = new PhotoBoxView()
      console.log _selfPrefix, @photoBoxView
      $('body').append(@photoBoxView.$el)

    open: ()->
      @photoBoxView.open()



  PhotoBox

