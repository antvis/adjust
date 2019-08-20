import * as _ from '@antv/util';
import { DataPointType, StackCfg } from '../interface';
import Adjust from './adjust';

const Cache = _.Cache;

export default class Stack extends Adjust {
  public cfg: StackCfg = {
    adjustNames: ['y'], // 指 x, y,
    xField: '', // 调整对应的 x 方向对应的字段名称
    yField: '', // 调整对应的 y 方向对应的字段名称
    height: NaN,
    size: 10,
    reverseOrder: false,
  };

  constructor(cfg: StackCfg) {
    super(cfg);
    this.cfg = {
      ...this.cfg,
      ...cfg,
    };
  }

  public _reverse(groupedDataArray: DataPointType[][]): DataPointType[][] {
    return groupedDataArray.slice(0).reverse();
  }

  /**
   * 方法入参是经过数据分组、数据数字化之后的二维数组
   * @param groupDataArray 分组之后的数据
   */
  public process(groupDataArray: DataPointType[][]): DataPointType[][] {
    const { yField, reverseOrder } = this.cfg;

    // 如果有指定 y 字段，那么按照 y 字段来 stack
    // 否则，按照高度均分
    const d = yField ? this.processStack(groupDataArray) : this.processOneDimStack(groupDataArray);

    return reverseOrder ? this._reverse(d) : d;
  }

  public processStack(groupDataArray: DataPointType[][]): DataPointType[][] {
    const { xField, yField, reverseOrder } = this.cfg;

    // 层叠顺序翻转
    const groupedDataArray = reverseOrder ? this._reverse(groupDataArray) : groupDataArray;

    // 用来缓存，正数和负数的堆叠问题
    const positive = new Cache<number>();
    const negative = new Cache<number>();

    return groupedDataArray.map((dataArray) => {
      return dataArray.map((data) => {
        const x: number = _.get(data, xField, 0);
        let y: number = _.get(data, yField);

        const xKey = x.toString();

        // todo 是否应该取 _origin？因为 y 可能取到的值不正确，比如先 symmetric，再 stack！
        y = _.isArray(y) ? y[1] : y;

        if (!_.isNil(y)) {
          const cache = y >= 0 ? positive : negative;

          if (!cache.has(xKey)) {
            cache.set(xKey, 0);
          }
          const xValue = cache.get(xKey) as number;
          const newXValue = y + xValue;

          // 存起来
          cache.set(xKey, newXValue);

          return {
            ...data,
            // 叠加成数组，覆盖之前的数据
            [yField]: [xValue, newXValue],
          };
        }

        // 没有修改，则直接返回
        return data;
      });
    });
  }

  // todo 不明白画出来是什么含义
  public processOneDimStack(groupDataArray: DataPointType[][]): DataPointType[][] {
    const { xField, height, reverseOrder } = this.cfg;
    let { yField } = this.cfg;
    // todo processOneDimStack 必然是 yField 不存在
    yField = 'y';

    // 如果层叠的顺序翻转
    const groupedDataArray = reverseOrder ? this._reverse(groupDataArray) : groupDataArray;

    // 缓存累加数据
    const cache = new Cache<number>();

    return groupedDataArray.map((dataArray): DataPointType[] => {
      return dataArray.map(
        (data): DataPointType => {
          const { size } = this.cfg;
          const xValue: string = data[xField];

          // todo 没有看到这个 stack 计算原理
          const stackHeight = (size * 2) / height;

          if (!cache.has(xValue)) {
            cache.set(xValue, stackHeight / 2); // 初始值大小
          }

          const stackValue = cache.get(xValue) as number;
          // 增加一层 stackHeight
          cache.set(xValue, stackValue + stackHeight);

          return {
            ...data,
            [yField]: stackValue,
          };
        }
      );
    });
  }

  // 没有用到，空实现
  public adjustDim(dim: string, values: number[], data: object[]) {}
}
