import { expect } from 'chai';
import Stack from '../../src/adjusts/stack';
import group from '@antv/util/lib/group';

describe('stack adjust', function() {
  describe('default stack', function() {
    const data = [
      { a: 1, b: 2, c: 1 },
      { a: 1, b: 3, c: 2 },
      { a: 2, b: 1, c: 1 },
      { a: 2, b: 4, c: 2 },
      { a: 3, b: 5, c: 1 },
      { a: 3, b: 1, c: 2 },
    ];

    const adjust = new Stack({
      xField: 'a',
      yField: 'b',
    });

    it('is adjust', function() {
      expect(adjust.isAdjust('x')).to.be.equal(false);
      expect(adjust.isAdjust('y')).to.be.equal(true);
    });

    it('get dim values', function() {
      const map = adjust._getDimValues(data);
      expect(map.b.length).to.be.equal(5);
    });
    it('process adjust', function() {
      const newData = adjust.process([ data ]);
      const obj1 = newData[0][0];

      expect(obj1.b.length).to.be.equal(2);
      expect(obj1.b[0]).to.be.equal(0);
      expect(obj1.b[1]).to.be.equal(2);

      const obj2 = newData[0][1];
      expect(obj2.b[0]).to.be.equal(2);
      expect(obj2.b[1]).to.be.equal(5);
    });

    it('adjust reverse', function() {
      adjust.cfg.reverseOrder = true;
      const dataArray = group(data, 'c');

      const newDataArray = adjust.process(dataArray);

      const d1 = newDataArray[0];

      const obj1 = d1[0];

      expect(obj1.b.length).to.be.equal(2);
      expect(obj1.b[0]).to.be.equal(3);
      expect(obj1.b[1]).to.be.equal(5);

    });
  });

  describe('stack array', function() {
    const data = [ {
      a: 1,
      b: [ 0, 3 ],
      c: 1,
    }, {
      a: 1,
      b: [ 3, 4 ],
      c: 2,
    },

    {
      a: 2,
      b: 1,
      c: 1,
    }, {
      a: 2,
      b: 4,
      c: 2,
    },

    {
      a: 3,
      b: 5,
      c: 1,
    }, {
      a: 3,
      b: 1,
      c: 2,
    },
    ];

    const adjust = new Stack({
      xField: 'a',
      yField: 'b',
    });

    it('is adjust', function() {
      expect(adjust.isAdjust('x')).to.be.equal(false);
      expect(adjust.isAdjust('y')).to.be.equal(true);
    });

    it('get dim values', function() {
      const map = adjust._getDimValues(data);
      expect(map.b.length).to.be.equal(5);
    });
    it('process adjust', function() {
      const newData = adjust.process([ data ]);

      const obj1 = newData[0][0];
      expect(obj1.b.length).to.be.equal(2);
      expect(obj1.b[0]).to.be.equal(0);
      expect(obj1.b[1]).to.be.equal(3);

      const obj2 = newData[0][1];
      expect(obj2.b[0]).to.be.equal(3);
      expect(obj2.b[1]).to.be.equal(7);
    });
  });

  describe('stack with null or undefined', function() {
    it('adjust result', function() {
      const data = [
        { a: 1, c: 1 },
        { a: 1, b: null, c: 2 },
        { a: 2, b: 1, c: 1 },
        { a: 2, b: 4, c: 2 },
        { a: 3, b: 0, c: 1 },
        { a: 3, b: 1, c: 2 },
      ];
      const adjust = new Stack({
        xField: 'a',
        yField: 'b',
      });
      const newData = adjust.process([ data ]);
      const obj1 = newData[0][0];
      expect(obj1.b).to.be.undefined;

      const obj2 = newData[0][1];
      expect(obj2.b).to.be.null;

      const obj3 = newData[0][2];
      expect(obj3.b.length).to.be.equal(2);
      expect(obj3.b[0]).to.be.equal(0);
      expect(obj3.b[1]).to.be.equal(1);
    });
  });

  describe('stack with 0', function() {
    const data = [ {
      a: 1,
      b: 2,
      c: 1,
    }, {
      a: 1,
      b: 0,
      c: 2,
    },
    {
      a: 2,
      b: 1,
      c: 1,
    }, {
      a: 2,
      b: 4,
      c: 2,
    },

    {
      a: 3,
      b: 0,
      c: 1,
    }, {
      a: 3,
      b: 1,
      c: 2,
    },
    ];


    it('adjust result', function() {
      const adjust = new Stack({
        xField: 'a',
        yField: 'b',
      });

      const newData = adjust.process([ data ]);

      const obj1 = newData[0][0];
      expect(obj1.b.length).to.be.equal(2);
      expect(obj1.b[0]).to.be.equal(0);
      expect(obj1.b[1]).to.be.equal(2);

      const obj2 = newData[0][1];
      expect(obj2.b.length).to.be.equal(2);
      expect(obj2.b[0]).to.be.equal(2);
      expect(obj2.b[1]).to.be.equal(2);
    });
  });
  describe('stack one dimension', function() {
    const data = [ {
      a: 1,
      b: 2,
      c: 1,
    }, {
      a: 1,
      b: 3,
      c: 2,
    },

    {
      a: 2,
      b: 1,
      c: 1,
    }, {
      a: 2,
      b: 4,
      c: 2,
    },

    {
      a: 3,
      b: 5,
      c: 1,
    }, {
      a: 3,
      b: 1,
      c: 2,
    },
    ];

    const adjust = new Stack({
      xField: 'a',
      height: 100,
    });

    it('is adjust', function() {
      expect(adjust.isAdjust('x')).to.be.equal(false);
      expect(adjust.isAdjust('y')).to.be.equal(true);
    });

    it('get dim values', function() {
      const map = adjust._getDimValues(data);
      expect(map.a).to.be.equal(undefined);
      expect(map.y.length).to.be.equal(2);
    });

    it('process adjust', function() {
      const newData = adjust.process([ data ]);
      const obj1 = newData[0][0];
      expect(obj1.y).to.be.equal(0.1);

      const obj2 = newData[0][1];
      expect(Math.abs(obj2.y - 0.3) < 0.0001).to.be.equal(true);
    });

  });

  describe('stack one dimension with reverse', function() {
    const data = [ {
      a: 1,
      b: 2,
      c: 1,
    }, {
      a: 1,
      b: 3,
      c: 2,
    },

    {
      a: 2,
      b: 1,
      c: 1,
    }, {
      a: 2,
      b: 4,
      c: 2,
    },

    {
      a: 3,
      b: 5,
      c: 1,
    }, {
      a: 3,
      b: 1,
      c: 2,
    },
    ];

    const adjust = new Stack({
      xField: 'a',
      height: 100,
      reverseOrder: true,
    });

    it('process adjust', function() {
      const newData = adjust.process([ data ]);
      const obj1 = newData[0][0];
      expect(obj1.c).to.be.equal(1);
      expect(obj1.y).to.be.equal(0.1);
    });
  });
});
