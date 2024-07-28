// @ts-check
import { BeHive, seed, MountObserver } from 'be-hive/be-hive.js';
/** @import {EMC} from './node_modules/trans-render/be/types.d.ts' */

/**
 * @type {EMC}
 */
export const emc = {
    base: 'be-value-added',
    map: {
        '0.0': 'ni'
    },
    enhPropKey: 'beValueAdded',
    importEnh: async () => {
        const { BeValueAdded } = 
        /** @type {{new(): IEnhancement<Element>}} */ 
        /** @type {any} */
        (await import('./be-value-added.js'));
        return BeValueAdded;
    }
};
const mose = seed(emc);
MountObserver.synthesize(document, BeHive, mose);
