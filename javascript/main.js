(function() {

  require(['module', 'jquery.photoBox'], function(module, PhotoBox) {
    return $('.imageRow a').photoBox();
  });

}).call(this);
