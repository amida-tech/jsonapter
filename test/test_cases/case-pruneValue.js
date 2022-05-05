"use strict";

exports.generalInputToTestMultipleTestCases = {
  firstName: 'TIM',
  lastName: 'DOE',
  middleName: 'JOE',
  familyName: '',
  address: '',
  age: NaN,
  numbers: [],
  friends: [],
  groups: [1, 2]
};

exports.templateToMapGeneralInput = {
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
      dataKey: 'address'
    },
    age: {
      dataKey: 'age'
    },
    numbers: {
      dataKey: 'numbers'
    },
    friends: {
      dataKey: 'friends'
    },
    groups: {
      dataKey: 'groups'
    }
  }
};

exports.templateForDefaultValues = {
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
      dataKey: 'familyName',
      default: ""
    },
    address: {
      dataKey: 'address',
      default: ""
    },
    age: {
      dataKey: 'age',
      default: NaN
    },
    numbers: {
      dataKey: 'numbers',
      default: []
    },
    friends: {
      dataKey: 'friends',
      default: []
    },
    groups: {
      dataKey: 'groups'
    }
  }
};

exports.outputForEmptyStringPresence = {
  address: "",
  familyName: "",
  firstName: "TIM",
  groups: [1, 2],
  lastName: "DOE",
  middleName: "JOE"
};
exports.outputForDefaultValues = {
  address: "",
  age: NaN,
  familyName: "",
  firstName: "TIM",
  friends: [],
  groups: [1, 2],
  lastName: "DOE",
  middleName: "JOE",
  numbers: []
};

exports.outputForNaNPresence = {

  age: NaN,
  firstName: "TIM",
  groups: [1, 2],
  lastName: "DOE",
  middleName: "JOE"
};

exports.input = {
  a: {
    b: {
      c1: "i am key c1",
      c2: "",
      c3: undefined,
      c4: [],
      c5: NaN,
      c6: true,
      c7: false
    },
    d: NaN,
    e: "value a.e",
    f: [{
      firstName: "sampleFirstName",
      group: []
    }, {
      firstName: "sampleFirstName",
      group: [1, 3]
    }, {
      firstName: "sampleFirstName",
      group: []
    }],
    g: {
      firstName: "sampleLastName",
      lastName: "",
      age: NaN,
      city: undefined,
      Numbers: []
    },
    h: {
      firstName: "sampleFirstName",
      lastName: "",
      age: NaN,
      city: undefined,
      "h.a1": "I am Key with dot"
    },
    i: [{
      showWeather: true,
      weather: "sunny",
      temperature: "70F",
      city: "Dallas",
      days: ["mon", "tue", "wed"]
    }, {
      showWeather: true,
      weather: "",
      temperature: NaN,
      city: undefined,
      days: ["thr", "fri", "sat"]
    }, {
      showWeather: true,
      weather: "sunny",
      temperature: "70F",
      city: "Irving",
      days: []
    }, {
      showWeather: false,
      weather: "sunny",
      temperature: "70F",
      city: "Ft.Worth",
      days: []
    }]

  }
};

var weatherTemplate = {
  existsWhen: 'showWeather',
  content: {
    weather: {
      dataKey: "weather"
    },
    temperature: {
      dataKey: "temperature"
    },
    city: {
      dataKey: "city"
    },
    days: {
      dataKey: "days"
    }
  }
};

