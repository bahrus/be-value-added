import {BeHive, EnhancementMountCnfg} from 'be-hive/be-hive.js';
import {MountObserver, MOSE} from 'mount-observer/MountObserver.js';

const base = 'be-value-added';
const emc: EnhancementMountCnfg = {
    base,
    map: {
        '0.0': 'ni'
    },
    enhPropKey: 'beValueAdded',
    importEnh: async () => {
        const {BeValueAdded} = await import('./behance.js');
        return BeValueAdded;
    }
};

const mose = document.createElement('script') as MOSE<EnhancementMountCnfg>;
mose.id = base;
mose.synConfig = emc;

MountObserver.synthesize(document, BeHive, mose);
