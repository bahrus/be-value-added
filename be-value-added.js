import { BE, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
import { register } from 'be-hive/register.js';
// function tryJSONParse(s: string){
//     try{
//         return JSON.parse(s);
//     }catch(e){
//         return undefined;
//     }
// }
function parseVal(str, type, tryJSON = false) {
    switch (type) {
        case 'https://schema.org/Number':
            return Number(str);
        case 'https://schema.org/Integer':
            return parseInt(str);
        case 'https://schema.org/Float':
            return parseFloat(str);
        case 'https://schema.org/DateTime':
            return new Date(str);
    }
    if (tryJSON) {
        if (str === jsonArrAttr || str === jsonObjAttr)
            return str;
        try {
            return JSON.parse(str);
        }
        catch (e) {
            return str;
        }
    }
    else {
        return str;
    }
}
const propTests = ['href', 'content', 'value', 'dateTime', 'textContent'];
const jsonObjAttr = '{...}';
const jsonArrAttr = '[...]';
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
            //console.log('in mut observer event');
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
        for (const prop of propTests) {
            if (prop in enhancedElement)
                return prop;
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
        switch (attr) {
            case 'content': {
                const type = enhancedElement.getAttribute('itemtype');
                const content = enhancedElement.content;
                return {
                    value: parseVal(content, type, true),
                    ...returnObj
                };
            }
            case 'href': {
                const { href } = enhancedElement;
                if (enhancedElement instanceof HTMLLinkElement) {
                    const split = (enhancedElement.href).split('/');
                    const lastVal = split.at(-1);
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
                else {
                    return {
                        value: href,
                        ...returnObj,
                    };
                }
            }
            case 'dateTime': {
                return {
                    value: new Date(enhancedElement.dateTime),
                    ...returnObj
                };
            }
            case 'value': {
                const type = enhancedElement.getAttribute('itemtype');
                const content = enhancedElement.content;
                return {
                    value: parseVal(content, type, true),
                    ...returnObj
                };
            }
        }
        return {
            resolved: false,
        };
    }
    onValChange(self) {
        const { value, valueFromTextContent } = self;
        if (value === undefined || value === null) {
            return;
        }
        const { enhancedElement } = self;
        if (!this.#skipSettingAttr) {
            this.#skipParsingAttrOrTextContentChange = true;
            if (enhancedElement instanceof HTMLMetaElement) {
                enhancedElement.content = Array.isArray(value) ? jsonArrAttr : jsonObjAttr;
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
        ifAllOf: ['beVigilant', 'valueFromTextContent'],
    },
    obsAttr: {
        ifAllOf: ['beVigilant'],
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
        isEnh: true,
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
