import { expect } from 'chai';
import { getAdjust } from '../../src/index';

describe('first dodge next stack', function() {

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

  it('dodge adjust', function() {
    const Dodge = getAdjust('dodge');
    const adjust = new Dodge({
      xField: 'a',
      dodgeBy: 'b',
      adjustNames: [ 'x' ],
    });
    const [ newData ] = adjust.process([ data ]);
    expect(newData[0].a).to.be.equal(newData[1].a);
  });

  it('stack adjust', function() {
    const Stack = getAdjust('stack');
    const adjust = new Stack({
      xField: 'a',
      dodgeBy: 'b',
      yField: 'c',
    });
    adjust.process([ data ]);
    expect(data[0].c[1]).eql(data[1].c[0]);
  });

});

describe('first stack next symmetric', function() {
  const data = [
    { a: 1, b: 2, c: 1 },
    { a: 1, b: 3, c: 2 },
    { a: 2, b: 1, c: 1 },
    { a: 2, b: 4, c: 2 },
    { a: 3, b: 5, c: 1 },
    { a: 3, b: 1, c: 2 },
  ];

  const Stack = getAdjust('stack');

  const adjust = new Stack({
    xField: 'a',
    yField: 'b',
  });

  let newData = adjust.process([ data ]);

  it('symmetric', function() {
    const Symmetric = getAdjust('Symmetric');

    const sAdjust = new Symmetric({
      xField: 'a',
      yField: 'b',
    });

    newData = sAdjust.process(newData);

    expect(newData[0][0].b).eql([ 0.5, 2.5 ]);
  });
});
