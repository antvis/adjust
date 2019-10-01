import { Adjust, getAdjust, registerAdjust } from '../../src/index';

describe('adjust', () => {
  const Dodge = getAdjust('dodge');

  it('getAdjust', () => {
    expect(getAdjust('dodge')).toEqual(Dodge);
  });

  it('registerAdjust', () => {
    class A extends Adjust {
      public process() {
        return [];
      }
    }
    // @ts-ignore
    registerAdjust('AAA', A);

    expect(getAdjust('aaa')).toEqual(A);

    expect(() => {
      registerAdjust('dodge', A);
    }).toThrow();
  });
});
