(function() {

  define(['module', './photoBoxView'], function(module, PhotoBoxView) {
    var PhotoBox, _selfPrefix;
    _selfPrefix = module.id;
    PhotoBox = (function() {

      function PhotoBox(data) {
        this.data = data;
        this.photoBoxView = new PhotoBoxView(this.data);
        console.log(_selfPrefix, this.photoBoxView);
        $('body').append(this.photoBoxView.$el);
      }

      PhotoBox.prototype.open = function(index) {
        return this.photoBoxView.open(index);
      };

      return PhotoBox;

    })();
    return PhotoBox;
  });

}).call(this);
