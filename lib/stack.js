const isArray = require('@antv/util/src/type/isArray');
const Adjust = require('./base');

class Stack extends Adjust {

  _initDefaultCfg() {
    this.xField = null; // 调整对应的 x 方向对应的字段名称
    this.yField = null; // 调整对应的 y 方向对应的字段名称
    this.height = null; // 仅有一个维度调整时，总的高度
    this.size = 10; // 单个点的大小
    this.reverseOrder = false; // 是否反序进行层叠
    this.adjustNames = ['y']; // Only support stack y
  }

  processOneDimStack(dataArray) {
    const self = this;
    const xField = self.xField;
    const yField = self.yField || 'y';
    const height = self.height;

    const stackY = {};
    // 如果层叠的顺序翻转
    if (self.reverseOrder) {
      dataArray = dataArray.slice(0).reverse();
    }
    for (let i = 0, len = dataArray.length; i < len; i++) {
      const data = dataArray[i];
      // cates
      for (let j = 0, dataLen = data.length; j < dataLen; j++) {
        const item = data[j];
        const size = item.size || self.size;
        const stackHeight = size * 2 / height;
        const x = item[xField];
        if (!stackY[x]) {
          stackY[x] = stackHeight / 2;
        }
        item[yField] = stackY[x];
        stackY[x] += stackHeight;
      }
    }
  }

  processAdjust(dataArray) {
    if (this.yField) {
      this.processStack(dataArray);
    } else {
      this.processOneDimStack(dataArray);
    }
  }

  processStack(dataArray) {
    const self = this;
    const xField = self.xField;
    const yField = self.yField;
    const count = dataArray.length;
    const stackCache = {
      positive: {},
      negative: {}
    };
    // 层叠顺序翻转
    if (self.reverseOrder) {
      dataArray = dataArray.slice(0).reverse();
    }
    for (let i = 0; i < count; i++) {
      const data = dataArray[i];
      for (let j = 0, len = data.length; j < len; j++) {
        const item = data[j];
        const x = item[xField] || 0;
        let y = item[yField] || 0;
        const xkey = x.toString();
        y = isArray(y) ? y[1] : y;
        const direction = y >= 0 ? 'positive' : 'negative';
        if (!stackCache[direction][xkey]) {
          stackCache[direction][xkey] = 0;
        }
        item[yField] = [stackCache[direction][xkey], y + stackCache[direction][xkey]];
        stackCache[direction][xkey] += y;
      }
    }
  }
}

Adjust.Stack = Stack;
module.exports = Stack;