import './behance.js';
import {BeHive} from 'be-hive/be-hive.js';


BeHive.registry.register({
    base: 'be-value-added',
    map: {
        '0.0': 'ni'
    },
    do:{
        mount:{
            import: async () => {
                const {BeValueAdded} = await import('./be-value-added.js');
                return BeValueAdded;
            }
        }
    }
});