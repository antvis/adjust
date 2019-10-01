import group from '@antv/util/lib/group';
import Stack from '../../src/adjusts/stack';

describe('stack adjust', () => {
  describe('default stack', () => {
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

    it('is adjust', () => {
      expect(adjust.isAdjust('x')).toBe(false);
      expect(adjust.isAdjust('y')).toBe(true);
    });

    it('get dim values', () => {
      // @ts-ignore
      const map = adjust.getDimValues(data);
      expect(map.b.length).toBe(5);
    });
    it('process adjust', () => {
      const newData = adjust.process([data]);
      const obj1 = newData[0][0];

      expect(obj1.b.length).toBe(2);
      expect(obj1.b[0]).toBe(0);
      expect(obj1.b[1]).toBe(2);

      const obj2 = newData[0][1];
      expect(obj2.b[0]).toBe(2);
      expect(obj2.b[1]).toBe(5);
    });

    it('adjust reverse', () => {
      // @ts-ignore
      adjust.reverseOrder = true;
      const dataArray = group(data, 'c');

      const newDataArray = adjust.process(dataArray);

      const d1 = newDataArray[0];

      const obj1 = d1[0];

      expect(obj1.b.length).toBe(2);
      expect(obj1.b[0]).toBe(3);
      expect(obj1.b[1]).toBe(5);
    });
  });

  describe('stack array', () => {
    const data = [
      { a: 1, b: [0, 3], c: 1 },
      { a: 1, b: [3, 4], c: 2 },
      { a: 2, b: 1, c: 1 },
      { a: 2, b: 4, c: 2 },
      { a: 3, b: 5, c: 1 },
      { a: 3, b: 1, c: 2 },
    ];

    const adjust = new Stack({
      xField: 'a',
      yField: 'b',
    });

    it('is adjust', () => {
      expect(adjust.isAdjust('x')).toBe(false);
      expect(adjust.isAdjust('y')).toBe(true);
    });

    it('get dim values', () => {
      // @ts-ignore
      const map = adjust.getDimValues(data);
      expect(map.b.length).toBe(5);
    });

    it('process adjust', () => {
      const newData = adjust.process([data]);

      const obj1 = newData[0][0];
      expect(obj1.b.length).toBe(2);
      expect(obj1.b[0]).toBe(0);
      expect(obj1.b[1]).toBe(3);

      const obj2 = newData[0][1];
      expect(obj2.b[0]).toBe(3);
      expect(obj2.b[1]).toBe(7);
    });
  });

  describe('stack with null or undefined', () => {
    it('adjust result', () => {
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
      const newData = adjust.process([data]);
      const obj1 = newData[0][0];
      expect(obj1.b).toBe(undefined);

      const obj2 = newData[0][1];
      expect(obj2.b).toBe(null);

      const obj3 = newData[0][2];
      expect(obj3.b.length).toBe(2);
      expect(obj3.b[0]).toBe(0);
      expect(obj3.b[1]).toBe(1);
    });
  });

  describe('stack with 0', () => {
    const data = [
      { a: 1, b: 2, c: 1 },
      { a: 1, b: 0, c: 2 },
      { a: 2, b: 1, c: 1 },
      { a: 2, b: 4, c: 2 },
      { a: 3, b: 0, c: 1 },
      { a: 3, b: 1, c: 2 },
    ];

    it('adjust result', () => {
      const adjust = new Stack({
        xField: 'a',
        yField: 'b',
      });

      const newData = adjust.process([data]);

      const obj1 = newData[0][0];
      expect(obj1.b.length).toBe(2);
      expect(obj1.b[0]).toBe(0);
      expect(obj1.b[1]).toBe(2);

      const obj2 = newData[0][1];
      expect(obj2.b.length).toBe(2);
      expect(obj2.b[0]).toBe(2);
      expect(obj2.b[1]).toBe(2);
    });
  });

  describe('stack one dimension', () => {
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
      height: 100,
    });

    it('is adjust', () => {
      expect(adjust.isAdjust('x')).toBe(false);
      expect(adjust.isAdjust('y')).toBe(true);
    });

    it('get dim values', () => {
      // @ts-ignore
      const map = adjust.getDimValues(data);
      expect(map.a).toBe(undefined);
      expect(map.y.length).toBe(2);
    });

    it('process adjust', () => {
      const newData = adjust.process([data]);
      const obj1 = newData[0][0];
      expect(obj1.y).toBe(0.1);

      const obj2 = newData[0][1];
      expect(Math.abs(obj2.y - 0.3) < 0.0001).toBe(true);
    });
  });

  describe('stack one dimension with reverse', () => {
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
      height: 100,
      reverseOrder: true,
    });

    it('process adjust', () => {
      const newData = adjust.process([data]);
      const obj1 = newData[0][0];
      expect(obj1.c).toBe(1);
      expect(obj1.y).toBe(0.1);
    });
  });
});
