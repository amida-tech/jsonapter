jsonapter
=====================

Template Rules based JSON Transformer

[![NPM](https://nodei.co/npm/@amida-tech/jsonapter.png)](https://nodei.co/npm/@amida-tech/jsonapter/)

[![Build Status](https://travis-ci.org/amida-tech/jsonapter.svg)](https://travis-ci.org/amida-tech/jsonapter)
[![Coverage Status](https://coveralls.io/repos/amida-tech/jsonapter/badge.png)](https://coveralls.io/r/amida-tech/jsonapter)

This library provides a template rules based formalism to describe JSON to JSON transformations declaratively.  This formalism is primarily designed for health data translation between various formats such as FHIR and CCDA.

## Usage

In its most basic form JSON to JSON transformations are described by a template object where [`content`](#content) properties recursively describe destination keys, [`dataKey`](#dataKey) properties describe source keys, and [`value`](#value) properties describe formatting
```js
var upper = function(input) {
	return input ? input.toUpperCase() : null;
};

var template = {
    content: {
        dest_a: {
            dataKey: 'a.c'
        },
        dest_b: {
            content: {
                dest_b0: {
                    value: upper,
                    dataKey: 'b.c'
                },
                dest_b1: {
                    value: upper,
                    dataKey: 'd'
                }
            },
            dataKey: 'a'
        }
    }
};
```
An engine instance is available from jsonapter and can be used to transform an `input` as described by the template
```js
var bbj2j = require('jsonapter');
var j2j = bbj2j.instance();

var input = {
    a: {
        b: {
            c: 'value_0'
        },
        c: 'value_2',
        d: 'value_1'
    }
};

var r = j2j.run(template, input);
console.log(r); // {dest_a: 'value_2', dest_b: {dest_b0: 'VALUE_0', dest_b1: 'VALUE_1'}}
```

## Standard Template Rules

The following are the list of all keys that have special meaning in template objects
- [`dataKey`](#dataKey)
- [`value`](#value)
- [`content`](#content)
- [`arrayContent`](#arrayContent)
- [`constant`](#constant)
- [`existsWhen`](#existsWhen)
- [`existsEither`](#existsEither)
- [`existsUnless`](#existsUnless)
- [`dataTransform`](#dataTransform)
- [`default`](#default)
- [`multiple`](#multiple)
- [`single`](#single)
- [`firstOf`](#firstOf)
- [`assign`](#assign)
- [`ignoreDeep`](#ignoreDeep)
- [`paramKey`](#paramKey)
- [`arrayIndex`](#arrayIndex)
- [`size`](#size)
- [`timeStamp`](#timeStamp)
- [`template`](#template)
- [`skip`](#skip)
- [`output`](#output)
- [`pick`](#pick)
- [`omit`](#omit)

### <a id="dataKey"></a>`dataKey` rule ###

This rule selects a particular property of input. It can a `string`, `array` or `function`.
```js
var template = {
    dataKey: 'a'
};

var r0 = j2j.run(template, {
    a: 1,
    b: 2
});
console.log(r0); // 1

var r1 = j2j.run(template, {
    b: 2
});
console.log(r1); // null


var r2 = j2j.run(template, {
    a: {
        b: 2
    }
});
console.log(r2); // {b: 2}
```

The properties can be deep
```js
var template = {
    dataKey: 'a.b.c'
};

var r0 = j2j.run(template, {
    a: {
        b: {
            c: 'value'
        }
    }
});
console.log(r0); // 'value'

var r1 = j2j.run(template, {
    a: 2
});
console.log(r1); // null
```

If the property or any of the properties on the deep property is an array `dataKey` you can use jsonave
```js
var jsonave = require('@amida-tech/jsonave').instance;

var template = {
    dataKey: jsonave('a.b[*].c')
};

var r = j2j.run(template, {
    a: {
        b: [{
            c: 'value_0'
        }, {
            d: 'value_1'
        }, {
            c: 'value_2'
        }]
    }
});
console.log(r); // ['value_0', 'value_2']
```
Currently only one array on a deep property is supported.  Multiple arrays will result in array of arrays.

`0` on a deep property is treated as a special case and selects the first element of the array
```js
var template = {
    dataKey: 'a.b.0.c'
};

var r = j2j.run(template, {
    a: {
        b: [{
            c: 'value_0'
        }, {
            d: 'value_1'
        }, {
            c: 'value_2'
        }]
    }
});
console.log(r); // 'value_0'
```

`dataKey` can be a function.  In particular JSONPath expressions are particularly useful and available from [jsonave](https://github.com/amida-tech/jsonave)
```js
var jsonave = require('@amida-tech/jsonave').instance;
var template = {
    dataKey: jsonave('book[1:].price')
};

var r = j2j.run(template, {
    book: [{
        price: 10
    }, {
        price: 20
    }, {
        price: 30
    }]
});

console.log(r); // [20, 30]
```
One can pass a `source` parameter which can have value `parent`. It will lookup from the parent object.

The `template` below will 

```js

var template = {
    dataKey: "data",
    template: {
        dataKey: "address",
        content: {
            company: {dataKey: "company", source: "parent"},
            street: {dataKey: "street"},
            city: {dataKey: "city"},
            state: {dataKey: "state"},
            zip: {dataKey: "zip"}
        }
    }
};

var input = {
    data: {
        company: "Google",
        address: {
            street: "1600 Amphitheatre Parkway",
            city: "Mountain View",
            state: "CA",
            zip: 94043
        }
    }
};

```
This will produce the following output :

```js

{
    company: "Google",
    street: "1600 Amphitheatre Parkway",
    city: "Mountain View",
    state: "CA",
    zip: 94043
};

```


A second [`context`](#context) parameter is also passed to `dataKey` functions.  By default this parameter is an empty object but that can be [overridden](#context).  This is useful to further customize JSONPath function.

`dataKey` can be an array.  In that case the first deep property that evaluates to a value that is not `null` is selected
```js
var template = {
    dataKey: ['a.b', 'a.c']
};

var r0 = j2j.run(template, {
    a: {
        b: 1,
        c: 2
    }
});
console.log(r0); // 1

var r1 = j2j.run(template, {
    a: {
        c: 3
    }
});
console.log(r1); // 3

var r2 = j2j.run(template, {
    a: {
        d: 4
    }
});
console.log(r2); // null
```

### <a id="paramKey"></a>`paramKey` rule ###

This rule selects a particular property of params, which can be passed as a optional third parameter to the run function as shown below :
```js
var template = {
    paramKey: 'a'
};

var r0 = j2j.run(template, {}, {
    a: 1
});
console.log(r0); // 1
```

The `paramKey` value can be an object

```js

var template = {
    paramKey: 'paramObject'
};

var r0 = j2j.run(template, {}, {
    paramObject: {
        a : {
            b: "test"
        }
    }
});
console.log(r0);

{
   a : {
          b: "test"
   }
}
```

### <a id="arrayIndex"></a>`arrayIndex` rule ###
This rule is primarily used to get the index of the array. Optionally `start` can be given.
Without `start` it will be zero based as usual.

```js
      var template = {
          content: {
              cost: {dataKey: 'price'},
              num: {arrayIndex: {}}
          }
      };

      var r = j2j.run(template,
          [{
              price: 20
          }, {
              price: 30
          }]);

console.log(r); // // [{cost: 20, num: 0}, {cost: 30, num: 1}]
```

With `start` :

```js

      var template = {
          content: {
              cost: {dataKey: 'price'},
              num: {arrayIndex: {start: 1}}
          }
      };

      var r = j2j.run(template,
          [{
              price: 20
          }, {
              price: 30
          }]);

console.log(r); // // [{cost: 20, num: 1}, {cost: 30, num: 2}]
```

### <a id="timeStamp"></a>`timeStamp` rule ###

This rule is  used to get timeStamp as `{occurred: {timeStamp: {serialize: true}}`. 
It will produce an output `occurred: "2017-06-12T22:54:39.502Z"`. 
The `serialize` option is `true` by default. If it is `false` it will keep it a `Date` object.
The `serialize` option can be a `function` as well which one can use to formar the `Date` object.
If the timeStamp tag is invoked multiple times in the same template the output will be same. 

This rule is primarily used to get the length of an array. It is also valid for length of string and object.
If it is in the context of an array the `size` will print the length of the array. If not it will check if it is in the same template with the `dataKey`.

```js
      var template = {
          content: {
              cost: {dataKey: 'price'},
              num: {arrayIndex: {}},
              total: {size: {}}
          }
      };

      var r = j2j.run(template,
          [{
              price: 20
          }, {
              price: 30
          }]);

console.log(r); // // [{cost: 20, total:2, num: 0}, {cost: 30, total:2, num: 1}]
```

```js
        var template = {dataKey: 'name', size: {}};
        var r = j2j.run(template, {
            name: 'USA'
        });
        //console.log(r); // 3
        expect(r).to.deep.equal(3);
```
### <a id="template"></a>`template` rule ###

This rule is primarily used to apply a nested template.
```js
var nestedTemplate = {
    value: function(input) {
        return input.toUpperCase();
    },
    dataKey: 'b'
};

var template = {
    template: nestedTemplate,
    dataKey: 'a'
};

var r = j2j.run(template, {
    a: {
        b: 'value'
    }
});
console.log(r); // 'VALUE'
```

### <a id="value"></a> `value` rule ###

This rule is primarily used to format `input` or `input` property that is selected by `dataKey`.  In this case it is a function
```js
var template = {
    value: function (input) {
        return input.toUpperCase();
    },
    dataKey: 'name'
};

var r = j2j.run(template, {
    name: 'joe'
});
console.log(r); // JOE
```
```js
var template = {
    value: function (input) {
        return input.toUpperCase();
    }
};


var r = j2j.run(template, 'joe');
console.log(r); // JOE
```
One can also use the parent inside the value function.

```js
var template = {
    value: function (input, parent) {
        return parent.title.toUpperCase() + ' ' + input.toUpperCase();
    },
    dataKey: 'name'
};

var r = j2j.run(template, {
    name: 'joe',
    title: 'mr'
});
console.log(r); // MR JOE
```


One can also use the params to the value function.
```js
var template = {
    dataKey: 'name',
    value: function (input, parent, params) {
        return params.title[input.gender] + ' ' + input;
    }
};

var params = {title: { M: 'Mr', F: 'Ms'}};

var input = {name: 'Joe', gender: 'M'};

var r = j2j.run(template, input, params);
console.log(r); // Mr Joe

var input1 = {name: 'Jane', gender: 'F'};

var r1 = j2j.run(template, input1, params);
console.log(r1); // Ms Jane

```


This rule can be used to return a primary data type
```js
var template = {
    value: 'names are classified',
    dataKey: 'name'
};

var r = j2j.run(template, {
    name: 'joe'
});
console.log(r); // 'names are classified'
```

This rule can be used to as lookup. When it is an object without `dataKey` we take it as literally.
The `value` can not be used as a nested template. If `dataKey` is provided one can use it for lookup as shown below:

```js
var template = {
    content: {
         title: {
            dataKey: "gender",
            value: {
                M: 'Mr',
                F: 'Ms'
             }
            },
         name : { dataKey: "name" }
    }
};

var input = {name: 'Joe', gender: 'M'};

var r = j2j.run(template, input);

console.log(r); // { title: "Mr", name : "Joe" }


```

One can also pass extra parameter to the `value` function. For this to work one has to pass `params` in the template:
The `value` function needs to written with `extraParams` as the last parameter.

```js

var template = {
    value: function (input, parent, params, extraParams) {
        return (input > extraParams) ? input - extraParams: null;
    },
    params: 50
};

var input = [50, 51, 52];

var r = j2j.run(template, input);

console.log(r); // [1, 2]

```

### <a id="content"></a> `content` rule ###

This rule is used to describe a new object based on `input`.  The property keys of the `content` becomes the properties in the destination object.  The property values of `content` are primarily other templates.
This is an object and cannot be empty.

```js
var nameTemplate = {
    content: {
        last: {
            dataKey: 'familyName'
        },
        first: {
            dataKey: 'givenName'
        }
    }
};

var template = {
    content: {
        name: nameTemplate,
        age: {
            value: function (input) {
                return 2015 - input;
            },
            dataKey: 'birthYear'
        }
    }
};

var r = j2j.run(template, {
    familyName: 'DOE',
    givenName: 'JOE',
    birthYear: 1980
});
console.log(r); // {name: {last: 'DOE', first: 'JOE'}, age: 35}
```

The `content` property values can also be formatting functions or primary data types which shortcuts the need to use `value` rule for those cases
```js
var nameTemplate = {
    content: {
        last: {
            dataKey: 'familyName'
        },
        first: {
            dataKey: 'givenName'
        }
    }
};

var template = {
    content: {
        type: 'Report',
        title: function (input) {
            return input.gender === 'M' ? 'Mr.' : 'Ms.';
        },
        name: nameTemplate,
        age: {
            value: function (input) {
                return 2015 - input;
            },
            dataKey: 'birthYear'
        }
    }
};

var r = j2j.run(template, {
    familyName: 'DOE',
    givenName: 'JOE',
    gender: 'M',
    birthYear: 1980
});
console.log(r); // {type: 'Report', title: 'Mr.', name: {last: 'DOE', first: 'JOE'}, age: 35}
```

The `content` property keys can be deep
```js
var template = {
    content: {
        'name.last': {
            dataKey: 'familyName'
        },
        'name.first': {
            dataKey: 'givenName'
        }
    }
};

var r = j2j.run(template, {
    familyName: 'DOE',
    givenName: 'JOE'
});
console.log(r); // {name: {last: 'DOE', first: 'JOE'}}
```

### <a id="arrayContent"></a> `arrayContent` rule ###

This rule is similar to `content` but is used to describe an `array` instead of an `object` based on `input`.  The array elements of the `arrayContent` becomes the array elements in the destination object.  Otherwise the array elements of the `arrayContent` work identically to properties of the `content`
This is an array and cannot be empty.

```js
var nameTemplate = {
    arrayContent: [{
        dataKey: 'familyName'
    }, {
        dataKey: 'givenName'
    }]
};

var template = {
    content: {
        name: nameTemplate,
        age: {
            value: function (input) {
                return 2015 - input;
            },
            dataKey: 'birthYear'
        }
    }
};

var r = j2j.run(template, {
    familyName: 'DOE',
    givenName: 'JOE',
    birthYear: 1980
});
console.log(r); // {name: ['DOE', 'JOE'], age: 35}
```

### <a id="constant"></a> `constant` rule ###

When values in `value` rule and property values in `content` rule are objects, they are assumed to be nested templates.  `constant` rule makes it possible to define a constant object within template
```js
var template = {
    content: {
        codes: {
            constant: {
                'Y': 'yellow',
                'R': 'red'
            }
        },
        'color.back': {
            dataKey: 'backgroundColor'
        },
        'color.fore': {
            dataKey: 'foreGroundColor'
        }
    }
};

var r = j2j.run(template, {
    backgroundColor: 'Y',
    foreGroundColor: 'R'
});
console.log(r); // {codes: {Y: 'yellow', R: 'red'}, color: {back: 'Y', fore: 'R'}}
```

You can also use primary data types in `constant` rule as alternatives to directly specifying them with `content` and `value` rules
```js
var template = {
    constant: 'CONST'
};

var r = j2j.run(template, {
    any: 'any'
});
console.log(r); // 'CONST'
```

### <a name="existsWhen"></a> `existsWhen` rule ###

This rule must be a predicate or array of predicates. If the predicate evaluates to false, the template is ignored.  This rule is evaluated before any other rule on the same level.
The predicate can be a `function`, an `object` or a simple `property`. If it is an object or a simple property it works just like [iteratee](https://lodash.com/docs/4.16.3#iteratee) in lodash.
The property can be in the input or in the params.  It is to be noted that this feature is little different from the value function which is supplied with params as well as input.
For the value function the input and the params are available at the same time to the `function`.

```js
var _ = require('lodash');

var template = {
    content: {
        dest_a: {
            dataKey: 'a'
        },
        dest_b: {
            dataKey: 'b',
            existsWhen: _.partialRight(_.has, 'c')
        }
    },
    existsWhen: 'public'
};

var r0 = j2j.run(template, {
    a: 'value_a',
    b: 'value_b',
    public: true
});
console.log(r0.dest_a); // 'value_a'
console.log(r0.dest_b); // undefined

var r1 = j2j.run(template, {
    a: 'value_a',
    b: 'value_b',
    c: 0,
    public: true
});
console.log(r1.dest_a); // 'value_a'
console.log(r1.dest_b); // 'value_b'

var r2 = j2j.run(template, {
    a: 'value_a',
    b: 'value_b',
    c: 0
});
console.log(r2); // null because public is not present


var r3 = j2j.run(template, {
    a: 'value_a',
    b: 'value_b'
},
{
    public: true,
    c: 0
}
);

//console.log(r3.dest_a); // 'value_a'
//console.log(r3.dest_b); // 'value_b'

```

If this rule is an array, each predicate in the array must evaluate to true

```js
var _ = require('lodash');

var template = {
    content: {
        dest_a: {
            dataKey: 'a'
        },
        dest_b: {
            dataKey: 'b'
        }
    },
    existsWhen: [_.partialRight(_.has, 'c'), _.partialRight(_.has, 'd')]
};

var r0 = j2j.run(template, {
    a: 'value_a',
    b: 'value_b',
    c: 'available'
});
console.log(r0); // null

var r1 = j2j.run(template, {
    a: 'value_a',
    b: 'value_b',
    d: 'available'
});
console.log(r1); // null

var r2 = j2j.run(template, {
    a: 'value_a',
    b: 'value_b',
    c: 'available',
    d: 'available'
});
console.log(r2.dest_a); // 'value_a'
console.log(r2.dest_b); // 'value_b'
```

### <a id="existsEither"></a> `existsEither` rule ###

This rule must be an array of predicates. If all the predicates evaluates to false, the template is ignored.  This rule is evaluated before any other rule on the same level.
The predicate can be a function, an object or a simple property. If it is an object or a simple property it works just like [iteratee](https://lodash.com/docs/4.16.3#iteratee) in lodash.

```js
var _ = require('lodash');

var template = {
    content: {
        dest_a: {
            dataKey: 'a'
        },
        dest_b: {
            dataKey: 'b'
        }
    },
    existsEither: [_.partialRight(_.has, 'c'), _.partialRight(_.has, 'd')]
};

var r0 = j2j.run(template, {
    a: 'value_a',
    b: 'value_b',
    c: 'available'
});
console.log(r0.dest_a); // 'value_a'
console.log(r0.dest_b); // 'value_b'

```

### <a id="existsUnless"></a> `existsUnless` rule ###

 This rule must be a predicate or array of predicates. If the predicate evaluates to true, the template is ignored.  This rule is evaluated before any other rule but existsWhen.

```js
var _ = require('lodash');

var template = {
    content: {
        dest_a: {
            dataKey: 'a'
        },
        dest_b: {
            dataKey: 'b',
            existsUnless: _.partialRight(_.has, 'c')
        }
    },
    existsUnless: function (input) {
        return input && input.private;
    }
};

var r0 = j2j.run(template, {
    a: 'value_a',
    b: 'value_b',
    c: 0,
    private: false
});
console.log(r0.dest_a); // 'value_a'
console.log(r0.dest_b); // undefined

var r1 = j2j.run(template, {
    a: 'value_a',
    b: 'value_b'
});
console.log(r1.dest_a); // 'value_a'
console.log(r1.dest_b); // 'value_b'

var r2 = j2j.run(template, {
    a: 'value_a',
    b: 'value_b',
    private: true
});
console.log(r2); // null
```

If this rule is an array, each predicate in the array must evaluate to true for the template to evaluate to `null`.

```js
var _ = require('lodash');

var template = {
    content: {
        dest_a: {
            dataKey: 'a'
        },
        dest_b: {
            dataKey: 'b'
        }
    },
    existsUnless: [_.partialRight(_.has, 'c'), _.partialRight(_.has, 'd')]
};

var r0 = j2j.run(template, {
    a: 'value_a',
    b: 'value_b',
    c: 'available'
});
console.log(r0.dest_a); // 'value_a'
console.log(r0.dest_b); // 'value_b'

var r1 = j2j.run(template, {
    a: 'value_a',
    b: 'value_b',
    d: 'available'
});
console.log(r1.dest_a); // 'value_a'
console.log(r1.dest_b); // 'value_b'

var r2 = j2j.run(template, {
    a: 'value_a',
    b: 'value_b',
    c: 'available',
    d: 'available'
});
console.log(r2); // null
```

### <a id="dataTransform"></a> `dataTransform` rule ###

This rule transforms `input` so that existing templates can be reused. It can be a string, or an `object` (another jsonapter template) as well as a `function`.
```js
var nameTemplate = {
    content: {
        last: {
            dataKey: 'familyName'
        },
        first: {
            dataKey: 'givenName'
        }
    }
};

var template = {
    content: {
        name: {
        	template: nameTemplate,
			    dataTransform: function(input) {
				    return {
					    familyName: input.lastName,
					    givenName: input.firstName
				    };
			  }
		},
        age: {
            value: function (input) {
                return 2015 - input;
            },
            dataKey: 'birthYear'
        }
    }
};

var r = j2j.run(template, {
    lastName: 'DOE',
    firstName: 'JOE',
    birthYear: 1980
});
console.log(r); // {name: {last: 'DOE', first: 'JOE'}, age: 35}
```

In the above example `dataTransform` can be a jsonapter template as shown below :
```js

    dataTransform: {
        content: {
           familyName: { dataKey: "lastName" }
           givenName: { dataKey: "firstName" }
       }
    }
```

### <a id="default"></a> `default` rule ###

This rule can be used to assign default values after templates are evaluated to be `null`
The `default` can be a `function` as well. If `function` one can use the `input`, `parent`, and `params` just like `value` as `function`.

```js
var template = {
    content: {
        last: {
            dataKey: 'familyName',
            default: 'unknown'
        },
        first: {
            dataKey: 'givenName',
            default: function() {return 'unknown';}
        },
        title: {
            dataKey: 'title',
            default: function getTitle(input, parent, params) {
                if (parent.gender === 'M') {
                    return "MR";
                } else if (parent.gender === 'F') {
                    return "MS";
                } else {
                    return null;
                }
            }
        }
    }
};

var r0 = j2j.run(template, {
    familyName: 'DOE',
    givenName: 'JOE'
});
console.log(r0); // {last: 'DOE', first: 'JOE', title: null}

var r1 = j2j.run(template, {
    familyName: 'DOE'
});
console.log(r1); // {last: 'DOE', first: 'unknown', title: null}

var r2 = j2j.run(template, {
    givenName: 'JOE'
});
console.log(r2); // {last: 'unknown', first: 'JOE', title: null}

var r3 = j2j.run(template, {
    familyName: 'DOE',
    givenName: 'JOE',
    gender: 'M'
});
console.log(r3); // {last: 'unknown', first: 'JOE', title: 'MR'}

```

### <a name="multiple"></a> `multiple` rule ###

This rule can be used to change a template evaluted value into a one element array
```js
var template = {
    content: {
        last: {
            dataKey: 'familyName'
        },
        given: {
            dataKey: 'givenName',
            multiple: true
        }
    }
};

var r = j2j.run(template, {
    familyName: 'DOE',
    givenName: 'JOE'
});
console.log(r); // {last: 'DOE', given: ['JOE']}
```
<a name="single" />
#### `single` rule

This rule can be used to select the first value of a template evaluated array.  This is especially useful for conditional JSONPath expression
```js
var jsonave = require('@amida-tech/jsonave').instance;
var template = {
    dataKey: jsonave('book[?(@.id==="AF20")].price'),
    single: true
};

var r = j2j.run(template, {
    book: [{
        id: "AA10",
        price: 10
    }, {
        id: "AF20",
        price: 20
    }, {
        id: "AB15",
        price: 30
    }]
});

console.log(r); // 20
```

### <a id="firstOf"></a> `firstOf` rule ###

This rule must be assigned to an array of other templates and selects the first one that does not evaluate to `null`
```js
var nameTemplate = {
    content: {
        last: {
            dataKey: 'familyName'
        },
        first: {
            dataKey: 'givenName'
        }
    },
    existsWhen: function (input) {
        return input && input.familyName && input.givenName;
    }
};

var template = {
    firstOf: [nameTemplate, {
        dataKey: 'familyName'
    }]
};

var r0 = j2j.run(template, {
    familyName: 'DOE',
    givenName: 'JOE'
});
console.log(r0); // {last: 'DOE', first: 'JOE'}

var r1 = j2j.run(template, {
    familyName: 'DOE'
});
console.log(r1); // 'DOE'

var r2 = j2j.run(template, {
    givenName: 'JOE'
});
console.log(r2); // null
```

You can also include a primary data type as the last element to simulate a default
```js
var nameTemplate = {
    content: {
        last: {
            dataKey: 'familyName'
        },
        first: {
            dataKey: 'givenName'
        }
    },
    existsWhen: function (input) {
        return input && input.familyName && input.givenName;
    }
};

var template = {
    firstOf: [nameTemplate, 'UNKNOWN']
};

var r0 = j2j.run(template, {
    familyName: 'DOE',
    givenName: 'JOE'
});
console.log(r0); // {last: 'DOE', first: 'JOE'}

var r1 = j2j.run(template, {
    familyName: 'DOE'
});
console.log(r1); // 'UNKNOWN'
```

### <a id="assign"></a> `assign` rule ###

This rule accepts an array of other templates that generate object results and works similar to [lodash assign method](https://lodash.com/docs#assign).  `assign` rule is primarily used to reuse existing templates to obtain a new one.
This is an array and cannot be empty.
```js
var nameTemplate = {
    content: {
        last: {
            dataKey: 'familyName'
        },
        first: {
            dataKey: 'givenName'
        }
    }
};

var template = {
    assign: [{
        content: {
            id: function (input) {
                return input.givenName[0] + input.familyName;
            }
        }
    }, nameTemplate]
};


var r = j2j.run(template, {
    familyName: 'DOE',
    givenName: 'JOE'
});
console.log(r); // {id: 'JDOE', last: 'DOE', first: 'JOE'}
```

### <a id="ignoreDeep"></a> `ignoreDeep` rule ###

This rule can be used when dots in [content](#content) keys are part of the key rather than describing a path
```js
var template = {
    content: {
        'name.last': {
            dataKey: 'familyName'
        },
        'name.first': {
            dataKey: 'givenName'
        }
    },
    ignoreDeep: true
};

var r = j2j.run(template, {
    familyName: 'DOE',
    givenName: 'JOE'
});
console.log(r); // {'name.last': 'DOE', 'name.first': 'JOE'}
```

## Prune Values

From the instance we can pass a third object parameter, as options, with an array named as `pruneValues`, to drop all the keys from the final output which have any of the values represented by the strings present in `pruneValues` array. This can always be override by using [`default`](#default) rule.
Array pruneValues can take a min of 1 to a max of 3 string based rule. Comes in handy if we need to enforce dirty check on the templates.

As of now values which can be pruned are:

- `emptyString`
- `emptyArray`
- `NaN`

```js

var bbj2j = require('jsonapter');

var options =   {pruneValues: ['emptyString', 'emptyArray', 'NaN']};

var j2j = bbj2j.instance(null,null,options);


var sampleInput = {
    firstName: 'TIM',
    lastName:'DOE',
    middleName:'JOE',
    familyName:'',
    address:'',
    age:NaN,
    numbers:[],
    friends:[],
    groups:[1,2]
};

var sampleTemplate = {
    content: {
        firstName: {
            dataKey: 'firstName'
        },
        middleName: {
            dataKey: 'middleName'
        },
        lastName: {
            dataKey: 'lastName'
        },
        familyName: {
            dataKey: 'familyName'
        },
        address: {
            dataKey: 'address', default: ""
        },
        age: {
            dataKey: 'age'
        },
        numbers:{
            dataKey:'numbers', default:[]
        },
        friends:{
            dataKey:'friends'
        },
        groups:{
            dataKey:'groups'
        }
    }
};

var r = j2j.run(sampleTemplate, sampleInput);

console.log(r); // {"firstName": "TIM", "middleName": "JOE", "lastName": "DOE", "address": "", "numbers": [], "groups": [1,2]}
```

### <a id="skip"></a> `skip` rule ###

This rule is used to skip a template.

```js
var nestedTemplate = {
    dataKey: 'b',
    skip: true
};

var template = {
    template: nestedTemplate,
    dataKey: 'a'
};

var r = j2j.run(template, {
    a: {
        b: 'value'
    }
});
console.log(r); // null
```


### <a id="output"></a> `output` rule ###

The `output` tag is there to modify final result. It can be either `string`, `boolean`, `number`, `object` or `function`.
When it is a function it's first argument is the `result` of the template as shown below :

```js

var template = {
            dataKey: 'name',
            output: function(result, input, parent, params) {
                // return some other result
            }
     }
```

It is almost similar to the `value` as `function` but unlike `value` it is not an action key.
The `value` tag cannot be present along with other actionKeys e.g `content`, `arrayContent` etc.
The `output` tag can be specified by simply including `{output: string}` or `output: {type: string}`.
With the second option more features are available e.g. `substring`,  `upperCase`, etc.

If the result of the template is a string then the output tag can be omitted and the string options can be used. 
Similarly if result of the template is boolean then boolean option can be used without using the output tag.

If output is string then these options are available e.g `split`, `substring`, `prefix`, `upperCase`, `lowerCase`, etc.
Here is the complete list of all available options for all types. 

| Type      |   options    |   Format
----------- |:------------:|:------------------------------
| string    |   split      |  `split`: {`separator`(optional): "-"}, if no separator it will be white space
| string    |   trim       |  `trim`: true
| string    |   substring  |  `substring`: {start(optional): 1, end(optional): 5}
| string    |   upperCase  |  `upperCase`: true
| string    |   lowerCase  |  `lowerCase`: true
| string    |   prefix     |  `prefix`: "a"
| string    |   suffix     |  `suffix`: "b"
| array     |   join       |  `join`: {`separator`(optional): "-"}, if no separator it will be ,(comma)
| array     |   flatten    |  `flatten`: {`deep`(optional): true}, default is false
| array     |   compact    |  `compact`: true
| boolean   |   reverse    |  `reverse`: true
| number    |   floor      |  `floor`: true
| number    |   ceiling    |  `ceiling`: true
| number    |   round      |  `round`: true

### <a id="pick"></a> `pick` rule ###

This rule is used to add a list of properties as is.

```js
var template = {
    content: {
        fullName: {
            value: function (input) {
                return input.firstName + ' ' + input.lastName;
            },
            existsWhen: ['firstName', 'lastName']
        },
        age: {
            value: function (input) {
                return 2015 - input;
            },
            dataKey: 'birthYear'
        }
    },
    pick: ['eyeColor', 'hairColor']
};

var input = {
    lastName: 'Doe',
    firstName: 'Joe',
    birthYear: 2000,
    eyeColor: 'blue',
    hairColor: 'brown'
};

var r = j2j.run(template, input);
console.log(r); // { fullName: 'Joe Doe', age: 15, eyeColor: 'blue', hairColor: 'brown' }
}
```

### <a id="omit"></a> `omit` rule ###

This rule is used to add all the properties as is except the specified.

```js
var template = {
    content: {
        fullName: {
            value: function (input) {
                return input.firstName + ' ' + input.lastName;
            },
            existsWhen: ['firstName', 'lastName']
        },
        age: {
            value: function (input) {
                return 2015 - input;
            },
            dataKey: 'birthYear'
        }
    },
    omit: ['eyeColor', 'lastName', 'firstName', 'birthYear']
};

var input = {
    lastName: 'Doe',
    firstName: 'Joe',
    birthYear: 2000,
    eyeColor: 'blue',
    hairColor: 'brown',
    weight: 242,
};

var r = j2j.run(template, input);
console.log(r); // { fullName: 'Joe Doe', age: 15, hairColor: 'brown', weight: 242 }
```

## Errors

This library will throw `Error` in some cases, e.g. if [`content`](#content) is provided but it is an array or it is empty.
This can be avoided by creating a `jsonapter` `instance` with `options` as `instance (null, null, {mode: null})`.
By default, `mode` is `strict`.


## Overrides

Each engine instance `j2j` contains all the implementation details as functions in the following keys:
- `run`
- `content`
- `assign`
- `firstOf`
- `constant`
- `arrayIndex`
- `template`
- `size`
- `value`
- `runForArray`
- `evaluateDataKey`
- `evaluateValue`
- `actionKeys`
- `dataKeyToInput`
- `dataKeyArrayToInput`
- `context`

`run` is the entry point. `content`, `arrayContent`, `value`, `size`, `template`, `arrayIndex`, `constant`, `firstOf` and `assign` are called action keys and listed in `actionKeys` array.
Only one of `actionKeys` can appear on a template on the same level. None of these keys are designed to be overridden except `context`.  However you can add additional functionality by adding new data and action keys.

### Overrides To Existing Keys

Although in principle any of the implementation keys can be overridden, only `context` is designed as such.

### <a id="context"></a> `context` Override ###

When `dataKey` is a function this parameter is passed as the second parameter.  By default `context` is an empty object.  You can specify any property to be used by the `dataKey` function.  In particular [jsonave](https://github.com/amida-tech/jsonave) library allows functions in JSONPath expressions which can be specified with this key

```js
var override = {
    context: {
        round: function(obj) {
            return Math.round(obj);
        }
    }
};

var j2j_dkfno = bbj2j.instance(override, override);


var jsonave = require('@amida-tech/jsonave').instance;
var template = {
    dataKey: jsonave('book[:].price.round()')
};

var r = j2j_dkfno.run(template, {
    book: [{
        price: 10.3
    }, {
        price: 22.2
    }, {
        price: 31.9
    }]
});

console.log(r); // [10, 22, 32]
```

### Additional Action Keys

The functionality of templates can be customized by adding additional action keys
```js
var meds = {
    'aspirin': {
        id: 1
    }
};

var override = {
    meds: meds,
    external: function (template, input) {
        var te = template.external;
        if (!input) {
            return null;
        }
        var external = this.meds[input];
        if (external) {
            return external.id;
        } else {
            var newId = Object.keys(meds).length + 1;
            meds[input] = {
                id: newId
            };
            return newId;
        }
    }
};

var j2j_od_e = bbj2j.instance(override, ['external']);

var nameTemplate = {
    content: {
        last: {
            dataKey: 'lastName'
        },
        first: {
            dataKey: 'firstName'
        }
    }
};

var template = {
    content: {
        name: nameTemplate,
        meds: {
            external: {},
            dataKey: 'meds'
        }
    }
};

var r = j2j_od_e.run(template, {
    lastName: 'Doe',
    firstName: 'Joe',
    meds: ['claritin', 'aspirin', 'albuterol']
});
console.log(r); // {name: {last: 'Doe', first: 'Joe'}, meds: [2, 1, 3]}

console.log(meds); // {aspirin: {id: 1}, claritin: {id: 2}, albuterol: {id: 3}}
```
Here we added `external` to `actionKeys`.  Note that for this simple example, `external` is assigned to an empty object but in general it can be anything including other templates.  You can `run` the templates by `this.run(te, input)` where `te` is the value of `external` as demontrated above.

## License

Licensed under [Apache 2.0](./LICENSE).

