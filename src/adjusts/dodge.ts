import * as _ from '@antv/util';

import { DataPointType, DodgeCfg, RangeType } from '../interface';
import Adjust from './adjust';

// 偏移之后，间距
const MARGIN_RATIO = 1 / 2;
const DODGE_RATIO = 1 / 2;

export default class Dodge extends Adjust {
  public cacheMap: { [key: string]: any } = {};
  public adjustDataArray: DataPointType[][] = [];
  public mergeData: DataPointType[] = [];

  public cfg: DodgeCfg = {
    adjustNames: ['x', 'y'],
    xField: '',
    yField: '',
    // 调整过程中，2个数据的间距
    marginRatio: MARGIN_RATIO,
    // 调整占单位宽度的比例，例如：占 2 个分类间距的 1 / 2
    dodgeRatio: DODGE_RATIO,
  };

  constructor(cfg: DodgeCfg) {
    super(cfg);

    this.cfg = {
      ...this.cfg,
      ...cfg,
    };
  }

  public process(groupDataArray: DataPointType[][]): DataPointType[][] {
    const groupedDataArray = _.clone(groupDataArray);
    // 将数据数组展开一层
    const mergeData = _.flatten(groupedDataArray);

    const { dodgeBy } = this.cfg;

    // 如果指定了分组 dim 的字段
    const adjustDataArray = dodgeBy ? _.group(mergeData, dodgeBy) : groupedDataArray;

    this.cacheMap = {};
    this.adjustDataArray = adjustDataArray;
    this.mergeData = mergeData;

    this.adjustData(adjustDataArray, mergeData);

    this.adjustDataArray = [];
    this.mergeData = [];

    // 下面不能注释掉，不然单测报错，我也不知道为啥 todo
    // this.cacheMap = {};
    return groupedDataArray;
  }

  public getDodgeOffset(range: RangeType, idx: number, len: number): number {
    const { dodgeRatio, marginRatio } = this.cfg;
    const { pre, next } = range;

    const tickLength = next - pre;

    const width = (tickLength * dodgeRatio) / len;
    const margin = marginRatio * width;

    const offset =
      (1 / 2) * (tickLength - len * width - (len - 1) * margin) +
      ((idx + 1) * width + idx * margin) -
      (1 / 2) * width -
      (1 / 2) * tickLength;

    return (pre + next) / 2 + offset;
  }

  public getDistribution(dim: string) {
    const groupedDataArray = this.adjustDataArray;
    const cacheMap = this.cacheMap;
    let map = cacheMap[dim];

    if (!map) {
      map = {};
      _.each(groupedDataArray, (data, index) => {
        const values = _.valuesOfKey(data, dim) as number[];
        if (!values.length) {
          values.push(0);
        }
        _.each(values, (val: number) => {
          if (!map[val]) {
            map[val] = [];
          }
          map[val].push(index);
        });
      });
      cacheMap[dim] = map;
    }

    return map;
  }

  public adjustDim(
    dim: string,
    values: number[],
    data: DataPointType[],
    frameCount: number,
    frameIndex: number
  ): any[] {
    const map = this.getDistribution(dim);
    const groupData = this.groupData(data, dim); // 根据值分组

    _.each(groupData, (group, key) => {
      let range: RangeType;

      // xField 中只有一个值，不需要做 dodge
      if (values.length === 1) {
        range = {
          pre: values[0] - 1,
          next: values[0] + 1,
        };
      } else {
        // 如果有多个，则需要获取调整的范围
        range = this.getAdjustRange(dim, parseFloat(key), values);
      }
      _.each(group, (d) => {
        const value = d[dim];
        const valueArr = map[value];
        const valIndex = valueArr.indexOf(frameIndex);
        d[dim] = this.getDodgeOffset(range, valIndex, valueArr.length);
      });
    });
    return [];
  }
}
