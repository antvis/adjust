import * as _ from '@antv/util';
import { DataPointType, JitterCfg, RangeType } from '../interface';
import Adjust from './adjust';

// 散点分开之后，距离边界的距离
const GAP = 0.05;

function randomNumber(min: number, max: number): number {
  return (max - min) * Math.random() + min;
}

export default class Jitter extends Adjust {
  public process(groupDataArray: DataPointType[][]): DataPointType[][] {
    const groupedDataArray = _.clone(groupDataArray);

    // 之前分组之后的数据，然后有合并回去（和分组前可以理解成是一样的）
    const mergeData = _.flatten(groupedDataArray) as DataPointType[];

    // 返回值
    this.adjustData(groupedDataArray, mergeData);

    return groupedDataArray;
  }

  /**
   * 当前数据分组（index）中，按照维度 dim 进行 jitter 调整
   * @param dim
   * @param values
   * @param dataArray
   */
  public adjustDim(dim: string, values: number[], dataArray: DataPointType[]) {
    // 在每一个分组中，将数据再按照 dim 分组，用于散列
    const groupDataArray = this.groupData(dataArray, dim);
    return _.each(groupDataArray, (data: DataPointType[], dimValue: string) => {
      return this.adjustGroup(data, dim, parseFloat(dimValue), values);
    });
  }

  // 随机出来的字段值
  private getAdjustOffset(range: RangeType): number {
    const { pre, next } = range;
    // 随机的范围
    const margin = (next - pre) * GAP;
    return randomNumber(pre + margin, next - margin);
  }

  // adjust group data
  private adjustGroup(group: DataPointType[], dim: string, dimValue: number, values: number[]): DataPointType[] {
    // 调整范围
    const range = this.getAdjustRange(dim, dimValue, values);

    _.each(group, (data: DataPointType) => {
      data[dim] = this.getAdjustOffset(range); // 获取调整的位置
    });
    return group;
  }
}
