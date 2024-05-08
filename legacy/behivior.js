import { register } from 'be-hive/register.js';
import { tagName } from './be-value-added.js';
import './be-value-added.js';
const ifWantsToBe = 'value-added';
const upgrade = 'time,data,link,meta';
register(ifWantsToBe, upgrade, tagName);
