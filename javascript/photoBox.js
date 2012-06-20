(function() {

  define(['module', 'photoBoxView'], function(module, PhotoBoxView) {
    var PhotoBox, _selfPrefix;
    _selfPrefix = module.id;
    PhotoBox = (function() {

      function PhotoBox() {
        this.photoBoxView = new PhotoBoxView();
        console.log(this.photoBoxView);
        $('body').append(this.photoBoxView.$el);
      }

      PhotoBox.prototype.open = function() {
        return this.photoBoxView.open();
      };

      return PhotoBox;

    })();
    return PhotoBox;
  });

}).call(this);
