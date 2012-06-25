(function() {

  define(['module', 'text!../template/photoBox.hbs'], function(module, photoBoxTpl) {
    var PhotoBoxView, _selfPrefix;
    _selfPrefix = module.id;
    PhotoBoxView = Backbone.View.extend({
      relayout: function() {
        var $list, delta, descWidth, listWidth, maxWidth, previewHeight, viewerHeight, viewerWidth;
        if (this.$("#photoBox").css("visibility") === "hidden") return;
        delta = 10;
        descWidth = (this.$(".pb-desc").is(":hidden") ? 0 : this.$(".pb-desc").width());
        viewerWidth = $("body").width() - descWidth - (20 * 2) - 30;
        previewHeight = this.$('.pb-preview').is(':visible') ? this.$(".pb-preview").height() : 0;
        viewerHeight = $("body").height() - (20 * 2) - previewHeight;
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
        "click .pb-left-handler": 'swipeLeft',
        "click .pb-right-handler": 'swipeRight'
      },
      hidePreview: function() {
        var _this = this;
        return this.$('.pb-preview').slideUp(function() {
          return _this.relayout();
        });
      },
      showPreview: function() {
        var _this = this;
        return this.$('.pb-preview').slideDown(function() {
          return _this.relayout();
        });
      },
      prev: function() {
        var prevLi;
        prevLi = this.$(".pb-list>li>a.active").parent().prev();
        return prevLi.trigger('click');
      },
      next: function() {
        var nextLi;
        nextLi = this.$(".pb-list>li>a.active").parent().next();
        return nextLi.trigger('click');
      },
      swipeRight: function(event) {
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
      swipeLeft: function(event) {
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
      open: function(idx) {
        var _this = this;
        this.$("#photoBoxShadow").attr('class', 'photoBox open').one('webkitTransitionEnd', function(event) {
          return _.delay(function() {
            _this.$('#photoBox').removeClass('hidden');
            _this.relayout();
            return _this.$("#photoBoxShadow").addClass('hidden');
          }, 200);
        });
        if (idx != null) return this.$('.pb-list>li').eq(idx).trigger('click');
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
        var $target, idx, img, originalImg,
          _this = this;
        $target = $(event.currentTarget);
        idx = this.$('.pb-list>li').index($target);
        originalImg = this.data[idx]['original'];
        this.$(".pb-list>li>a").removeClass("active");
        this.$(".pb-main-image").addClass('loading');
        this.$(".pb-main-image img").fadeOut();
        $target.find("a").addClass("active");
        img = new Image();
        img.onload = function() {
          _this.$(".pb-main-image").removeClass('loading');
          return _this.$(".pb-main-image img").attr("src", img.src).fadeIn();
        };
        return img.src = originalImg;
      },
      render: function() {
        var $photoBox, template, tplData,
          _this = this;
        template = Handlebars.compile(photoBoxTpl);
        tplData = {
          list: this.data
        };
        this.$el.append(template(tplData));
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
      initialize: function(data) {
        var _this = this;
        this.data = data;
        this.render();
        $(window).resize(_.debounce(function() {
          return _this.relayout();
        }, 200)).on('keydown', function(event) {
          switch (event.which) {
            case 27:
              return _this.close();
            case 37:
              return _this.prev();
            case 39:
              return _this.next();
            case 38:
              return _this.showPreview();
            case 40:
              return _this.hidePreview();
          }
        });
        return this.relayout();
      }
    });
    return PhotoBoxView;
  });

}).call(this);
