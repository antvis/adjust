import Symmetric from '../../src/adjusts/symmetric';

describe('symmetric adjust', () => {
  describe('default symmetric', () => {
    const data = [{ a: 1, b: 2, c: 1 }, { a: 2, b: 1, c: 1 }, { a: 3, b: 5, c: 1 }];

    const adjust = new Symmetric({
      xField: 'a',
      yField: 'b',
    });

    let result;

    it('process adjust', () => {
      result = adjust.process([data]);
      expect(result[0].length).toBe(3);
    });

    it('adjust result', () => {
      const obj1 = result[0][0];
      expect(obj1.b.length).toBe(2);
      expect(obj1.b[0]).toBe(1.5);
      expect(obj1.b[1]).toBe(3.5);
    });

    it('adjust second', () => {
      const obj2 = result[0][1];
      expect(obj2.b[0]).toBe(2);
      expect(obj2.b[1]).toBe(3);
    });
  });

  describe('symmetric array', () => {
    const data = [{ a: 1, b: [1, 2], c: 1 }, { a: 2, b: [2, 3], c: 1 }, { a: 3, b: [3, 5], c: 1 }];

    const adjust = new Symmetric({
      xField: 'a',
      yField: 'b',
    });

    let result;

    it('process adjust', () => {
      result = adjust.process([data]);
    });

    it('adjust result', () => {
      const obj1 = result[0][0];
      expect(obj1.b.length).toBe(2);
      expect(obj1.b[0]).toBe(2.5);
      expect(obj1.b[1]).toBe(3.5);
    });

    it('adjust second', () => {
      const obj2 = result[0][1];
      expect(obj2.b[0]).toBe(3);
      expect(obj2.b[1]).toBe(4);
    });
  });
});
