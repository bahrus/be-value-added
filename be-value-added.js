import { BE, propInfo } from 'be-enhanced/BE.js';
export class BeValueAdded extends BE {
    #mutationObserver;
    #skipParsingAttrChange = false;
    #skipSettingAttr = false;
    async hydrate(self) {
        const { enhancedElement, observeAttr, value } = self;
        if (observeAttr) {
            const mutOptions = {
                attributeFilter: [self.attr],
                attributes: true
            };
            self.#mutationObserver = new MutationObserver(( /*mutations: MutationRecord[]*/) => {
                if (self.#skipParsingAttrChange) {
                    self.#skipParsingAttrChange = false;
                    return;
                }
                self.parseAttr(self);
            });
            self.#mutationObserver.observe(enhancedElement, mutOptions);
        }
        const { localName } = enhancedElement;
        switch (localName) {
            case 'data':
            case 'time':
                enhancedElement.ariaLive = 'polite';
                break;
        }
        if (value === undefined) {
            self.parseAttr(self);
        }
    }
    get attr() {
        switch (this.enhancedElement.localName) {
            case 'link':
                return 'href';
            case 'meta':
                return 'content';
            case 'data':
                return 'value';
            case 'time':
                return 'datetime';
            default:
                return 'value';
        }
    }
    detach(detachedElement) {
        if (this.#mutationObserver !== undefined)
            this.#mutationObserver.disconnect();
    }
    parseAttr(self) {
        const { enhancedElement } = self;
        self.#skipSettingAttr = true;
        if (enhancedElement instanceof HTMLMetaElement) {
            const type = enhancedElement.getAttribute('itemtype');
            const content = enhancedElement.content;
            switch (type) {
                case 'https://schema.org/Number':
                    return {
                        value: Number(content),
                        resolved: true,
                    };
                case 'https://schema.org/Integer':
                    return {
                        value: parseInt(content),
                        resolved: true,
                    };
                case 'https://schema.org/Float':
                    return {
                        value: parseFloat(content),
                        resolved: true,
                    };
                default:
                    return {
                        value: content,
                        resolved: true,
                    };
            }
        }
        else if (enhancedElement instanceof HTMLLinkElement) {
            const split = (enhancedElement.href).split('/');
            const lastVal = split.at(-1);
            self.#skipParsingAttrChange = true;
            switch (lastVal) {
                case 'True':
                    return {
                        value: true,
                        resolved: true,
                    };
                case 'False':
                    return {
                        value: false,
                        resolved: true,
                    };
                default:
                    return {
                        value: lastVal,
                        resolved: true,
                    };
            }
        }
        else if (enhancedElement instanceof HTMLDataElement) {
            return {
                value: JSON.parse(enhancedElement.value),
                resolved: true,
            };
        }
        else if (enhancedElement instanceof HTMLTimeElement) {
            return {
                value: Date.parse(enhancedElement.dateTime),
                resolved: true,
            };
        }
        else {
            return {
                resolved: false,
            };
        }
    }
    onValChange(self) {
        const { value } = self;
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
    }
};
