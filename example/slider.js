/* 
 * Author: @rohit9889
 * plugin: jquery.fade.slider
 * website: http://rohit-sharma.in/jquery-fade-slider/
 */

 (function($) {
  $.fn.fadeSlider = function(options) {
    var defaults = {
      itemPerPage: 4,
      startIndex:  0,
      timeout:     4000
    }
    defaults.wrapper = this

    var base = $.extend({}, defaults, options)

    // Get a list of all the child divs
    base.children = $('div', base.wrapper)

    // Count the children
    base.totalItems  = $(base.children).length

    // Honey, I Shrunk the Kids
    $(base.children).attr('style', 'display:none;')

    // Reset the number of itemPerPage based on window width
    if($(window).width() < 450){
      base.itemPerPage = 1
    } else if($(window).width() >= 450 && $(window).width() < 1000){
      base.itemPerPage = 2
    }

    // The space alloted to every child
    base.width = 100 / base.itemPerPage

    // Providing support to the dumb people who resize the screen to test responsiveness
    $(window).resize(function(){
      if($(window).width() < 450){
        base.itemPerPage = 1
      } else if($(window).width() >= 450 && $(window).width() < 1000){
        base.itemPerPage = 2
      } else {
        base.itemPerPage = 4
      }
      base.width = 100 / base.itemPerPage
    })

    // Step 1: Initialize empty array of element indexes
    base.arrayOfIndexes = Array.apply(null, {length: base.totalItems}).map(function(_,index){return index})

    // Step 2: Get the element indexes that must be visible
    base.elemsToShow    = selectElemFromArray(base.arrayOfIndexes, base.startIndex, base.itemPerPage)

    // Step 3: Trigger displaying elements
    startAnim(base.elemsToShow, base.width, base)

    // Step 4: Increment the counter to the next image
    base.startIndex += base.itemPerPage

    // Perform Steps 1 through 4 at the specified `timeout`
    setTimeout(function(){
      startCarouselAnimation(base.totalItems, base.startIndex, base.itemPerPage, base.elemsToShow, base.width, base.timeout, base)
    }, base.timeout)
  }

  function startCarouselAnimation(totalItems, startIndex, itemPerPage, elemsToShow, width, timeout, base){
    arrayOfIndexes = Array.apply(null, {length: totalItems}).map(function(_,index){return index})
    elemsToShow    = selectElemFromArray(arrayOfIndexes, startIndex, itemPerPage)
    startAnim(elemsToShow, width, base)
    startIndex += itemPerPage

    // Reset startIndex if it exceeds totalItems
    if(startIndex >= totalItems){
      startIndex = startIndex - totalItems
    }

    setTimeout(function(){
      startCarouselAnimation(totalItems, startIndex, itemPerPage, elemsToShow, width, timeout, base)
    }, timeout)
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

  function startAnim(indexes, width, base){
    var length = $('.custom-slider-element-clones', base.wrapper).length
    if(length > 0){
      for(var i=0;i<length;i++){
        var elem = $($('.custom-slider-element-clones',  base.wrapper)[i])
        if(i == length-1){
          elem.fadeOut(1000, function(){
            $('custom-slider-element-clones', base.wrapper).remove()
            addElems(indexes, width, base)
          })
        } else{
          elem.fadeOut(1000)
        }
      }
    } else {
      addElems(indexes, width, base)
    }
  }

  function addElems(indexes, width, base){
    indexes.map(function(index){
      var elem  = base.children[index]
      var clone = $(elem).clone()
      clone.addClass('custom-slider-element-clones')
      clone.removeClass('hidden')
      clone.attr('style', 'width: ' + width + '%;float: left;')
      base.wrapper.append(clone)
      clone.hide().fadeIn(1000) // Set delay for new elements to be visible
    })
  }
 }(jQuery))