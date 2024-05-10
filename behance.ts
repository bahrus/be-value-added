import {BeValueAdded} from './be-value-added.js';
import {def} from 'trans-render/lib/def.js';

await BeValueAdded.bootUp();

def('be-value-added', BeValueAdded);