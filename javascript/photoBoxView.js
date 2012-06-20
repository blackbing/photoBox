(function() {

  define(['module', 'text!../template/photoBox.hbs'], function(module, photoBoxTpl) {
    var PhotoBoxView, relayout, _selfPrefix;
    _selfPrefix = module.id;
    relayout = _.debounce(function(event) {
      var $list, bodyHeight, bodyWidth, delta, descWidth, listWidth, maxWidth, viewerHeight, viewerWidth;
      if ($("#photoBox").css("visibility") === "hidden") {
        if ($("#photoBoxShadow").css("visibility") === "hidden") {
          $("#photoBoxShadow").css({
            width: 0,
            height: 3
          });
        }
        return;
      }
      delta = 10;
      bodyHeight = $("body").height() - delta;
      bodyWidth = $("body").width() - delta;
      $(".photoBox").css({
        width: bodyWidth,
        height: bodyHeight
      });
      descWidth = ($(".pb-desc").is(":hidden") ? 0 : $(".pb-desc").width());
      viewerWidth = $("body").width() - descWidth - (20 * 2) - 30;
      viewerHeight = $("body").height() - (20 * 2) - $(".pb-preview").height();
      $(".pb-viewer").height(viewerHeight);
      $(".pb-layer").width(viewerWidth);
      maxWidth = viewerWidth;
      $(".pb-main-image img").css({
        maxWidth: viewerWidth - delta,
        maxHeight: viewerHeight - 20
      }).trigger("load");
      listWidth = $("body").width() - (50 * 2);
      $(".pb-list-wrapper").width(listWidth);
      $list = $("#photoBox .pb-list li");
      return $("#photoBox .pb-list").width($list.length * ($list.width() + 4 * 2));
    }, 200);
    PhotoBoxView = Backbone.View.extend({
      events: {
        'click .pb-list li': 'selectPhoto',
        'click .pb-close': 'close',
        "click .pb-left-handler": 'previous',
        "click .pb-right-handler": 'next'
      },
      next: function(event) {
        var $list, left, list_left, min, remain;
        $list = $("#photoBox .pb-list");
        list_left = parseInt($list.css("left"), 10);
        min = -($("#photoBox .pb-list").width() - $(".pb-list-wrapper").width());
        remain = Math.abs(list_left - min);
        if (remain <= 0) {} else {
          left = Math.min(400, remain);
          return $("#photoBox .pb-list").animate({
            left: "-=" + left
          }, 200);
        }
      },
      previous: function(event) {
        var $list, left, list_left, min, remain;
        $list = $("#photoBox .pb-list");
        list_left = parseInt($list.css("left"), 10);
        min = 0;
        remain = Math.abs(list_left - min);
        if (remain <= 0) {} else {
          left = Math.min(400, remain);
          return $("#photoBox .pb-list").animate({
            left: "+=" + left
          }, 200);
        }
      },
      open: function(event) {
        var h, w;
        $("#photoBoxShadow").removeClass("hidden");
        h = $("body").height() - 10;
        w = $("body").width() - 10;
        return $("#photoBoxShadow").removeClass("hidden").animate({
          width: w
        }, 300).queue(function() {
          return $(this).dequeue();
        }).animate({
          height: h
        }, 200).queue(function() {
          $(window).trigger("resize");
          $("#photoBox").removeClass("hidden");
          _.delay((function() {
            return $("#photoBoxShadow").addClass("hidden");
          }), 180);
          return $(this).dequeue();
        });
      },
      close: function(event) {
        $("#photoBox").addClass("hidden");
        $("#photoBoxShadow").removeClass("hidden");
        return $("#photoBoxShadow").animate({
          height: 3
        }, 200).queue(function() {
          return $(this).dequeue();
        }).animate({
          width: 0
        }, 300).queue(function() {
          return $(this).addClass("hidden").dequeue();
        });
      },
      selectPhoto: function(event) {
        var $target, bkImg, bkImgReg, img;
        $target = $(event.currentTarget);
        this.$el.find(".pb-list>li>a").removeClass("active");
        $target.find("a").addClass("active");
        bkImgReg = /url\((.+)\)/;
        bkImg = bkImgReg.exec($target.css("background-image"));
        if (bkImg) {
          img = new Image();
          img.onload = function() {
            return $(".pb-main-image img").attr("src", this.src);
          };
          return img.src = bkImg[1];
        }
      },
      render: function() {
        var $photoBox, data, template;
        template = Handlebars.compile(photoBoxTpl);
        data = {};
        this.$el.append(template(data));
        $photoBox = this.$el;
        return $photoBox.find(".pb-list").draggable({
          axis: "x",
          drag: function(event, ui) {
            var left, max, min;
            left = ui.position.left;
            min = -($photoBox.find(".pb-list").width() - $photoBox.find(".pb-list-wrapper").width());
            max = 0;
            if ((left - max) * (left - min) > 0) return false;
          }
        });
      },
      initialize: function() {
        this.render();
        $(window).resize(relayout);
        return relayout();
      }
    });
    return PhotoBoxView;
  });

}).call(this);