exports.template = {
  content: {
    dest_a1: {
      dataKey: 'a.b.c1'
    },
    dest_a2: {
      dataKey: 'a.b.c2'
    },
    dest_a3: {
      dataKey: 'a.b.c3'
    },
    dest_a4: {
      dataKey: 'a.b.c4'
    },
    dest_a5: {
      dataKey: 'a.b.c5'
    },
    dest_a6: {
      dataKey: 'a.b.c6'
    },
    dest_a7: {
      dataKey: 'a.b.c7'
    },
    dest_b: {
      content: {
        dest_b0: {
          value: function (data) {
            return data.e;
          }
        },
        dest_b1: {
          dataKey: 'a.d',
          default: "I am Default for NaN"
        }
      },
      dataKey: 'a'
    },
    dest_d: {
      dataKey: "a.d"
    },
    dest_e: {
      dataKey: "a.e"
    },
    dest_f: {
      dataKey: "a.f",
      content: {
        firstName: {
          dataKey: "firstName"
        },
        group: {
          dataKey: "group"
        }
      }
    },
    dest_g: {
      dataKey: "a.g",
      content: {
        firstName: {
          dataKey: "firstName"
        },
        lastName: {
          dataKey: "lastName"
        },
        age: {
          dataKey: "age"
        },
        city: {
          dataKey: "city"
        },
        Numbers: {
          dataKey: "numbers",
          default: "1"
        },
        dotValue: {
          dataKey: "h.a1"
        }
      }
    },
    dest_h: {
      ignoreDeep: true,
      content: {
        "dest.h1.firstName": {
          dataKey: "a.h.firstName"
        },
        "dest.h2.lastName": {
          dataKey: "a.h.lastName"
        }
      }
    },
    dest_i: {
      arrayContent: [{
        arrayContent: [{
          dataKey: "a.i",
          template: weatherTemplate
        }],
        default: []
      }]
    }

  }
};

exports.expectedWithPruneOptions = {
  dest_a1: "i am key c1",
  dest_a6: true,
  dest_a7: false,
  dest_b: {
    dest_b0: "value a.e",
    dest_b1: "I am Default for NaN"
  },
  dest_e: "value a.e",
  dest_f: [{
    firstName: "sampleFirstName"
  }, {
    firstName: "sampleFirstName",
    group: [1, 3]
  }, {
    firstName: "sampleFirstName"
  }],
  dest_g: {
    firstName: "sampleLastName",
    Numbers: "1"
  },
  dest_h: {
    "dest.h1.firstName": "sampleFirstName"
  },
  dest_i: [{
    city: "Dallas",
    temperature: "70F",
    weather: "sunny",
    days: [
      "mon",
      "tue",
      "wed"
    ]
  }, {
    days: [
      "thr",
      "fri",
      "sat"
    ]
  }, {
    city: "Irving",
    temperature: "70F",
    weather: "sunny"
  }]
};

exports.expectedWithOutPruneOptions = {
  dest_a1: "i am key c1",
  dest_a2: "",
  dest_a4: [],
  dest_a5: NaN,
  dest_a6: true,
  dest_a7: false,
  dest_b: {
    dest_b0: "value a.e",
    dest_b1: "I am Default for NaN"
  },
  dest_d: NaN,
  dest_e: "value a.e",
  dest_f: [{
    firstName: "sampleFirstName",
    group: []
  }, {
    firstName: "sampleFirstName",
    group: [1, 3]
  }, {
    firstName: "sampleFirstName",
    group: []
  }],
  dest_g: {
    Numbers: "1",
    age: NaN,
    firstName: "sampleLastName",
    lastName: ""
  },
  dest_h: {
    "dest.h1.firstName": "sampleFirstName",
    "dest.h2.lastName": ""
  },
  dest_i: [{
    city: "Dallas",
    days: [
      "mon",
      "tue",
      "wed"
    ],
    temperature: "70F",
    weather: "sunny"
  }, {
    days: [
      "thr",
      "fri",
      "sat"
    ],
    temperature: NaN,
    weather: ""
  }, {
    city: "Irving",
    days: [],
    temperature: "70F",
    weather: "sunny"
  }]
};

exports.expectedWithEmptyArrays = {
  dest_a1: "i am key c1",
  dest_a4: [],
  dest_a6: true,
  dest_a7: false,
  dest_b: {
    dest_b0: "value a.e",
    dest_b1: "I am Default for NaN"
  },
  dest_e: "value a.e",
  dest_f: [{
    firstName: "sampleFirstName",
    group: []
  }, {
    firstName: "sampleFirstName",
    group: [1,
      3
    ]
  }, {
    firstName: "sampleFirstName",
    group: []
  }],
  dest_g: {
    firstName: "sampleLastName",
    Numbers: "1"
  },
  dest_h: {
    "dest.h1.firstName": "sampleFirstName"
  },
  dest_i: [{
    city: "Dallas",
    temperature: "70F",
    weather: "sunny",
    days: [
      "mon",
      "tue",
      "wed"
    ]
  }, {
    days: [
      "thr",
      "fri",
      "sat"
    ]
  }, {
    city: "Irving",
    days: [],
    temperature: "70F",
    weather: "sunny"
  }]
};
