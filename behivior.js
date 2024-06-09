import { BeHive, seed, MountObserver } from 'be-hive/be-hive.js';
const base = 'be-value-added';
export const emc = {
    base,
    map: {
        '0.0': 'ni'
    },
    enhPropKey: 'beValueAdded',
    importEnh: async () => {
        const { BeValueAdded } = await import('./behance.js');
        return BeValueAdded;
    }
};
const mose = seed(emc);
MountObserver.synthesize(document, BeHive, mose);
