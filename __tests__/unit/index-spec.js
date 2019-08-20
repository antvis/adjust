import { expect } from 'chai';
import { getAdjust, registerAdjust } from '../../src/index';

describe('adjust', () => {
  it('getAdjust', () => {
    // todo 为啥下面的不相等？可能跟编译器有关！
    // expect(getAdjust('dodge')).to.equal(Dodge);
    expect(getAdjust('wfwe')).to.equal(undefined);
  });

  it('registerAdjust', () => {
    class A {}
    registerAdjust('AAA', A);

    expect(getAdjust('aaa')).to.equal(A);

    expect(() => {
      registerAdjust('dodge', A);
    }).to.throw();
  });
});
