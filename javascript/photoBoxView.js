(function() {

  define(['module', 'text!../template/photoBox.hbs'], function(module, photoBoxTpl) {
    var PhotoBoxView, _selfPrefix;
    _selfPrefix = module.id;
    PhotoBoxView = Backbone.View.extend({
      relayout: function() {
        var $list, delta, descWidth, listWidth, maxWidth, viewerHeight, viewerWidth;
        if (this.$("#photoBox").css("visibility") === "hidden") return;
        delta = 10;
        descWidth = (this.$(".pb-desc").is(":hidden") ? 0 : this.$(".pb-desc").width());
        viewerWidth = $("body").width() - descWidth - (20 * 2) - 30;
        viewerHeight = $("body").height() - (20 * 2) - this.$(".pb-preview").height();
        this.$(".pb-viewer").height(viewerHeight);
        this.$(".pb-layer").width(viewerWidth);
        maxWidth = viewerWidth;
        this.$(".pb-main-image img").css({
          maxWidth: viewerWidth - delta,
          maxHeight: viewerHeight - 20
        }).trigger("load");
        listWidth = $("body").width() - (50 * 2);
        this.$(".pb-list-wrapper").width(listWidth);
        $list = this.$("#photoBox .pb-list li");
        return this.$("#photoBox .pb-list").width($list.length * ($list.width() + 4 * 2));
      },
      events: {
        'click .pb-list li': 'selectPhoto',
        'click .pb-close': 'close',
        "click .pb-left-handler": 'previous',
        "click .pb-right-handler": 'next'
      },
      next: function(event) {
        var $list, left, list_left, min, remain;
        $list = this.$("#photoBox .pb-list");
        list_left = parseInt($list.css("left"), 10);
        min = -(this.$("#photoBox .pb-list").width() - this.$(".pb-list-wrapper").width());
        remain = Math.abs(list_left - min);
        if (remain <= 0) {} else {
          left = Math.min(400, remain);
          return this.$("#photoBox .pb-list").animate({
            left: "-=" + left
          }, 200);
        }
      },
      previous: function(event) {
        var $list, left, list_left, min, remain;
        $list = this.$("#photoBox .pb-list");
        list_left = parseInt($list.css("left"), 10);
        min = 0;
        remain = Math.abs(list_left - min);
        if (remain <= 0) {} else {
          left = Math.min(400, remain);
          return this.$("#photoBox .pb-list").animate({
            left: "+=" + left
          }, 200);
        }
      },
      open: function(event) {
        var _this = this;
        return this.$("#photoBoxShadow").attr('class', 'photoBox open').one('webkitTransitionEnd', function(event) {
          return _.delay(function() {
            _this.$('#photoBox').removeClass('hidden');
            _this.relayout();
            return _this.$("#photoBoxShadow").addClass('hidden');
          }, 200);
        });
      },
      close: function(event) {
        var _this = this;
        this.$("#photoBox").addClass("hidden");
        return this.$("#photoBoxShadow").removeClass('hidden open').addClass('close').one('webkitTransitionEnd', function(event) {
          return _.delay(function() {
            _this.$('#photoBox').addClass('hidden');
            return _this.$("#photoBoxShadow").addClass('hidden');
          }, 200);
        });
      },
      selectPhoto: function(event) {
        var $target, bkImg, bkImgReg, img,
          _this = this;
        $target = $(event.currentTarget);
        this.$(".pb-list>li>a").removeClass("active");
        $target.find("a").addClass("active");
        bkImgReg = /url\((.+)\)/;
        bkImg = bkImgReg.exec($target.css("background-image"));
        if (bkImg) {
          img = new Image();
          img.onload = function() {
            return _this.$(".pb-main-image img").attr("src", img.src);
          };
          return img.src = bkImg[1];
        }
      },
      render: function() {
        var $photoBox, data, template,
          _this = this;
        template = Handlebars.compile(photoBoxTpl);
        data = {};
        this.$el.append(template(data));
        $photoBox = this.$el;
        return this.$(".pb-list").draggable({
          axis: "x",
          drag: function(event, ui) {
            var left, max, min;
            left = ui.position.left;
            min = -(_this.$(".pb-list").width() - _this.$(".pb-list-wrapper").width());
            max = 0;
            if ((left - max) * (left - min) > 0) return false;
          }
        });
      },
      initialize: function() {
        var _this = this;
        this.render();
        $(window).resize(_.debounce(function() {
          return _this.relayout();
        }, 200)).on('keydown', function(event) {
          switch (event.which) {
            case 27:
              return _this.close();
          }
        });
        return this.relayout();
      }
    });
    return PhotoBoxView;
  });

}).call(this);
