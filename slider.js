var base = {}
function CustomSlider(options){
  base.wrapper  = options.wrapper
  base.children = $('div', options.wrapper)

  $(base.children).attr('style', 'display:none;')
  base.itemPerPage = options.perPage || 4

  if($(window).width() < 450){
    base.itemPerPage = 1
  } else if($(window).width() >= 450 && $(window).width() < 1000){
    base.itemPerPage = 2
  }

  base.startIndex  = 0
  base.timeout     = options.timeout || 4000
  base.width       = 100 / base.itemPerPage

  base.totalItems  = $(base.children).length

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
  base.startAnim(base.elemsToShow, base.width)

  // Step 4: Increment the counter to the next image
  base.startIndex += base.itemPerPage

  // Perform Steps 1 through 4 at the specified `timeout`
  setTimeout(function(){
    startCarouselAnimation(base.totalItems, base.startIndex, base.itemPerPage, base.elemsToShow, base.width, base.timeout)
  }, base.timeout)
}

function startCarouselAnimation(totalItems, startIndex, itemPerPage, elemsToShow, width, timeout){
  arrayOfIndexes = Array.apply(null, {length: totalItems}).map(function(_,index){return index})
  elemsToShow    = selectElemFromArray(arrayOfIndexes, startIndex, itemPerPage)
  base.startAnim(elemsToShow, width)
  startIndex += itemPerPage

  // Reset startIndex if it exceeds totalItems
  if(startIndex >= totalItems){
    startIndex = startIndex - totalItems
  }

  setTimeout(function(){
    startCarouselAnimation(totalItems, startIndex, itemPerPage, elemsToShow, width, timeout)
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

base.startAnim = function(indexes, width){
  var length = $('.custom-slider-element-clones', base.wrapper).length
  if(length > 0){
    for(var i=0;i<length;i++){
      var elem = $($('.custom-slider-element-clones',  base.wrapper)[i])
      if(i == length-1){
        elem.fadeOut(1000, function(){
          $('custom-slider-element-clones', base.wrapper).remove()
          base.addElems(indexes, width)
        })
      } else{
        elem.fadeOut(1000)
      }
    }
  } else {
    base.addElems(indexes, width)
  }
}

base.addElems = function(indexes, width){
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