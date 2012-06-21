(function() {

  require(['module', 'photoBox'], function(module, PhotoBox) {
    var photoBox;
    photoBox = new PhotoBox();
    return $('#show').text('show photoBox').click(function() {
      return photoBox.open();
    });
  });

}).call(this);
