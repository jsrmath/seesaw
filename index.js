// index.js
// Backend for json-visualizer
// Dependencies: jquery

var colors = ['#616161', '#FF9800', '#03A9F4', '#0097A7', '#FF5252', '#512DA8', '#388E3C', '#607D8B', '#E64A19', '#C2185B', '#1976D2', '#009688', '#795548', '#536DFE']
var colorIndex = -1;

// Keep track of which colors have been assigned to which keys
var assignedColors = {};

var getColor = function (key) {
  if (!assignedColors[key]) {
    colorIndex += 1;
    if (colorIndex === colors.length) colorIndex = -1;

    assignedColors[key] = colors[colorIndex];
  }

  return assignedColors[key];
};

var renderPill = function (key, value, parent, depth) {
  var pill = document.createElement('div');
  $(pill).addClass('pill');
  $(pill).attr('data-depth', String(depth+1));
  $(pill).appendTo(parent.find('.pills'));

  $(pill).html('<div class="btn-group" > <button type="button" class="btn btn-info key" ></button>  <button type="button" class="btn btn-default value"></button> </div>');
  $(pill).find('.key').text(key);
  $(pill).find('.value').text(value);
  $(pill).addClass('pill');
  $(pill).appendTo(parent.find('.pills'));

  $(pill).html('<div class="btn-group"> <button type="button" class="btn key"></button>  <button type="button" class="btn btn-default value"></button> </div>');
  $(pill).find('.key').text(key);
  $(pill).find('.value').text(value);

  $(pill).find('.key').css('background-color', getColor(key));
};

var renderObj = function (key, obj, parent, depth) {
  var pills = [];
  var objs = [];

  // The innermost div in the rendering of this object
  // The contents of this object will be drawn inside of here
  var newParent;

  // Draw things in here
  // This should contain newParent
  var container = document.createElement('div');

    $(container).addClass('container zoomTarget');
    $(container).attr('data-closeclick',"true");
    $(container).attr('data-depth', String(depth+1));

  // Create an "each"able function for rendering something
  var renderer = function (func) {
    return function (i, e) {
      depth = depth || 0;
      func(e, obj[e], newParent, depth + 1);
    };
  };

  
  $(container).appendTo(parent);    

  // Draw stuff inside container
  $(container).html('<div class="panel panel-default zoomTarget" data-closeclick="true"></div>');
  $(container).children('div.panel').append('<div class="panel-heading"><h3 class="panel-title"></h3></div>');
  $(container).children('div.panel').append('<div class="panel-body"></div>');  

  $(container).find('h3').text(key);
  $(container).find('.panel').css('border-color', getColor(key));

  newParent = $(container).find('div.panel-body');
  $(newParent).html('<div class="pills"></div>')


  
  // Recursively draw contents
  $.each(obj, function (key, val) {
    if (val && typeof val === 'object') { // Object and not null
      objs.push(key);
    }
    else {
      pills.push(key);
    }
  });

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
$("body").keyup(function(e) {
  if(e.keyCode == 37) { // left
    console.log('left');
    $('.selectedZoomTarget').prev().click();
  } else if(e.keyCode == 39) { // right
    console.log('right');
    $('.selectedZoomTarget').next().click();
  } else if (e.keyCode == 38){ // up
    console.log('up');
    $('.selectedZoomTarget').closest('.zoomTarget').click();
  } else if (e.keyCode == 40) { //down
    console.log('down');    
    $('.selectedZoomTarget').find('.zoomTarget').first().click();
  } else if (e.keyCode == 27) { //esc
    console.log('esc');
    $('#root > .zoomTarget').click();
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
    console.log($.parseJSON($('#input').val()));
    json = $.parseJSON($('#input').val());
  }

  $('.root').empty(); // Clear current visualization
  $('select').val(''); // Clear dropdown

  renderObj('root', json, $('#root'), 0);
});

//placeholder
function renderCrumbs(){
  console.log('rendering crumbs');
}

//testing purposes
renderObj('root', sample['obj3'], $('#root'), 0);