(function() {

  define(['module', './photoBox'], function(module, PhotoBox) {
    return $.fn.photoBox = function(opts) {
      var $el, data, photoBox;
      $el = this;
      data = [];
      $el.each(function(idx, val) {
        var original, thumb;
        thumb = (opts != null) && (opts.thumb != null) ? opts.thumb.call(this) : $(this).find('img').attr('src');
        original = (opts != null) && (opts.original != null) ? opts.original.call(this) : $(this).attr('href');
        return data.push({
          thumb: thumb,
          original: original
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
