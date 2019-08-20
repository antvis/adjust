export interface AdjustBaseCfg {
  readonly adjustNames: string[];
}

export interface AdjustCfg {
  readonly adjustNames: string[];
  readonly xField?: string;
  readonly yField?: string;

  readonly dodgeBy?: string;
  readonly marginRatio?: number;
  readonly dodgeRatio?: number;

  readonly size?: number;
  readonly height?: number;
  readonly reverseOrder?: boolean;
}

export interface DodgeCfg extends AdjustBaseCfg {
  readonly xField: string;
  readonly yField: string;
  readonly marginRatio: number;
  readonly dodgeRatio: number;
  readonly dodgeBy?: string;
}

export interface JitterCfg extends AdjustBaseCfg {
  readonly xField: string;
  readonly yField: string;

  // readonly marginRatio: number;
  // readonly dodgeRatio: number;
}

export interface StackCfg extends AdjustBaseCfg {
  readonly xField: string;
  readonly yField: string;

  readonly height: number;
  readonly size: number;
  readonly reverseOrder: boolean;
}

export interface SymmetricCfg extends AdjustBaseCfg {
  readonly xField: string;
  readonly yField: string;
}

// 一个数据点的数据结构，只能说是一个 object，什么都定义不了
export interface DataPointType {
  [key: string]: any;
}

export interface RangeType {
  pre: number;
  next: number;
}
