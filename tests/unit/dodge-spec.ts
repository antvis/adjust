import cloneDeep from '@antv/util/lib/clone';
import group from '@antv/util/lib/group';
import Dodge from '../../src/adjusts/dodge';

function snapEqual(v1, v2) {
  return Math.abs(v1 - v2) < 0.001;
}

describe('adjust dodge', () => {
  describe('default adjust all has two', () => {
    const data = [
      { a: 1, b: 2, c: 1 },
      { a: 1, b: 3, c: 2 },
      { a: 2, b: 1, c: 1 },
      { a: 2, b: 4, c: 2 },
      { a: 3, b: 5, c: 1 },
      { a: 3, b: 1, c: 2 },
    ];

    const groupData = group(data, 'c');
    const adjust = new Dodge({
      xField: 'a',
      adjustNames: ['x'],
    });

    let newGroupData;
    let d1;

    it('is adjust', () => {
      expect(adjust.isAdjust('x')).toBe(true);
      expect(adjust.isAdjust('y')).toBe(false);
    });

    it('get dim values', () => {
      // @ts-ignore
      const map = adjust.getDimValues(data);
      expect(map.a.length).toBe(3);
    });

    it('process adjust', () => {
      newGroupData = adjust.process(groupData);
      expect(newGroupData.length).toBe(2);

      d1 = newGroupData[0];
    });

    it('adjust result', () => {
      const obj1 = d1[0];
      expect(obj1.a).toBe(0.8125);

      const obj2 = d1[1];
      expect(obj2.a).toBe(1.8125);
    });
  });

  describe('default adjust some has three', () => {
    const data = [
      { a: 1, b: 2, c: 1 },
      { a: 1, b: 3, c: 2 },
      { a: 2, b: 1, c: 1 },
      { a: 2, b: 4, c: 2 },
      { a: 3, b: 5, c: 1 },
      { a: 3, b: 1, c: 2 },
      { a: 3, b: 1, c: 3 },
    ];

    const groupData = group(data, 'c');
    let newGroupData;
    let d1;

    const adjust = new Dodge({
      xField: 'a',
      adjustNames: ['x'],
    });

    it('is adjust', () => {
      expect(adjust.isAdjust('x')).toBe(true);
      expect(adjust.isAdjust('y')).toBe(false);
    });

    it('get dim values', () => {
      // @ts-ignore
      const map = adjust.getDimValues(data);
      expect(map.a.length).toBe(3);
    });

    it('process adjust', () => {
      newGroupData = adjust.process(groupData);
      d1 = newGroupData[0];
    });

    it('adjust result', () => {
      const obj1 = d1[0];
      expect(obj1.a).toBe(0.8125);

      const obj2 = d1[1];
      expect(obj2.a).toBe(1.8125);
    });
  });

  describe('adjust only one dim', () => {
    const data = [{ a: 1, b: 3, c: 2 }, { a: 2, b: 1, c: 1 }, { a: 3, b: 5, c: 1 }];
    let newDataArray;

    const adjust = new Dodge({
      xField: 'a',
      adjustNames: ['y'],
    });
    const groupData = group(data, 'a');

    it('is adjust', () => {
      expect(adjust.isAdjust('x')).toBe(false);
      expect(adjust.isAdjust('y')).toBe(true);
    });

    it('get dim values', () => {
      // @ts-ignore
      const map = adjust.getDimValues(data);
      expect(map.y.length).toBe(2);
    });

    it('adjust', () => {
      const dataArray = cloneDeep(groupData);
      newDataArray = adjust.process(dataArray);
      expect(newDataArray.length).toBe(3);
      expect(snapEqual(newDataArray[0][0].y, 0.25)).toEqual(true);
      expect(snapEqual(newDataArray[1][0].y, 0.5)).toEqual(true);
    });

    it('get distribute', () => {
      // @ts-ignore
      adjust.adjustDataArray = groupData;
      // @ts-ignore
      const map = adjust.getDistribution('y');
      expect(map[0].length).toBe(3);
    });
  });

  describe('adjust only one group.', () => {
    const data = [{ a: 0, b: 3, c: 2 }, { a: 0, b: 1, c: 1 }, { a: 0, b: 5, c: 1 }];
    let newGroupData;
    const adjust = new Dodge({
      xField: 'a',
      adjustNames: ['x'],
    });
    const groupData = group(data, 'b');

    it('get dim values', () => {
      // @ts-ignore
      const map = adjust.getDimValues(data);
      expect(map.a).not.toBe(undefined);
      expect(map.a).toEqual([0]);
    });

    it('adjust', () => {
      adjust.process(groupData);
      newGroupData = adjust.process(groupData);

      expect(snapEqual(newGroupData[0][0].a, -0.5)).toBe(true);
      expect(snapEqual(newGroupData[1][0].a, 0)).toBe(true);
      expect(snapEqual(newGroupData[2][0].a, 0.5)).toBe(true);
    });
  });

  describe('adjust multiple dims', () => {
    const data = [
      { a: 1, b: 1, c: 1 },
      { a: 1, b: 1, c: 2 },
      { a: 1, b: 2, c: 1 },
      { a: 1, b: 2, c: 2 },
      { a: 2, b: 1, c: 1 },
      { a: 2, b: 1, c: 2 },
      { a: 2, b: 2, c: 1 },
      { a: 2, b: 2, c: 2 },
    ];

    const adjust = new Dodge({
      xField: 'a',
      dodgeBy: 'b',
      adjustNames: ['x'],
    });

    const groupData = group(data, 'a');
    it('adjust', () => {
      const newGroupData = adjust.process(groupData);
      const d1 = newGroupData[0];
      expect(d1[0].a).toBe(d1[1].a);
    });
  });
});
