import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import {BVAAllProps, BVAActions, TMicroElement} from './types.js';
import { IEnhancement } from 'be-enhanced/types.js';
import { XE } from 'xtal-element/XE.js';
import {XEArgs, PropInfoExt} from 'xtal-element/types';
import {Action} from 'trans-render/lib/types.js';
import { register } from 'be-hive/register.js';

export class BeValueAdded<TElement extends Element = TMicroElement> extends BE<BVAAllProps, BVAActions, TElement> implements BVAActions{
    #mutationObserver: MutationObserver | undefined;
    #skipParsingAttrChange = false;
    #skipSettingAttr = false;

    hydrate(self: this){
        const {enhancedElement, observeAttr, value} = self;
        if(observeAttr){
            const mutOptions: MutationObserverInit = {
                attributeFilter: [self.attr],
                attributes: true
            };
            self.#mutationObserver = new MutationObserver((/*mutations: MutationRecord[]*/) => {
                if(self.#skipParsingAttrChange){
                    self.#skipParsingAttrChange = false;
                    return;
                }
                Object.assign(self, self.parseAttr(self));
            });
            self.#mutationObserver.observe(enhancedElement, mutOptions);
        }
        const {localName} = enhancedElement;
        switch(localName){
            case 'data':
            case 'time':
                enhancedElement.ariaLive = 'polite';
                break;
        }
        return value === undefined ? self.parseAttr(self) : {resolved: true};
    
        
    }

    get attr(){
        switch(this.enhancedElement.localName){
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

    override detach(detachedElement: TElement): void {
        if(this.#mutationObserver !== undefined) this.#mutationObserver.disconnect();
    }

    parseAttr(self: this): Partial<BVAAllProps> {
        const {enhancedElement} = self;
        self.#skipSettingAttr = true;
        if(enhancedElement instanceof HTMLMetaElement){
            const type = enhancedElement.getAttribute('itemtype');
            const content = enhancedElement.content;
            switch(type){
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
                    }
                default:
                    return {
                        value: content,
                        resolved: true,
                    }
            }
        }else if (enhancedElement instanceof HTMLLinkElement){
            const split = (enhancedElement.href).split('/');
            const lastVal = split.at(-1);
            self.#skipParsingAttrChange = true;
            switch(lastVal){
                case 'True':
                    return {
                        value: true,
                        resolved: true,
                    }
                case 'False':
                    return {
                        value: false,
                        resolved: true,
                    }
                default:
                    return {
                        value: lastVal,
                        resolved: true,
                    }
            }
        }else if(enhancedElement instanceof HTMLDataElement){
            return {
                value: JSON.parse(enhancedElement.value),
                resolved: true,
            }
        
        }else if(enhancedElement instanceof HTMLTimeElement){
            return {
                value: Date.parse(enhancedElement.dateTime),
                resolved: true,
            }
        }else{
            return {
                resolved: false,
            }
        }
    }

    onValChange(self: this) {
        const {value} = self;
        if(value === undefined || value === null){
            return;
        }
        const {enhancedElement} = self;
        if(!this.#skipSettingAttr){
            if(enhancedElement instanceof HTMLMetaElement){
                enhancedElement.content = value.toString();
            }else if(enhancedElement instanceof HTMLLinkElement){
                const urlVal = value === true ? 'True' :
                value === false ? 'False' : value;
                enhancedElement.href = 'https://schema.org/' + urlVal;
            }
        }
        this.#skipSettingAttr = false;
    }
}

export interface BeValueAdded extends BVAAllProps{}

export const beValueAddedPropDefaults: Partial<BVAAllProps> = {
    attached: true,
}

export const beValueAddedPropInfo: Partial<{[key in keyof BVAAllProps]: PropInfoExt<IEnhancement>}> = {
    ...propInfo,
    value:{
        notify:{
            dispatch: true,
        }
    }
};

export const beValueAddedActions = {
    hydrate: 'attached',
    onValChange:{
        ifKeyIn: ['value']
    }
} as Partial<{[key in keyof BVAActions]: Action<BVAAllProps> | keyof BVAAllProps}>;

const tagName = 'be-value-added';
const ifWantsToBe = 'value-added';
const upgrade = 'time,data,link,meta';

const xe = new XE<BVAAllProps, BVAActions>({
    config:{
        tagName,
        propDefaults:{
            ...beValueAddedPropDefaults
        },
        propInfo:{
            ...beValueAddedPropInfo
        },
        actions:{
            ...beValueAddedActions
        }
    },
    superclass: BeValueAdded
});

register(ifWantsToBe, upgrade, tagName);