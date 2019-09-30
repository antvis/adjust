import * as _ from '@antv/util';
import { DEFAULT_Y } from '../constant';
import { AdjustCfg, DataPointType, RangeType } from '../interface';

export type AdjustConstructor = new (cfg: any) => Adjust;

export interface DimValuesMapType {
  [dim: string]: number[];
}

export default abstract class Adjust {
  /** 参与调整的维度 */
  public adjustNames: string[];
  /** x 维度对应的字段 */
  public readonly xField: string;
  /** y 维度对应的字段 */
  public readonly yField: string;

  constructor(cfg: AdjustCfg) {
    const { xField, yField, adjustNames = ['x', 'y'] } = cfg;

    this.adjustNames = adjustNames;
    this.xField = xField;
    this.yField = yField;
  }

  // 需要各自实现的方法
  public abstract process(dataArray: DataPointType[][]): DataPointType[][];

  /**
   * 查看维度是否是 adjust 字段
   * @param dim
   */
  protected isAdjust(dim: string): boolean {
    return this.adjustNames.indexOf(dim) >= 0;
  }

  protected getAdjustRange(dim: string, dimValue: number, values: number[]): RangeType {
    const { yField } = this;

    const index = values.indexOf(dimValue);
    const length = values.length;

    let pre;
    let next;

    // 没有 y 字段，但是需要根据 y 调整
    if (!yField && this.isAdjust('y')) {
      pre = 0;
      next = 1;
    } else if (length > 1) {
      // 如果以其开头，则取之，否则取他前面一个
      pre = values[index === 0 ? 0 : index - 1];
      // 如果以其结尾，则取之，否则取他后面一个
      next = values[index === length - 1 ? length - 1 : index + 1];

      if (index !== 0) {
        pre += (dimValue - pre) / 2;
      } else {
        pre -= (next - dimValue) / 2;
      }

      if (index !== length - 1) {
        next -= (next - dimValue) / 2;
      } else {
        next += (dimValue - values[length - 2]) / 2;
      }
    } else {
      pre = dimValue === 0 ? 0 : dimValue - 0.5;
      next = dimValue === 0 ? 1 : dimValue + 0.5;
    }

    return {
      pre,
      next,
    };
  }

  protected adjustData(groupedDataArray: DataPointType[][], mergedData: DataPointType[]) {
    // 所有调整维度的值数组
    const dimValuesMap = this.getDimValues(mergedData);

    // 按照每一个分组来进行调整
    _.each(groupedDataArray, (dataArray, index) => {
      // 遍历所有数据集合
      // 每个分组中，分别按照不同的 dim 进行调整
      _.each(dimValuesMap, (values: number[], dim: string) => {
        // 根据不同的度量分别调整位置
        this.adjustDim(dim, values, dataArray, index);
      });
    });
  }

  /**
   * 对数据进行分组adjustData
   * @param data 数据
   * @param dim 分组的字段
   * @return 分组结果
   */
  protected groupData(data: DataPointType[], dim: string): { [dim: string]: DataPointType[] } {
    // 补齐数据空数据为默认值
    _.each(data, (record: DataPointType) => {
      if (record[dim] === undefined) {
        record[dim] = DEFAULT_Y;
      }
    });

    // 按照 dim 维度分组
    return _.groupBy(data, dim);
  }

  /** @override */
  protected adjustDim(dim: string, values: number[], data: DataPointType[], index?: number): void {}

  /**
   * 获取可调整度量对应的值
   * @param mergedData 数据
   * @return 值的映射
   */
  private getDimValues(mergedData: DataPointType[]): DimValuesMapType {
    const { xField, yField } = this;

    const dimValuesMap: DimValuesMapType = {};

    // 所有的维度
    const dims = [];
    if (xField && this.isAdjust('x')) {
      dims.push(xField);
    }
    if (yField && this.isAdjust('y')) {
      dims.push(yField);
    }

    dims.forEach((dim: string): void => {
      // 在每个维度上，所有的值
      dimValuesMap[dim] = _.valuesOfKey(mergedData, dim).sort((v1, v2) => v1 - v2) as number[];
    });

    // 只有一维的情况下，同时调整 y，赋予默认值
    if (!yField && this.isAdjust('y')) {
      const dim = 'y';
      dimValuesMap[dim] = [DEFAULT_Y, 1]; // 默认分布在 y 轴的 0 与 1 之间
    }

    return dimValuesMap;
  }
}
