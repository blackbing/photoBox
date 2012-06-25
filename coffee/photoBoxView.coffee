define [
  'module'
  'text!../template/photoBox.hbs'
], (module, photoBoxTpl)->
  _selfPrefix = module.id

  PhotoBoxView = Backbone.View.extend(
    relayout: ->
      if @$("#photoBox").css("visibility") is "hidden"
        return
      delta = 10

      descWidth = (if @$(".pb-desc").is(":hidden") then 0 else @$(".pb-desc").width())
      viewerWidth = $("body").width() - descWidth - (20 * 2) - 30
      previewHeight = if @$('.pb-preview').is(':visible') then @$(".pb-preview").height() else 0
      viewerHeight = $("body").height() - (20 * 2) - previewHeight
      @$(".pb-viewer").height viewerHeight
      @$(".pb-layer").width viewerWidth
      maxWidth = viewerWidth
      @$(".pb-main-image img").css(
        maxWidth: viewerWidth - delta
        maxHeight: viewerHeight - 20
      ).trigger "load"
      listWidth = $("body").width() - (50 * 2)
      @$(".pb-list-wrapper").width listWidth
      $list = @$("#photoBox .pb-list li")
      @$("#photoBox .pb-list").width $list.length * ($list.width() + 4 * 2)

    events:
      'click .pb-list li': 'selectPhoto'
      'click .pb-close': 'close'
      "click .pb-left-handler": 'swipeLeft'
      "click .pb-right-handler": 'swipeRight'

    hidePreview: ->
      @$('.pb-preview').slideUp(=>
        @relayout()
      )

    showPreview: ->
      @$('.pb-preview').slideDown(=>
        @relayout()
      )

    prev: ()->
      #$current = @$(".pb-list>li>a.active")
      prevLi = @$(".pb-list>li>a.active").parent().prev()
      prevLi.trigger('click')

    next: ()->
      #$current = @$(".pb-list>li>a.active")
      nextLi = @$(".pb-list>li>a.active").parent().next()
      nextLi.trigger('click')


    swipeRight: (event)->
      $list = @$("#photoBox .pb-list")
      list_left = parseInt($list.css("left"), 10)
      min = -(@$("#photoBox .pb-list").width() - @$(".pb-list-wrapper").width())
      remain = Math.abs(list_left - min)
      if remain <= 0
        return
      else
        left = Math.min(400, remain)
        @$("#photoBox .pb-list").animate
          left: "-=" + left
        , 200

    swipeLeft: (event)->
      $list = @$("#photoBox .pb-list")
      list_left = parseInt($list.css("left"), 10)
      min = 0
      remain = Math.abs(list_left - min)
      if remain <= 0
        return
      else
        left = Math.min(400, remain)
        @$("#photoBox .pb-list").animate
          left: "+=" + left
        , 200

    open: (idx)->

      @$("#photoBoxShadow")
      .attr('class', 'photoBox open')
      .one('webkitTransitionEnd', (event)=>
        _.delay(=>
          @$('#photoBox').removeClass('hidden')
          @relayout()
          @$("#photoBoxShadow").addClass('hidden')
        , 200)
      )

      if idx?
        @$('.pb-list>li').eq(idx).trigger('click')


    close: (event)->
      @$("#photoBox").addClass "hidden"

      @$("#photoBoxShadow")
      .removeClass('hidden open')
      .addClass('close')
      .one('webkitTransitionEnd', (event)=>
        _.delay(=>
          @$('#photoBox').addClass('hidden')
          @$("#photoBoxShadow").addClass('hidden')
        , 200)
      )

    selectPhoto: (event)->
      $target = $(event.currentTarget)

      idx = @$('.pb-list>li').index($target)
      originalImg = @data[idx]['original']


      @$(".pb-list>li>a").removeClass("active")
      @$(".pb-main-image").addClass('loading')
      @$(".pb-main-image img").fadeOut()
      $target.find("a").addClass("active")
      #bkImgReg = /url\((.+)\)/
      #bkImg = bkImgReg.exec($target.css("background-image"))
      img = new Image()
      img.onload = =>
        @$(".pb-main-image").removeClass('loading')
        @$(".pb-main-image img").attr("src", img.src)
        .fadeIn()


      img.src = originalImg


    render: ->

      template = Handlebars.compile(photoBoxTpl)
      tplData =
        list: @data
      @$el.append(template(tplData))

      $photoBox = @$el
      @$(".pb-list").draggable
        axis: "x"
        drag: (event, ui) =>
          left = ui.position.left
          min = -(@$(".pb-list").width() - @$(".pb-list-wrapper").width())
          max = 0
          false  if (left - max) * (left - min) > 0

    initialize: (@data)->
      #console.log 'initialize', @data
      @render()


      $(window).resize(
        _.debounce( =>
          @relayout()
        , 200)
      )
      .on 'keydown', (event)=>

        #console.log(event.which)
        switch event.which
          when 27
            @close()
          when 37
            @prev()
          when 39
            @next()
          when 38
            @showPreview()
          when 40
            @hidePreview()



      @relayout()


  )

  PhotoBoxView
