(function() {

  require(['module', 'photoBox'], function(module, PhotoBox) {
    var photoBox;
    photoBox = new PhotoBox();
    return $('#show').click(function() {
      return photoBox.open();
    });
  });

}).call(this);
