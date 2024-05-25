import { BeHive } from 'be-hive/be-hive.js';
import { MountObserver } from 'mount-observer/MountObserver.js';
const base = 'be-value-added';
const emc = {
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
const mose = document.createElement('script');
mose.id = base;
mose.synConfig = emc;
MountObserver.synthesize(document, BeHive, mose);
