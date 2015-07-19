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

  $(pill).html('<div class="btn-group" > <button type="button" class="btn btn-info key" ></button>  <button type="button" class="btn btn-default value"></button> </div>');
  $(pill).find('.key').text(key).css('background-color', getColor(key));
  $(pill).find('.value').text(value);

  $(pill).appendTo(parent.find('.pills'));
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

  //===================

  // Draw things in here
  // This should contain newParent
  var container = document.createElement('div');

  //init container
  $(container).addClass('container');

  //add data attributes
  $(container).attr('data-closeclick',"true");
  $(container).attr('data-key', key);
  $(container).attr('data-depth', String(depth+1));

  //add it to the parent
  $(parent).children('.boxes').append( $(container) );

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
  $(container).find('.panel-body').first().append('<div class="pills"></div>')
  $(container).find('.panel-body').first().append('<div class="boxes"></div>')

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
$('body').keyup(function (e) {
  switch (e.keyCode) {
    case 37: // left
      focus.prev().click();
      // console.log('left');
      break;
    case 39: // right
      focus.next().click();
      // console.log('right');
      break;
    case 38: // up
      focus.parent().parent().parent().click();
      // console.log('up');
      break;
    case 40: // down
      focus.find('.container').first().click();
      // console.log('down');
      break;
    case 16: // shift
      $('#root > .container').click();
      // console.log('esc');
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

  renderObj('root', json, $('#root'), 0);
  bindFocus();
});

var focus = $('#root'); //which element is focused on?

//testing purposes
$('#root').height($('#port').height());
$('#root').width($('#port').width());
renderObj('root', sample['obj3'], $('#root'), 0);

bindFocus();

function bindFocus(){
  //focus on a container
  $('.container').unbind();
  $('.container').click(function(e){
    e.stopPropagation();

    $(this).zoomTo({
      root: $('#root'),
      targetsize:0.75, 
      duration:600
    });

    $(focus).find('.panel').first().css('box-shadow', 'none');

    focus = $(this);

    $(focus).find('.panel').first().css('box-shadow', String('0px 0px 5px 5px '+getColor(getKey(focus))));

    var cr = makeCrumbs($(this));
    renderCrumbs(cr);
  });
}


function getKey(el){
  // console.log(el);
  return el.attr('data-key');
}

function getParent(el){
  return el.parent().parent().parent().parent();
  // each container --> panel --> panel.body --> .boxes --> container
}

function makeCrumbs(el){
  var key = getKey(el);
  var array = [];
  while ( key ) {
    array.push(el);
    el = getParent(el);
    key = getKey(el);      
  }
  return array.reverse();
}

//placeholder
function renderCrumbs(arr){
  console.log('rendering crumbs');
  $('ol.breadcrumb').empty();
  for(var i = 0; i < arr.length-1; i++){
    $('ol.breadcrumb').append('<li>'+getKey(arr[i])+'</li>');
  }
  // console.log(arr[arr.length-1]);
  $('ol.breadcrumb').append('<li class="active">'+getKey(arr[arr.length-1])+'</li>');
}



