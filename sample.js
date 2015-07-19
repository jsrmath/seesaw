var sample = {
  'obj0': {
    "foo": "bar",
    "glossary": {
      "title": "example glossary",
      "GlossDiv": {
        "title": "S"
      }
    },
    'baz': "bat"
  },

  'obj1': {
    "foo": "bar",
    "glossary": {
      "title": "example glossary",
      "GlossDiv": {
        "title": "S",
        "GlossList": {
          "GlossEntry": {
            "ID": "SGML",
            "SortAs": "SGML",
            "GlossTerm": "Standard Generalized Markup Language",
            "Acronym": "SGML",
            "Abbrev": "ISO 8879:1986",
            "GlossDef": {
              "para": "A meta-markup language, used to create markup languages such as DocBook.",
              "GlossSeeAlso": ["GML", "XML"]
            },
            "GlossSee": "markup"
          }
        }
      }
    },
    'baz': "bat"
  },

  'obj2': {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Product set",
    "type": "array",
    "items": {
      "title": "Product",
      "type": "object",
      "properties": {
        "id": {
          "description": "The unique identifier for a product",
          "type": "number"
        },
        "name": {
          "type": "string"
        },
        "price": {
          "type": "number",
          "minimum": 0,
          "exclusiveMinimum": true
        },
        "tags": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "minItems": 1,
          "uniqueItems": true
        },
        "dimensions": {
          "type": "object",
          "properties": {
            "length": {
              "type": "number"
            },
            "width": {
              "type": "number"
            },
            "height": {
              "type": "number"
            }
          },
          "required": ["length", "width", "height"]
        },
        "warehouseLocation": {
          "description": "Coordinates of the warehouse with the product",
          "$ref": "http://json-schema.org/geo"
        }
      },
      "required": ["id", "name", "price"]
    }
  },

  'obj3': [{
    "id": "0001",
    "type": "donut",
    "name": "Cake",
    "ppu": 0.55,
    "batters": {
      "batter": [{
        "id": "1001",
        "type": "Regular"
      }, {
        "id": "1002",
        "type": "Chocolate"
      }, {
        "id": "1003",
        "type": "Blueberry"
      }, {
        "id": "1004",
        "type": "Devil's Food"
      }]
    },
    "topping": [{
      "id": "5001",
      "type": "None"
    }, {
      "id": "5002",
      "type": "Glazed"
    }, {
      "id": "5005",
      "type": "Sugar"
    }, {
      "id": "5007",
      "type": "Powdered Sugar"
    }, {
      "id": "5006",
      "type": "Chocolate with Sprinkles"
    }, {
      "id": "5003",
      "type": "Chocolate"
    }, {
      "id": "5004",
      "type": "Maple"
    }]
  }, {
    "id": "0002",
    "type": "donut",
    "name": "Raised",
    "ppu": 0.55,
    "batters": {
      "batter": [{
        "id": "1001",
        "type": "Regular"
      }]
    },
    "topping": [{
      "id": "5001",
      "type": "None"
    }, {
      "id": "5002",
      "type": "Glazed"
    }, {
      "id": "5005",
      "type": "Sugar"
    }, {
      "id": "5003",
      "type": "Chocolate"
    }, {
      "id": "5004",
      "type": "Maple"
    }]
  }, {
    "id": "0003",
    "type": "donut",
    "name": "Old Fashioned",
    "ppu": 0.55,
    "batters": {
      "batter": [{
        "id": "1001",
        "type": "Regular"
      }, {
        "id": "1002",
        "type": "Chocolate"
      }]
    },
    "topping": [{
      "id": "5001",
      "type": "None"
    }, {
      "id": "5002",
      "type": "Glazed"
    }, {
      "id": "5003",
      "type": "Chocolate"
    }, {
      "id": "5004",
      "type": "Maple"
    }]
  }]
};