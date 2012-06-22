(function() {

  require(['module', 'photoBox'], function(module, PhotoBox) {
    return $.fn.photoBox = function() {
      var $el, data, photoBox;
      $el = this;
      data = [];
      $el.each(function(idx, val) {
        return data.push({
          thumb: $(val).find('img').attr('src'),
          original: $(val).attr('href')
        });
      }).on('click', function(event) {
        var idx;
        idx = $el.index(this);
        photoBox.open(idx);
        return event.preventDefault();
      });
      return photoBox = new PhotoBox(data);
    };
  });

}).call(this);
