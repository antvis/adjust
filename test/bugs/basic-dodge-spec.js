const expect = require('chai').expect;
const DodgeAdjust = require('../../src/dodge');

describe('Basic Dodge', () => {
  it('just one group', () => {
    const testData = [
      [
        { name: 'London', 月份: 0, 月均降雨量: 18.9 }
      ],
      [
        { name: 'Berlin', 月份: 0, 月均降雨量: 12.4 }
      ]
    ];
    const dodge = new DodgeAdjust({
      xField: '月份',
      yField: '月均降雨量',
      type: 'dodge',
      marginRatio: 0.05
    });
    dodge.processAdjust(testData);

    expect(testData[0][0]['月份'].toFixed(4)).equal('-0.2625');
    expect(testData[1][0]['月份'].toFixed(4)).equal('0.2625');
  });
});
