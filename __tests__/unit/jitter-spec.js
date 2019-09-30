import { expect } from 'chai';
import Jitter from '../../src/adjusts/jitter';

describe('adjust jitter', function() {
  describe('default adjust', function() {
    const data = [
      { a: 1, b: 2, c: 1 },
      { a: 1, b: 3, c: 2 },
      { a: 2, b: 1, c: 1 },
      { a: 2, b: 4, c: 2 },
      { a: 3, b: 5, c: 1 },
      { a: 3, b: 1, c: 2 },
    ];

    let newData;

    const adjust = new Jitter({
      xField: 'a',
      yField: 'c',
      // adjustNames: [ 'x', 'y' ]
    });

    it('is adjust', function() {
      expect(adjust.isAdjust('x')).to.be.equal(true);
      expect(adjust.isAdjust('y')).to.be.equal(true);
    });

    it('get dim values', function() {
      const map = adjust.getDimValues(data);
      expect(map.a.length).to.be.equal(3);
      expect(map.c.length).to.be.equal(2);
    });
    it('process adjust', function() {
      [newData] = adjust.process([data]);
    });

    it('adjust result', function() {
      const obj1 = newData[0];
      expect(obj1.a > 0.5).to.be.equal(true);
      expect(obj1.a < 1.5).to.be.equal(true);
    });

    it('adjust second', function() {
      const obj2 = data[2];
      expect(obj2.a > 1.5).to.be.equal(true);
      expect(obj2.a < 2.5).to.be.equal(true);
    });
  });

  describe('adjust one dim.', function() {
    const data = [{ a: 0, b: 2, c: 1 }, { a: 0, b: 3, c: 2 }];

    let newData;

    const adjust = new Jitter({
      xField: 'a',
      yField: 'y',
    });

    it('is adjust', function() {
      expect(adjust.isAdjust('x')).to.be.equal(true);
      expect(adjust.isAdjust('y')).to.be.equal(true);
    });

    it('get dim values', function() {
      const map = adjust.getDimValues(data);
      expect(map.a.length).to.be.equal(1);
      expect(map.y.length).to.be.equal(0);
    });

    it('process adjust', function() {
      [newData] = adjust.process([data]);
    });

    it('adjust result', function() {
      const obj1 = newData[0];
      expect(obj1.a > 0.05).to.be.equal(true);
      expect(obj1.a < 0.95).to.be.equal(true);
    });
  });
});
