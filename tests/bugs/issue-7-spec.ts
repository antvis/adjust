import Stack from '../../src/adjusts/stack';
describe('#7', () => {
  describe('yField with dot(.)', () => {
    const data = [
      { a: 1, 'b.value': 2, c: 1 },
      { a: 1, 'b.value': 3, c: 2 },
      { a: 2, 'b.value': 1, c: 1 },
      { a: 2, 'b.value': 4, c: 2 },
      { a: 3, 'b.value': 5, c: 1 },
      { a: 3, 'b.value': 1, c: 2 },
    ];

    const yField = 'b.value';

    const adjust = new Stack({
      xField: 'a',
      yField,
    });

    it('process adjust', () => {
      const newData = adjust.process([data]);
      const obj1 = newData[0][0];

      expect(obj1[yField].length).toBe(2);
      expect(obj1[yField][0]).toBe(0);
      expect(obj1[yField][1]).toBe(2);

      const obj2 = newData[0][1];
      expect(obj2[yField][0]).toBe(2);
      expect(obj2[yField][1]).toBe(5);
    });
  });
});
