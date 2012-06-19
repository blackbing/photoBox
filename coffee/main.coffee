require([
  'module'
  'text!../template/photoBox.hbs'
], (module, photoBoxTpl)->
  $('body').append(photoBoxTpl)

  relayout = _.debounce((event) ->
    return  if $(".photoBox").is(":hidden")
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
    $list = $(".photoBox .pb-list li")
    $(".photoBox .pb-list").width $list.length * ($list.width() + 4 * 2)
  , 200)
  $(window).resize relayout
  relayout()
  $(".photoBox").on "click", ".pb-list li", ->
    $(".photoBox .pb-list>li>a").removeClass "active"
    $(this).find("a").addClass "active"
    bkImgReg = /url\((.+)\)/
    bkImg = bkImgReg.exec($(this).css("background-image"))
    if bkImg
      img = new Image()
      img.onload = ->
        $(".pb-main-image img").attr "src", @src

      img.src = bkImg[1]

  $(".photoBox").on "click", ".pb-left-handler", ->
    $list = $(".photoBox .pb-list")
    list_left = parseInt($list.css("left"), 10)
    min = 0
    remain = Math.abs(list_left - min)
    if remain <= 0
      return
    else
      left = Math.min(400, remain)
      $(".photoBox .pb-list").animate
        left: "+=" + left
      , 200

  $(".photoBox").on "click", ".pb-right-handler", ->
    $list = $(".photoBox .pb-list")
    list_left = parseInt($list.css("left"), 10)
    min = -($(".photoBox .pb-list").width() - $(".pb-list-wrapper").width())
    remain = Math.abs(list_left - min)
    if remain <= 0
      return
    else
      left = Math.min(400, remain)
      $(".photoBox .pb-list").animate
        left: "-=" + left
      , 200

  $(".photoBox").bind "close", ->
    $(".photoBox>.pb-preview").hide()
    $(".photoBox>.pb-viewer").hide()
    $(".photoBox").animate(
      height: 3
      marginTop: "+=" + $("body").height() / 2
    , 200).queue(->
      $(this).dequeue()
    ).animate(
      width: 0
      marginLeft: "+=" + $("body").width() / 2
    , 300).queue ->
      $(this).hide().dequeue()

  $(".photoBox").on "click", ".pb-close", ->
    $(".photoBox").trigger "close"

  $(".photoBox").bind "open", ->
    h = $("body").height() - 10
    w = $("body").width() - 10
    $(".photoBox").show().animate(
      width: w
      marginLeft: "-" + w / 2
    , 300).queue(->
      $(this).dequeue()
    ).animate(
      height: h
      marginTop: "-" + h / 2
    , 200).queue ->
      $(".photoBox>.pb-preview").show()
      $(".photoBox>.pb-viewer").show()
      $(window).trigger "resize"
      $(this).dequeue()

  $(".photoBox .pb-list").draggable
    axis: "x"
    drag: (event, ui) ->
      left = ui.position.left
      min = -($(".photoBox .pb-list").width() - $(".pb-list-wrapper").width())
      max = 0
      false  if (left - max) * (left - min) > 0

)
