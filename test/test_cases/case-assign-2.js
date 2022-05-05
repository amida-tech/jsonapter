"use strict";

exports.template = {
  content: {
    top: {
      assign: [{
        content: {
          sa: {
            dataKey: 'a'
          },
          sb: {
            dataKey: 'b'
          },
          sc: {
            dataKey: 'c'
          }
        },
        dataKey: 'sub'
      }, {
        content: {
          tx: {
            dataKey: 'x'
          },
          ty: {
            dataKey: 'y'
          },
          tz: {
            dataKey: 'z'
          }
        }
      }]
    }
  }
};

exports.input = {
  x: 1,
  z: 3,
  sub: {
    a: 'a',
    b: 'b'
  }
};

exports.expected = {
  top: {
    sa: 'a',
    sb: 'b',
    tx: 1,
    tz: 3
  }
};
