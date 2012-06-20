define [
  'module'
  'text!../template/photoBox.hbs'
], (module, photoBoxTpl)->
  _selfPrefix = module.id
  relayout = _.debounce((event) ->
    if $("#photoBox").css("visibility") is "hidden"
      if $("#photoBoxShadow").css("visibility") is "hidden"
        $("#photoBoxShadow").css
          width: 0
          height: 3
          marginLeft: 5
          marginTop: 5
      return
    delta = 10
    bodyHeight = $("body").height() - delta
    bodyWidth = $("body").width() - delta
    $(".photoBox").css
      top: "50%"
      left: "50%"
      width: bodyWidth
      height: bodyHeight
      marginLeft: -(bodyWidth / 2)
      marginTop: -(bodyHeight / 2)

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
      $("#photoBoxShadow").removeClass "hidden"
      h = $("body").height() - 10
      w = $("body").width() - 10
      $("#photoBoxShadow").removeClass("hidden").animate(
        width: w
        marginLeft: "-" + w / 2
      , 300).queue(->
        $(this).dequeue()
      ).animate(
        height: h
        marginTop: "-" + h / 2
      , 200).queue ->
        $(window).trigger "resize"
        $("#photoBox").removeClass "hidden"
        _.delay (->
          $("#photoBoxShadow").addClass "hidden"
        ), 180
        $(this).dequeue()

    close: (event)->
      $("#photoBox").addClass "hidden"
      $("#photoBoxShadow").removeClass "hidden"
      $("#photoBoxShadow").animate(
        height: 3
        marginTop: "+=" + $("body").height() / 2
      , 200).queue(->
        $(this).dequeue()
      ).animate(
        width: 0
        marginLeft: "+=" + $("body").width() / 2
      , 300).queue ->
        $(this).addClass("hidden").dequeue()

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





#$("#photoBox").on "click", ".pb-list li", ->





  )

  PhotoBoxView
