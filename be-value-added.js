import { BE, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
import { register } from 'be-hive/register.js';
function tryJSONParse(s) {
    try {
        return JSON.parse(s);
    }
    catch (e) {
        return undefined;
    }
}
const propTests = [
    {
        prop: 'href',
        attr: 'href'
    }, {
        prop: 'content',
        attr: 'content'
    }, {
        prop: 'value',
        attr: 'value'
    }, {
        prop: 'dateTime',
        attr: 'datetime'
    }
];
export class BeValueAdded extends BE {
    #mutationObserver;
    #skipParsingAttrOrTextContentChange = false;
    #skipSettingAttr = false;
    hydrate(self) {
        const { enhancedElement, value } = self;
        const attr = self.attr;
        enhancedElement.ariaLive = 'polite';
        return value === undefined ? self.parseAttr(self) : {
            resolved: true,
            valueFromTextContent: attr === 'textContent',
        };
    }
    obs(self) {
        const { enhancedElement, mutOptions } = self;
        self.#mutationObserver = new MutationObserver(( /*mutations: MutationRecord[]*/) => {
            console.log('in mut observer event');
            if (self.#skipParsingAttrOrTextContentChange) {
                self.#skipParsingAttrOrTextContentChange = false;
                return;
            }
            Object.assign(self, self.parseAttr(self));
        });
        self.#mutationObserver.observe(enhancedElement, mutOptions);
    }
    obsTC(self) {
        return {
            mutOptions: {
                childList: true
            }
        };
    }
    obsAttr(self) {
        return {
            mutOptions: {
                attributeFilter: [self.attr],
                attributes: true
            }
        };
    }
    get attr() {
        const { enhancedElement } = this;
        for (const test of propTests) {
            const { prop, attr } = test;
            if (prop in enhancedElement)
                return attr;
        }
        return 'textContent';
    }
    detach(detachedElement) {
        if (this.#mutationObserver !== undefined)
            this.#mutationObserver.disconnect();
    }
    parseAttr(self) {
        const { enhancedElement, attr } = self;
        const returnObj = {
            resolved: true,
            valueFromTextContent: attr === 'textContent'
        };
        if (attr === 'textContent') {
            return {
                value: enhancedElement.textContent,
                ...returnObj
            };
        }
        self.#skipSettingAttr = true;
        if (enhancedElement instanceof HTMLMetaElement) {
            const type = enhancedElement.getAttribute('itemtype');
            const content = enhancedElement.content;
            switch (type) {
                case 'https://schema.org/Number':
                    return {
                        value: Number(content),
                        ...returnObj
                    };
                case 'https://schema.org/Integer':
                    return {
                        value: parseInt(content),
                        ...returnObj
                    };
                case 'https://schema.org/Float':
                    return {
                        value: parseFloat(content),
                        ...returnObj
                    };
                default:
                    return {
                        value: content,
                        ...returnObj
                    };
            }
        }
        else if (enhancedElement instanceof HTMLLinkElement) {
            const split = (enhancedElement.href).split('/');
            const lastVal = split.at(-1);
            self.#skipParsingAttrOrTextContentChange = true;
            switch (lastVal) {
                case 'True':
                    return {
                        value: true,
                        ...returnObj
                    };
                case 'False':
                    return {
                        value: false,
                        ...returnObj
                    };
                default:
                    return {
                        value: lastVal,
                        ...returnObj
                    };
            }
        }
        else if (enhancedElement instanceof HTMLDataElement) {
            return {
                value: tryJSONParse(enhancedElement.value),
                ...returnObj
            };
        }
        else if (enhancedElement instanceof HTMLTimeElement) {
            return {
                value: Date.parse(enhancedElement.dateTime),
                ...returnObj
            };
        }
        else {
            return {
                resolved: false,
            };
        }
    }
    onValChange(self) {
        const { value, valueFromTextContent } = self;
        if (value === undefined || value === null) {
            return;
        }
        const { enhancedElement } = self;
        if (!this.#skipSettingAttr) {
            if (enhancedElement instanceof HTMLMetaElement) {
                enhancedElement.content = value.toString();
            }
            else if (enhancedElement instanceof HTMLLinkElement) {
                const urlVal = value === true ? 'True' :
                    value === false ? 'False' : value;
                enhancedElement.href = 'https://schema.org/' + urlVal;
            }
            else if (valueFromTextContent) {
                enhancedElement.textContent = value.toString();
            }
        }
        this.#skipSettingAttr = false;
    }
}
export const beValueAddedPropDefaults = {
    attached: true,
};
export const beValueAddedPropInfo = {
    ...propInfo,
    value: {
        notify: {
            dispatch: true,
        }
    }
};
export const beValueAddedActions = {
    hydrate: 'attached',
    onValChange: {
        ifKeyIn: ['value']
    },
    obsTC: {
        ifAllOf: ['observeStrValue', 'valueFromTextContent'],
    },
    obsAttr: {
        ifAllOf: ['observeStrValue'],
        ifNoneOf: ['valueFromTextContent']
    },
    obs: 'mutOptions',
};
const tagName = 'be-value-added';
const ifWantsToBe = 'value-added';
const upgrade = 'time,data,link,meta';
const xe = new XE({
    config: {
        tagName,
        propDefaults: {
            ...beValueAddedPropDefaults
        },
        propInfo: {
            ...beValueAddedPropInfo
        },
        actions: {
            ...beValueAddedActions
        }
    },
    superclass: BeValueAdded
});
register(ifWantsToBe, upgrade, tagName);
