/* 
 * Author: @rohit9889
 * plugin: jquery.fade.slider v2.3.1
 * website: http://jqueryfadeslider.com/
 * Copyright (c) 2015 Rohit Sharma
 * Licensed under MIT
 */

(function($) {
  $.fn.fadeSlider = function(options) {
    var defaults = {
      itemPerPage: 4,
      itemPerPageMobile: 1,
      itemPerPageTablet: 2,
      startIndex:  0,
      timeout:     4000,
      fade:        true,
      autoplay:    true,
      remote:      false,
      beforeInit:     function(){},
      afterInit:      function(){},
      beforePrevious: function(){},
      afterPrevious:  function(){},
      beforeNext:     function(){},
      afterNext:      function(){},
      beforeDestroy:  function(){},
      afterDestroy:   function(){}
    }

    var that = this

    defaults.wrapper = this
    this.addClass('jquery-fade-slider-wrapper')

    this.fadeSliderBase = $.extend({}, defaults, options)

    this.initFadeSlider = function(){
      var that = this

      // trigger `beforeInit` Event
      this.fadeSliderBase.beforeInit(this, getFadeSliderSettings(this.fadeSliderBase))

      // Get a list of all the child divs
      this.fadeSliderBase.children = $('div', this.fadeSliderBase.wrapper)

      // Count the children
      this.fadeSliderBase.totalItems  = $(this.fadeSliderBase.children).length    

      // Honey, I Shrunk the Kids
      $(this.fadeSliderBase.children).attr('style', 'display:none;')

      // Reset the number of itemPerPage based on window width
      this.setVisibleElementsCount()

      // The space alloted to every child
      this.fadeSliderBase.width = 100 / this.fadeSliderBase.itemPerPage

      // Enforce timeout is greater than or equal to 2 seconds
      if(this.fadeSliderBase.timeout < 2000) this.fadeSliderBase.timeout = 2000

      // Providing support to the dumb people who resize the screen to test responsiveness
      $(window).resize(function(){
        that.setVisibleElementsCount()
        that.fadeSliderBase.width = 100 / that.fadeSliderBase.itemPerPage
      })

      // Autoplay will directly start the animation, so need to trigger the `afterInit` event here
      // This is a no return point if `autoplay` is set to true
      if(!!this.fadeSliderBase.autoplay){
        // trigger `afterInit` Event
        this.fadeSliderBase.afterInit(this, getFadeSliderSettings(this.fadeSliderBase))
      }

      if(this.fadeSliderBase.fade){
        // Fade Effect
        // Step 1: Initialize empty array of element indexes
        this.fadeSliderBase.arrayOfIndexes = Array.apply(null, {
          length: this.fadeSliderBase.totalItems
        }).map(function(_,index){return index})

        // Step 2: Get the element indexes that must be visible
        this.fadeSliderBase.elemsToShow = selectElemFromArray(
          this.fadeSliderBase.arrayOfIndexes,
          this.fadeSliderBase.startIndex,
          this.fadeSliderBase.itemPerPage)

        // Step 3: Trigger displaying elements
        startAnim(
          this.fadeSliderBase.elemsToShow,
          this.fadeSliderBase.width,
          this.fadeSliderBase.wrapper,
          this.fadeSliderBase.children
        )

        //Calculate and get the height of the shortest child
        this.css('min-height', heightOfShortestChild(this.fadeSliderBase.children))

        // Run Animation if autoplay is true
        if(that.fadeSliderBase.autoplay){
          this.interval = setInterval(function(){
            that.next()
          }, that.fadeSliderBase.timeout)
        }
      } else {
        // Slide Effect
        var arrayOfIndexes = Array.apply(null, {length: this.fadeSliderBase.totalItems}).map(function(_,index){return index})
        var elemsToShow    = selectElemFromArray(arrayOfIndexes, this.fadeSliderBase.startIndex, arrayOfIndexes.length)
        addElemsInWrapper(
          elemsToShow,
          this.fadeSliderBase.width,
          this.fadeSliderBase.wrapper,
          this.fadeSliderBase.children,
          this.fadeSliderBase.itemPerPage)

        this.fadeSliderBase.innerWrapper = $('.fade-slider-wrapper', this.fadeSliderBase.wrapper)
        var that = this

        this.css('min-height', heightOfShortestChild(this.fadeSliderBase.children))
        if(that.fadeSliderBase.autoplay){
          this.interval = setInterval(function(){
            that.next()
          }, that.fadeSliderBase.timeout)
        }
      }

      // If `autoplay` is set to false now is the time to trigger the `afterInit` event
      if(!this.fadeSliderBase.autoplay){
        // trigger `afterInit` Event
        this.fadeSliderBase.afterInit(this, getFadeSliderSettings(this.fadeSliderBase))
      }
    }

    this.setVisibleElementsCount = function(){
      if($(window).width() < 450){
        this.fadeSliderBase.itemPerPage = this.fadeSliderBase.itemPerPageMobile
      } else if($(window).width() >= 450 && $(window).width() < 1000){
        this.fadeSliderBase.itemPerPage = this.fadeSliderBase.itemPerPageTablet
      } else {
        this.fadeSliderBase.itemPerPage = this.fadeSliderBase.itemPerPage
      }
    }

    this.next = function(){
      var that = this

      // trigger `beforeNext` Event
      this.fadeSliderBase.beforeNext(this, getFadeSliderSettings(this.fadeSliderBase))

      if(this.fadeSliderBase.fade){
        that.fadeSliderBase.startIndex += that.fadeSliderBase.itemPerPage
      
        // Reset startIndex if it exceeds totalItems
        if(that.fadeSliderBase.startIndex >= that.fadeSliderBase.totalItems){
          that.fadeSliderBase.startIndex = that.fadeSliderBase.startIndex - that.fadeSliderBase.totalItems
        }
      
        // Perform Steps 1 through 4 at the specified `timeout`
        var arrayOfIndexes = Array.apply(null, {length: that.fadeSliderBase.totalItems}).map(function(_,index){return index})
      
        var elemsToShow    = selectElemFromArray(arrayOfIndexes, that.fadeSliderBase.startIndex, that.fadeSliderBase.itemPerPage)

        startAnim(elemsToShow, that.fadeSliderBase.width, that.fadeSliderBase.wrapper, that.fadeSliderBase.children)
      } else {
        var toremove = $($('.jquery-fade-slider-clones', that.fadeSliderBase.wrapper)[0])

        $($('.jquery-fade-slider-clones', that.fadeSliderBase.wrapper)[that.fadeSliderBase.itemPerPage])
        .animate({'width': that.fadeSliderBase.width + "%"}, {
          duration: 1000,
          start: function(){
            toremove.animate({'margin-left': '-' + toremove.css('width')}, {
              duration: 1000,
              done: function(){
                var clone = toremove.clone()
                clone.css({'margin-left': '', 'width': '0px', 'margin-right': ''})
                $('.fade-slider-wrapper', that.fadeSliderBase.wrapper).append(clone)
                toremove.remove()
              }
            })
          }
        })
      }

      // trigger `afterNext` Event
      this.fadeSliderBase.afterNext(this, getFadeSliderSettings(this.fadeSliderBase))
    }

    this.prev = function(){
      var that = this

      // trigger `beforePrevious` Event
      this.fadeSliderBase.beforePrevious(this, getFadeSliderSettings(this.fadeSliderBase))

      if(this.fadeSliderBase.fade){
        that.fadeSliderBase.startIndex -= that.fadeSliderBase.itemPerPage
        if(that.fadeSliderBase.startIndex < 0){
          that.fadeSliderBase.startIndex = this.fadeSliderBase.totalItems + that.fadeSliderBase.startIndex
        }
        var arrayOfIndexes = Array.apply(null, {length: this.fadeSliderBase.totalItems}).map(function(_,index){return index})
        var elemsToShow    = selectElemFromArray(
          arrayOfIndexes,
          this.fadeSliderBase.startIndex,
          that.fadeSliderBase.itemPerPage
        )
        startAnim(elemsToShow, that.fadeSliderBase.width, that.fadeSliderBase.wrapper, that.fadeSliderBase.children)
      } else {
        var toRemoveIndex = that.fadeSliderBase.itemPerPage
        var lastItemIndex = this.fadeSliderBase.totalItems - 1
        var toremove = $($('.jquery-fade-slider-clones', that.fadeSliderBase.wrapper)[toRemoveIndex])

        var lastItemClone = $($('.jquery-fade-slider-clones', that.fadeSliderBase.wrapper)[lastItemIndex]).clone()
        $($('.jquery-fade-slider-clones', that.fadeSliderBase.wrapper)[lastItemIndex]).remove()
        that.fadeSliderBase.innerWrapper.children().eq(0).before(lastItemClone)

        $($('.jquery-fade-slider-clones', that.fadeSliderBase.wrapper)[0])
        .animate({'width': that.fadeSliderBase.width + "%"}, {
          duration: 1000,
          start: function(){
            toremove.animate({'margin-right': '-' + toremove.css('width')}, {
              duration: 1000,
              done: function(){
                toremove.css({'margin-left': '', 'width': '0px', 'margin-right': ''})
              }
            })
          }
        })
      }

      // trigger `afterPrevious` Event
      this.fadeSliderBase.afterPrevious(this, getFadeSliderSettings(this.fadeSliderBase))
    }

    this.destroy = function(){
      // trigger `beforeDestroy` Event
      this.fadeSliderBase.beforeDestroy(this)

      this.fadeSliderBase.children.css({display: 'block'})
      $('.jquery-fade-slider-clones', this.fadeSliderBase.wrapper).remove()
      clearInterval(this.interval)

      // trigger `afterDestroy` Event
      this.fadeSliderBase.afterDestroy(this)
    }

    this.getRemoteData = function(callback){
      var url   = this.fadeSliderBase.remote.url
      var field = this.fadeSliderBase.remote.field
      var array = []

      $.ajax({
        crossDomain: true,
        url: url,
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}
      })
      .done(function(data){
        if(typeof data == 'string'){
          data = JSON.parse(data)
        }
        data.forEach(function(dataElem){
          array.push(dataElem[field])
        })
        callback(array)
      })
    }

    this.addRemoteElements = function(callback){
      var that = this
      var hasImage = this.fadeSliderBase.remote.isImage
      this.getRemoteData(function(elementsArray){
        var childrenClass = that.children().attr('class')
        that.children().remove()

        elementsArray.forEach(function(element){
          var appendString
          if(hasImage){
            appendString = '<div class="'+ childrenClass +'"><img src="' + element + '"></div>'
          } else {
            appendString = '<div class="'+ childrenClass +'">' + element + '</div>'
          }

          that.append(appendString)
        })

        callback()
      })
    }

    if(!this.fadeSliderBase.remote){
      this.initFadeSlider()
    } else {
      var that = this
      this.addRemoteElements(function(){
        that.initFadeSlider()
      })
    }

    return this
  }

  function heightOfShortestChild(children){
    var h = 0
    children.map(function(index, child){
      if(h == 0 || h > $(child).height()){
        h = $(child).height()
      }
    })
    return h+'px'
  }

  function selectElemFromArray(array, start, itemCount, reverse){
    var returnArray = []
    if(reverse){
      console.log(array, start, itemCount)
    }
    else {
      returnArray = returnArray.concat(array.splice(start, itemCount))
      if(returnArray.length < itemCount){
        var remainingElems = itemCount-returnArray.length
        returnArray = returnArray.concat(array.splice(0, remainingElems))
      }
    }
    return returnArray
  }

  function startAnim(indexes, width, wrapper, children){
    var length = $('.jquery-fade-slider-clones', wrapper).length
    if(length > 0){
      for(var i=0;i<length;i++){
        var elem = $($('.jquery-fade-slider-clones', wrapper)[i])
        if(i == length-1){
          elem.fadeOut(1000, function(){
            $('.jquery-fade-slider-clones', wrapper).remove()
            addElems(indexes, width, wrapper, children)
          })
        } else{
          elem.fadeOut(1000)
        }
      }
    } else {
      addElems(indexes, width, wrapper, children)
    }
  }

  function addElems(indexes, width, wrapper, children){
    indexes.map(function(index){
      var elem  = children[index]
      var clone = $(elem).clone()
      clone.addClass('jquery-fade-slider-clones')
      clone.attr('style', 'width: ' + width + '%;float: left;overflow-wrap: break-word;')
      wrapper.append(clone)
      clone.hide().fadeIn(1000) // Set delay for new elements to be visible
    })
  }

  function addElemsInWrapper(indexes, width, wrapper, children, itemPerPage){
    wrapper.append('<div class="fade-slider-wrapper"></div>')

    indexes.map(function(index){
      var elem  = children[index]
      var clone = $(elem).clone()
      clone.addClass('jquery-fade-slider-clones')
      if(index < itemPerPage){
        clone.attr('style', 'width: ' + width + '%;float: left;')
      } else {
        clone.attr('style', 'width: 0px;float: left;')
      }
      $('.fade-slider-wrapper', wrapper).append(clone)
    })

    $('.fade-slider-wrapper', wrapper).css({
      width: '100%',
      height: $('.jquery-fade-slider-clones', wrapper).css('height'),
      overflow: 'hidden'
    })
  }

  function getFadeSliderSettings(settingsObj){
    return {
      itemPerPage:       settingsObj.itemPerPage,
      itemPerPageMobile: settingsObj.itemPerPageMobile,
      itemPerPageTablet: settingsObj.itemPerPageTablet,
      startIndex:        settingsObj.startIndex,
      timeout:           settingsObj.timeout,
      fade:              settingsObj.fade,
      autoplay:          settingsObj.autoplay
    }
  }
 }(jQuery))
