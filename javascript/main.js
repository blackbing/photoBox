(function() {

  require(['module', 'jquery.photoBox'], function(module) {
    return $('.imageRow a').photoBox({
      thumb: function() {
        return $(this).find('img').attr('src');
      },
      original: function() {
        return $(this).attr('href');
      }
    });
  });

}).call(this);
