// 完整版下使用支持按照某个字段进行分组的 dodge
const mix = require('@antv/util/src/mix');
const Adjust = require('./base');
const Dodge = require('./dodge');
const AdjustMixin = require('./mixin/adjust');
const DodgeMixin = require('./mixin/dodge');
mix(Adjust.prototype, AdjustMixin);
mix(Dodge.prototype, AdjustMixin, DodgeMixin);

Adjust.Stack = require('./stack');
Adjust.Jitter = require('./jitter');
Adjust.Symmetric = require('./symmetric');
Adjust.Dodge = Dodge;

module.exports = Adjust;