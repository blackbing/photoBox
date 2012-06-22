define [
  'module'
  'photoBoxView'
], (module, PhotoBoxView)->
  _selfPrefix = module.id

  class PhotoBox
    constructor:(@data)->
      @photoBoxView = new PhotoBoxView(@data)
      console.log _selfPrefix, @photoBoxView
      $('body').append(@photoBoxView.$el)

    open: (index)->
      @photoBoxView.open(index)



  PhotoBox

