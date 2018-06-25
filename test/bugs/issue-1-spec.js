const expect = require('chai').expect;
const adjust = require('../../src/index');

describe('#1', () => {
  it('description', () => {
    expect('adjust').to.be.a('string');
    expect(adjust).to.be.an('object');
  });
});
