import { BeValueAdded } from './be-value-added.js';
import { def } from 'trans-render/lib/def.js';
import { BeHive } from 'be-hive/be-hive.js';
await BeValueAdded.bootUp();
def('be-value-added', BeValueAdded);
BeHive.registry.register({
    base: 'be-value-added',
    map: {
        '0.0': 'ni'
    }
});
