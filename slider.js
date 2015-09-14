/* 
 * Author: @rohit9889
 * plugin: jquery.fade.slider
 * website: http://rohit-sharma.in/jquery-fade-slider/
 */
var fadeSliderBase = null;

(function($) {
  $.fn.fadeSlider = function(options) {
    var defaults = {
      itemPerPage: 4,
      startIndex:  0,
      timeout:     4000
    }
    defaults.wrapper = this

    fadeSliderBase = $.extend({}, defaults, options)

    // Get a list of all the child divs
    fadeSliderBase.children = $('div', fadeSliderBase.wrapper)

    // Count the children
    fadeSliderBase.totalItems  = $(fadeSliderBase.children).length

    // Honey, I Shrunk the Kids
    $(fadeSliderBase.children).attr('style', 'display:none;')

    // Reset the number of itemPerPage based on window width
    if($(window).width() < 450){
      fadeSliderBase.itemPerPage = 1
    } else if($(window).width() >= 450 && $(window).width() < 1000){
      fadeSliderBase.itemPerPage = 2
    }

    // The space alloted to every child
    fadeSliderBase.width = 100 / fadeSliderBase.itemPerPage

    // Enforce timeout is greater than or equal to 2 seconds
    if(fadeSliderBase.timeout < 2000) fadeSliderBase.timeout = 2000

    // Providing support to the dumb people who resize the screen to test responsiveness
    $(window).resize(function(){
      if($(window).width() < 450){
        fadeSliderBase.itemPerPage = 1
      } else if($(window).width() >= 450 && $(window).width() < 1000){
        fadeSliderBase.itemPerPage = 2
      } else {
        fadeSliderBase.itemPerPage = 4
      }
      fadeSliderBase.width = 100 / fadeSliderBase.itemPerPage
    })

    // Step 1: Initialize empty array of element indexes
    fadeSliderBase.arrayOfIndexes = Array.apply(null, {length: fadeSliderBase.totalItems}).map(function(_,index){return index})

    // Step 2: Get the element indexes that must be visible
    fadeSliderBase.elemsToShow    = selectElemFromArray(fadeSliderBase.arrayOfIndexes, fadeSliderBase.startIndex, fadeSliderBase.itemPerPage)

    // Step 3: Trigger displaying elements
    startAnim(fadeSliderBase.elemsToShow, fadeSliderBase.width)

    // Step 4: Increment the counter to the next image
    fadeSliderBase.startIndex += fadeSliderBase.itemPerPage

    // Perform Steps 1 through 4 at the specified `timeout`
    setTimeout(function(){
      startCarouselAnimation(fadeSliderBase.totalItems, fadeSliderBase.startIndex, fadeSliderBase.itemPerPage, fadeSliderBase.elemsToShow, fadeSliderBase.width, fadeSliderBase.timeout)
    }, fadeSliderBase.timeout)
  }

  function startCarouselAnimation(totalItems, startIndex, itemPerPage, elemsToShow, width, timeout){
    arrayOfIndexes = Array.apply(null, {length: totalItems}).map(function(_,index){return index})
    elemsToShow    = selectElemFromArray(arrayOfIndexes, startIndex, itemPerPage)
    startAnim(elemsToShow, width)
    startIndex += itemPerPage

    // Reset startIndex if it exceeds totalItems
    if(startIndex >= totalItems){
      startIndex = startIndex - totalItems
    }

    setTimeout(function(){
      startCarouselAnimation(fadeSliderBase.totalItems, fadeSliderBase.startIndex, fadeSliderBase.itemPerPage, fadeSliderBase.elemsToShow, fadeSliderBase.width, fadeSliderBase.timeout)
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

  function startAnim(indexes, width){
    var length = $('.custom-slider-element-clones', fadeSliderBase.wrapper).length
    if(length > 0){
      for(var i=0;i<length;i++){
        var elem = $($('.custom-slider-element-clones',  fadeSliderBase.wrapper)[i])
        if(i == length-1){
          elem.fadeOut(1000, function(){
            $('custom-slider-element-clones', fadeSliderBase.wrapper).remove()
            addElems(indexes, width)
          })
        } else{
          elem.fadeOut(1000)
        }
      }
    } else {
      addElems(indexes, width)
    }
  }

  function addElems(indexes, width){
    indexes.map(function(index){
      var elem  = fadeSliderBase.children[index]
      var clone = $(elem).clone()
      clone.addClass('custom-slider-element-clones')
      clone.removeClass('hidden')
      clone.attr('style', 'width: ' + width + '%;float: left;')
      fadeSliderBase.wrapper.append(clone)
      clone.hide().fadeIn(1000) // Set delay for new elements to be visible
    })
  }
 }(jQuery))