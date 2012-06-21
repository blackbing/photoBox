define [
  'module'
  'text!../template/photoBox.hbs'
], (module, photoBoxTpl)->
  _selfPrefix = module.id
  relayout = _.debounce((event) ->
    if $("#photoBox").css("visibility") is "hidden"
      return
    delta = 10

    descWidth = (if $(".pb-desc").is(":hidden") then 0 else $(".pb-desc").width())
    viewerWidth = $("body").width() - descWidth - (20 * 2) - 30
    viewerHeight = $("body").height() - (20 * 2) - $(".pb-preview").height()
    $(".pb-viewer").height viewerHeight
    $(".pb-layer").width viewerWidth
    maxWidth = viewerWidth
    $(".pb-main-image img").css(
      maxWidth: viewerWidth - delta
      maxHeight: viewerHeight - 20
    ).trigger "load"
    listWidth = $("body").width() - (50 * 2)
    $(".pb-list-wrapper").width listWidth
    $list = $("#photoBox .pb-list li")
    $("#photoBox .pb-list").width $list.length * ($list.width() + 4 * 2)
  , 200)

  PhotoBoxView = Backbone.View.extend(
    events:
      'click .pb-list li': 'selectPhoto'
      'click .pb-close': 'close'
      "click .pb-left-handler": 'previous'
      "click .pb-right-handler": 'next'

    next: (event)->
      $list = $("#photoBox .pb-list")
      list_left = parseInt($list.css("left"), 10)
      min = -($("#photoBox .pb-list").width() - $(".pb-list-wrapper").width())
      remain = Math.abs(list_left - min)
      if remain <= 0
        return
      else
        left = Math.min(400, remain)
        $("#photoBox .pb-list").animate
          left: "-=" + left
        , 200

    previous: (event)->
      $list = $("#photoBox .pb-list")
      list_left = parseInt($list.css("left"), 10)
      min = 0
      remain = Math.abs(list_left - min)
      if remain <= 0
        return
      else
        left = Math.min(400, remain)
        $("#photoBox .pb-list").animate
          left: "+=" + left
        , 200

    open: (event)->
      @$el.find("#photoBoxShadow")
      .attr('class', 'photoBox open')
      .one('webkitTransitionEnd', (event)=>
        _.delay(=>
          @$el.find('#photoBox').removeClass('hidden')
          relayout()
          @$el.find("#photoBoxShadow").addClass('hidden')
        , 200)
      )


    close: (event)->
      @$el.find("#photoBox").addClass "hidden"

      @$el.find("#photoBoxShadow")
      .removeClass('hidden open')
      .addClass('close')
      .one('webkitTransitionEnd', (event)=>
        _.delay(=>
          @$el.find('#photoBox').addClass('hidden')
          @$el.find("#photoBoxShadow").addClass('hidden')
        , 200)
      )

    selectPhoto: (event)->
      $target = $(event.currentTarget)

      @$el.find(".pb-list>li>a").removeClass("active")
      $target.find("a").addClass("active")
      bkImgReg = /url\((.+)\)/
      bkImg = bkImgReg.exec($target.css("background-image"))
      if bkImg
        img = new Image()
        img.onload = ->
          $(".pb-main-image img").attr "src", @src

        img.src = bkImg[1]


    render: ->
      #$('body').append(@el)
      template = Handlebars.compile(photoBoxTpl)
      data = {}
      #<div id="photoBox" class="photoBox hidden">
      @$el.append(template(data))

      $photoBox = @$el
      #$photoBox.after "<div class=\"photoBox hidden\" id=\"photoBoxShadow\"/>"
      $photoBox.find(".pb-list").draggable
        axis: "x"
        drag: (event, ui) ->
          left = ui.position.left
          min = -($photoBox.find(".pb-list").width() - $photoBox.find(".pb-list-wrapper").width())
          max = 0
          false  if (left - max) * (left - min) > 0

    initialize: ->
      @render()


      $(window).resize relayout
      relayout()


  )

  PhotoBoxView
