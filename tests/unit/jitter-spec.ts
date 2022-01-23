import Jitter from '../../src/adjusts/jitter';

describe('adjust jitter', () => {
  describe('default adjust', () => {
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
    });

    it('is adjust', () => {
      expect(adjust.isAdjust('x')).toBe(true);
      expect(adjust.isAdjust('y')).toBe(true);
    });

    it('get dim values', () => {
      // @ts-ignore
      const map = adjust.getDimValues(data);
      expect(map.a.length).toBe(3);
      expect(map.c.length).toBe(2);
    });

    it('process adjust', () => {
      [newData] = adjust.process([data]);
    });

    it('adjust result', () => {
      const obj1 = newData[0];
      expect(obj1.a > 0.5).toBe(true);
      expect(obj1.a < 1.5).toBe(true);
    });

    it('adjust second', () => {
      const obj2 = data[2];
      expect(obj2.a > 1.5).toBe(true);
      expect(obj2.a < 2.5).toBe(true);
    });
  });

  describe('adjust one dim.', () => {
    const data = [
      { a: 0, b: 2, c: 1 },
      { a: 0, b: 3, c: 2 },
    ];

    let newData;

    const adjust = new Jitter({
      xField: 'a',
      yField: 'y',
    });

    it('is adjust', () => {
      expect(adjust.isAdjust('x')).toBe(true);
      expect(adjust.isAdjust('y')).toBe(true);
    });

    it('get dim values', () => {
      // @ts-ignore
      const map = adjust.getDimValues(data);
      expect(map.a.length).toBe(1);
      expect(map.y.length).toBe(0);
    });

    it('process adjust', () => {
      [newData] = adjust.process([data]);
    });

    it('adjust result', () => {
      const obj1 = newData[0];
      expect(obj1.a > 0.05).toBe(true);
      expect(obj1.a < 0.95).toBe(true);
    });
  });

  describe('pass in dimValuesMap', () => {
    const data = [
      { a: 1, b: 2, c: 1 },
      { a: 1, b: 3, c: 2 },
      { a: 2, b: 1, c: 1 },
      { a: 2, b: 6, c: 2 },
      { a: 3, b: 5, c: 1 },
      { a: 3, b: 1, c: 2 },
    ];

    const dimValuesMap={b:[1,2,3,4,5,6]};

    let newData;

    const adjust = new Jitter({
      xField: 'a',
      yField: 'b',
      dimValuesMap
    });

    it('is adjust', () => {
      expect(adjust.isAdjust('x')).toBe(true);
      expect(adjust.isAdjust('y')).toBe(true);
    });

    it('get dim values', () => {
      // @ts-ignore
      const map = adjust.getDimValues(data);
      expect(map.a.length).toBe(3);
      expect(map.b.length).toBe(6);
    });

    it('process adjust', () => {
      [newData] = adjust.process([data]);
    });

    it('adjust result', () => {
      const obj1 = newData[0];
      expect(obj1.b > 1.5).toBe(true);
      expect(obj1.b < 2.5).toBe(true);
    });

    it('adjust second', () => {
      const obj2 = data[2];
      expect(obj2.b > 0.5).toBe(true);
      expect(obj2.b < 1.5).toBe(true);
    });
  });
});
