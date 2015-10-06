/* 
 * Author: @rohit9889
 * plugin: jquery.fade.slider
 * website: http://rohit-sharma.in/jquery-fade-slider/
 */

(function($) {
  $.fn.fadeSlider = function(options) {
    var defaults = {
      itemPerPage: 4,
      itemPerPageMobile: 1,
      itemPerPageTablet: 2,
      startIndex:  0,
      timeout:     4000,
      fade:        true
    }
    defaults.wrapper = this

    this.fadeSliderBase = $.extend({}, defaults, options)
    // Get a list of all the child divs
    this.fadeSliderBase.children = $('div', this.fadeSliderBase.wrapper)

    // Count the children
    this.fadeSliderBase.totalItems  = $(this.fadeSliderBase.children).length

    // Honey, I Shrunk the Kids
    $(this.fadeSliderBase.children).attr('style', 'display:none;')

    // Reset the number of itemPerPage based on window width
    if($(window).width() < 450){
      this.fadeSliderBase.itemPerPage = this.fadeSliderBase.itemPerPageMobile
    } else if($(window).width() >= 450 && $(window).width() < 1000){
      this.fadeSliderBase.itemPerPage = this.fadeSliderBase.itemPerPageTablet
    }

    // The space alloted to every child
    this.fadeSliderBase.width = 100 / this.fadeSliderBase.itemPerPage

    // Enforce timeout is greater than or equal to 2 seconds
    if(this.fadeSliderBase.timeout < 2000) this.fadeSliderBase.timeout = 2000

    // Providing support to the dumb people who resize the screen to test responsiveness
    $(window).resize(function(){
      if($(window).width() < 450){
        that.fadeSliderBase.itemPerPage = that.fadeSliderBase.itemPerPageMobile
      } else if($(window).width() >= 450 && $(window).width() < 1000){
        that.fadeSliderBase.itemPerPage = that.fadeSliderBase.itemPerPageTablet
      } else {
        that.fadeSliderBase.itemPerPage = that.fadeSliderBase.itemPerPage
      }
      that.fadeSliderBase.width = 100 / that.fadeSliderBase.itemPerPage
    })

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

      // Step 4: Increment the counter to the next image
      this.fadeSliderBase.startIndex += this.fadeSliderBase.itemPerPage
      // Perform Steps 1 through 4 at the specified `timeout`
      var that = this
      this.interval = setInterval(function(){
        var arrayOfIndexes = Array.apply(null, {length: that.fadeSliderBase.totalItems}).map(function(_,index){return index})
        var elemsToShow    = selectElemFromArray(arrayOfIndexes, that.fadeSliderBase.startIndex, that.fadeSliderBase.itemPerPage)
        startAnim(elemsToShow, that.fadeSliderBase.width, that.fadeSliderBase.wrapper, that.fadeSliderBase.children)
        that.fadeSliderBase.startIndex += that.fadeSliderBase.itemPerPage

        // Reset startIndex if it exceeds totalItems
        if(that.fadeSliderBase.startIndex >= that.fadeSliderBase.totalItems){
          that.fadeSliderBase.startIndex = that.fadeSliderBase.startIndex - that.fadeSliderBase.totalItems
        }
      }, that.fadeSliderBase.timeout)
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

      var width = ''
      var that = this
      this.interval = setInterval(function(){
        var toremove = $($('.custom-slider-element-clones', that.fadeSliderBase.wrapper)[0])
        if(!width){
          width = toremove.css('width')
          width     = Number(width.replace(/px/g, ''))
          width     = (width - 1) + 'px'
        }


        $($('.custom-slider-element-clones', that.fadeSliderBase.wrapper)[that.fadeSliderBase.itemPerPage])
        .animate({'width': that.fadeSliderBase.width + "%"}, {
          duration: 1000,
          start: function(){
            toremove.animate({'margin-left': '-' + toremove.css('width')}, {
              duration: 1000,
              done: function(){
                var clone = toremove.clone()
                clone.css({'margin-left': '', 'width': '0px'})
                $('.fade-slider-wrapper', that.fadeSliderBase.wrapper).append(clone)
                toremove.remove()
              }
            })
          }
        })
      }, that.fadeSliderBase.timeout)
    }

    this.destroy = function(){
      clearInterval(this.interval)
      this.fadeSliderBase.children.css({display: 'block'})
      $('.custom-slider-element-clones', this.fadeSliderBase.wrapper).remove()
    }
    return this
  }

  function selectElemFromArray(array, start, itemCount){
    var returnArray = []
    returnArray = returnArray.concat(array.splice(start, itemCount))
    if(returnArray.length < itemCount){
      var remainingElems = itemCount-returnArray.length
      returnArray = returnArray.concat(array.splice(0, remainingElems))
    }
    return returnArray
  }

  function startAnim(indexes, width, wrapper, children){
    var length = $('.custom-slider-element-clones', wrapper).length
    if(length > 0){
      for(var i=0;i<length;i++){
        var elem = $($('.custom-slider-element-clones', wrapper)[i])
        if(i == length-1){
          elem.fadeOut(1000, function(){
            $('.custom-slider-element-clones', wrapper).remove()
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
      clone.addClass('custom-slider-element-clones')
      clone.removeClass('hidden')
      clone.attr('style', 'width: ' + width + '%;float: left;')
      wrapper.append(clone)
      clone.hide().fadeIn(1000) // Set delay for new elements to be visible
    })
  }

  function addElemsInWrapper(indexes, width, wrapper, children, itemPerPage){
    wrapper.append('<div class="fade-slider-wrapper"></div>')

    indexes.map(function(index){
      var elem  = children[index]
      var clone = $(elem).clone()
      clone.addClass('custom-slider-element-clones')
      clone.removeClass('hidden')
      if(index < itemPerPage){
        clone.attr('style', 'width: ' + width + '%;float: left;')
      } else {
        clone.attr('style', 'width: 0px;float: left;')
      }
      $('.fade-slider-wrapper', wrapper).append(clone)
    })

    $('.fade-slider-wrapper', wrapper).css({
      width: '100%',
      height: $('.custom-slider-element-clones', wrapper).css('height'),
      overflow: 'hidden'
    })
  }
 }(jQuery))