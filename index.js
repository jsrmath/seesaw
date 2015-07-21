// index.js
// Backend for json-visualizer
// Dependencies: jquery, jquery.zoomooz

var colors = ['#616161', '#FF9800', '#03A9F4', '#0097A7', '#FF5252', '#512DA8', '#388E3C', '#607D8B', '#E64A19', '#C2185B', '#1976D2', '#009688', '#795548', '#536DFE']
var colorIndex = -1;

// Keep track of which colors have been assigned to which keys
var assignedColors = {};

var focus = $('#root'); //which element is focused on?

var getColor = function (key) {
  if (!assignedColors[key]) {
    colorIndex += 1;
    if (colorIndex === colors.length) colorIndex = 0;

    assignedColors[key] = colors[colorIndex];
  }

  return assignedColors[key];
};

var renderPill = function (key, value, parent, depth) {
  var pill = document.createElement('div');
  $(pill).addClass('pill');
  $(pill).attr('data-depth', String(depth+1));

  if (typeof value === 'string') value = '"' + value + '"';
  if (value === null) value = 'null';

  $(pill).html('<div class="pill-key"></div><div class="pill-value"></div>');
  $(pill).find('.pill-key').text(key).css('background-color', getColor(key));
  $(pill).find('.pill-value').text(value);

  $(pill).appendTo(parent.find('.pills .container'));
};

var renderObj = function (key, obj, parent, depth) {
  var pills = [];
  var objs = [];

  // The innermost div in the rendering of this object
  // The contents of this object will be drawn inside of here
  var newParent;

  // Create an "each"able function for rendering something
  var renderer = function (func) {
    return function (i, e) {
      depth = depth || 0;
      func(e, obj[e], newParent, depth + 1);
    };
  };

  // Draw things in here
  // This should contain newParent
  var container = document.createElement('div');

  // <div class="pills"></div>
  var pillsObj;

  //init container
  $(container).addClass('container zoomable');

  //add data attributes
  $(container).attr('data-closeclick', 'true');
  $(container).attr('data-key', key);
  $(container).attr('data-depth', depth + 1);

  //add it to the parent
  $(parent).children('.boxes').append(container);

  // draw its contents
  $(container).html(
    '<div class="panel panel-default"></div>'
  );
  $(container).children('div.panel').append(
    '<div class="panel-heading"><h3 class="panel-title"></h3></div>'
  );
  $(container).children('div.panel').append(
    '<div class="panel-body"></div>'
  );

  //declare sub-.panel-body classes
  $(container).find('.panel-body').first().append('<div class="pills"><div class="container"></div></div>');
  $(container).find('.panel-body').first().append('<div class="boxes"></div>');

  //create newParent for next level of depth
  newParent = $(container).find('div.panel-body');

  //insert key
  $(container).find('h3').text(key);
  
  //style appropriately
  $(container).find('.panel').css('border-color', getColor(key));

  // Recursively draw contents
  $.each(obj, function (key, val) {
    if (val && typeof val === 'object') { // Object and not null
      objs.push(key);
    }
    else {
      pills.push(key);
    }
  });

  // make .pills zoomable
  if (pills.length) {
    pillsObj = $(container).find('.pills');
    pillsObj.find('.container').addClass('zoomable');
    pillsObj.find('.container').attr('data-key', ' ');
    pillsObj.attr('data-closeclick', 'true');
    pillsObj.attr('data-key', key);
    pillsObj.attr('data-depth', depth + 2);
  }

  //recursively render contents
  $.each(pills, renderer(renderPill));
  $.each(objs, renderer(renderObj));

  // Make pills inline-block iff there are objects in the same box
  if (objs.length) {
    $(newParent).children('.pills').addClass('inline-block');
  }

};

// Add sample elements to dropdown
$.each(sample, function (key) {
  $('select').append('<option value="' + key + '">' + key + '</option>');
});

//when a keystroke is triggered, navigate the tree
$(document).keyup(function (e) {
  switch (e.keyCode) {
    case 37: // left
      // if there is a previous of the same type,
      if(focus.prev().length){ 
        // go there
        focus.prev().click();
      } else { 
        //else, go up a level, move from boxes to pills, and try again
        focus.parent().prev().children('.zoomable').last().click();
      }
      break;
    case 39: // right
      //if there is a next of the same type,
      if(focus.next().length){
        //go there 
        focus.next().click(); 
      } else { 
        //else go up a level, move from pills to boxes, and try again
        focus.parent().next().children('.zoomable').first().click();
      }
      break;
    case 38: // up
      focus.parent().parent().parent().click(); //nested three deep
      break;
    case 40: // down
      //find the first container within
      focus.find('.zoomable').first().click(); 
      break;
    case 32: // space
      // get out of zoom mode
      $('#root .zoomable').first().click();
      break;
  }
});

//when #visualize is clicked, write to $('#root') .
$('#visualize').click(function (e) {
  e.preventDefault(); //refreshes in some browsers due to <form>

  var sampleName = $('select').val();
  var json;
  if (sampleName) {
    json = sample[sampleName];
  }
  else {
    json = $.parseJSON($('#input').val());
  }

  $('#root .boxes').empty(); // Clear current visualization
  $('select').val(''); // Clear dropdown
  colorIndex = -1; // Reset color index
  assignedColors = {}; // Clear assigned colors
  focus = $('#root');

  renderObj('root', json, $('#root'), 0);
  bindFocus();
});

var getKey = function (el) {
  // console.log(el);
  return el.attr('data-key');
};

var getParent = function (el) {
  return el.parent().parent().parent().parent();
  // each container --> panel --> panel.body --> .boxes --> container
};

var makeCrumbs = function (el) {
  var key = getKey(el);
  var array = [];
  while (key) {
    array.push(el);
    el = getParent(el);
    key = getKey(el);      
  }
  return array.reverse();
};

//placeholder
var renderCrumbs = function (arr) {
  $('ol.breadcrumb').empty();
  $.each(arr, function (i, e) {
    $('ol.breadcrumb').append('<li>' + getKey(e) + '</li>');
  });
  $('ol.breadcrumb').find('li:last').addClass('active');
};

var bindFocus = function () {
  //focus on a zoomable object
  $('.zoomable').unbind();
  $('.zoomable').click(function(e) {
    e.stopPropagation();
    
    $(this).zoomTo({
      root: $('#root'),
      targetsize: 0.75, 
      duration: 600
    });

    $(focus).find('.panel').first().css('box-shadow', 'none');

    focus = $(this);

    $(focus).find('.panel').first().css('box-shadow', '0px 0px 5px 5px ' + getColor(getKey(focus)));

    var cr = makeCrumbs($(this));
    renderCrumbs(cr);
  });
};

//testing purposes
$('#root').height($('#port').height());
$('#root').width($('#port').width());
renderObj('root', sample['obj3'], $('#root'), 0);

bindFocus();