(function() {

  require(['module', 'text!../template/photoBox.hbs'], function(module, photoBoxTpl) {
    var relayout;
    $('body').append(photoBoxTpl);
    relayout = _.debounce(function(event) {
      var $list, bodyHeight, bodyWidth, delta, descWidth, listWidth, maxWidth, viewerHeight, viewerWidth;
      if ($(".photoBox").is(":hidden")) return;
      delta = 10;
      bodyHeight = $("body").height() - delta;
      bodyWidth = $("body").width() - delta;
      $(".photoBox").css({
        top: "50%",
        left: "50%",
        width: bodyWidth,
        height: bodyHeight,
        marginLeft: -(bodyWidth / 2),
        marginTop: -(bodyHeight / 2)
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
      $list = $(".photoBox .pb-list li");
      return $(".photoBox .pb-list").width($list.length * ($list.width() + 4 * 2));
    }, 200);
    $(window).resize(relayout);
    relayout();
    $(".photoBox").on("click", ".pb-list li", function() {
      var bkImg, bkImgReg, img;
      $(".photoBox .pb-list>li>a").removeClass("active");
      $(this).find("a").addClass("active");
      bkImgReg = /url\((.+)\)/;
      bkImg = bkImgReg.exec($(this).css("background-image"));
      if (bkImg) {
        img = new Image();
        img.onload = function() {
          return $(".pb-main-image img").attr("src", this.src);
        };
        return img.src = bkImg[1];
      }
    });
    $(".photoBox").on("click", ".pb-left-handler", function() {
      var $list, left, list_left, min, remain;
      $list = $(".photoBox .pb-list");
      list_left = parseInt($list.css("left"), 10);
      min = 0;
      remain = Math.abs(list_left - min);
      if (remain <= 0) {} else {
        left = Math.min(400, remain);
        return $(".photoBox .pb-list").animate({
          left: "+=" + left
        }, 200);
      }
    });
    $(".photoBox").on("click", ".pb-right-handler", function() {
      var $list, left, list_left, min, remain;
      $list = $(".photoBox .pb-list");
      list_left = parseInt($list.css("left"), 10);
      min = -($(".photoBox .pb-list").width() - $(".pb-list-wrapper").width());
      remain = Math.abs(list_left - min);
      if (remain <= 0) {} else {
        left = Math.min(400, remain);
        return $(".photoBox .pb-list").animate({
          left: "-=" + left
        }, 200);
      }
    });
    $(".photoBox").bind("close", function() {
      $(".photoBox>.pb-preview").hide();
      $(".photoBox>.pb-viewer").hide();
      return $(".photoBox").animate({
        height: 3,
        marginTop: "+=" + $("body").height() / 2
      }, 200).queue(function() {
        return $(this).dequeue();
      }).animate({
        width: 0,
        marginLeft: "+=" + $("body").width() / 2
      }, 300).queue(function() {
        return $(this).hide().dequeue();
      });
    });
    $(".photoBox").on("click", ".pb-close", function() {
      return $(".photoBox").trigger("close");
    });
    $(".photoBox").bind("open", function() {
      var h, w;
      h = $("body").height() - 10;
      w = $("body").width() - 10;
      return $(".photoBox").show().animate({
        width: w,
        marginLeft: "-" + w / 2
      }, 300).queue(function() {
        return $(this).dequeue();
      }).animate({
        height: h,
        marginTop: "-" + h / 2
      }, 200).queue(function() {
        $(".photoBox>.pb-preview").show();
        $(".photoBox>.pb-viewer").show();
        $(window).trigger("resize");
        return $(this).dequeue();
      });
    });
    return $(".photoBox .pb-list").draggable({
      axis: "x",
      drag: function(event, ui) {
        var left, max, min;
        left = ui.position.left;
        min = -($(".photoBox .pb-list").width() - $(".pb-list-wrapper").width());
        max = 0;
        if ((left - max) * (left - min) > 0) return false;
      }
    });
  });

}).call(this);
