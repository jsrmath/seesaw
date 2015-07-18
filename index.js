// index.js
// Backend for json-visualizer
// Dependencies: jquery

var colors = ['#FF5252', '#C2185B', '#536DFE', '#512DA8', '#1976D2', '#03A9F4', '#0097A7', '#009688', '#388E3C', '#FFA000', '#FF9800', '#E64A19', '#795548', '#616161', '#607D8B'];

var randomColor = function () {
  return colors[Math.floor(Math.random() * colors.length)];
};

var renderPill = function (key, value, parent) {
  var pill = document.createElement('div');
  $(pill).appendTo(parent);

  $(pill).html(key + ':' + value);
};

var renderObj = function (key, obj, parent) {
  var pills = [];
  var objs = [];
  var div = document.createElement('div');
  var renderer = function (func) {
    return function (i, e) {
      func(e, obj[e], div);
    }
  };

  $(div).appendTo(parent);
  $(div).html(key);
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

var sampleObj = {"foo":"bar","glossary":{"title":"example glossary","GlossDiv":{"title":"S","GlossList":{"GlossEntry":{"ID":"SGML","SortAs":"SGML","GlossTerm":"Standard Generalized Markup Language","Acronym":"SGML","Abbrev":"ISO 8879:1986","GlossDef":{"para":"A meta-markup language, used to create markup languages such as DocBook.","GlossSeeAlso":["GML","XML"]},"GlossSee":"markup"}}}}};

renderObj('root', sampleObj, document.body);