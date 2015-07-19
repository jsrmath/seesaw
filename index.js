// index.js
// Backend for json-visualizer
// Dependencies: jquery

var colors = ['#FF5252', '#C2185B', '#536DFE', '#512DA8', '#1976D2', '#03A9F4', '#0097A7', '#009688', '#388E3C', '#FFA000', '#FF9800', '#E64A19', '#795548', '#616161', '#607D8B'];

var randomColor = function () {
  return colors[Math.floor(Math.random() * colors.length)];
};

var renderPill = function (key, value, parent) {
  var pill = document.createElement('div');
  $(pill).addClass('pill');
  $(pill).appendTo(parent.find('.pills'));

  $(pill).html('<div class="btn-group" > <button type="button" class="btn btn-info key" ></button>  <button type="button" class="btn btn-default value"></button> </div>');
  $(pill).find('.key').text(key);
  $(pill).find('.value').text(value);
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

  $(container).addClass('container');

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
};

// Add sample elements to dropdown
$.each(sample, function (key) {
  $('select').append('<option value="' + key + '">' + key + '</option>');
});

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

  $('.root').html(''); // Clear current visualization
  $('select').val(''); // Clear dropdown

  renderObj('root', json, $('.root'));

});
