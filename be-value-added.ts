import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import {BVAAllProps, BVAActions, BVAP, PropTypes} from './types.js';
import { IEnhancement } from 'be-enhanced/types.js';
import { XE } from 'xtal-element/XE.js';
import {XEArgs, PropInfoExt} from 'xtal-element/types';
import {Action} from 'trans-render/lib/types.js';
import { register } from 'be-hive/register.js';

// function tryJSONParse(s: string){
//     try{
//         return JSON.parse(s);
//     }catch(e){
//         return undefined;
//     }
// }

function parseVal(str: string, type: string | null, tryJSON = false){
    switch(type){
        case 'https://schema.org/Number':
            return Number(str);
        case 'https://schema.org/Integer':
            return parseInt(str);
        case 'https://schema.org/Float':
            return parseFloat(str);
        case 'https://schema.org/DateTime':
            return new Date(str);

    }
    if(tryJSON){
        try{
            return JSON.parse(str);
        }catch(e){
            return str;
        }
    }else{
        return str;
    }
    
}

const propTests: Array<PropTypes> = ['href', 'content', 'value', 'dateTime', 'textContent'];

export class BeValueAdded extends BE<BVAAllProps, BVAActions> implements BVAActions{
    #mutationObserver: MutationObserver | undefined;
    #skipParsingAttrOrTextContentChange = false;
    #skipSettingAttr = false;

    hydrate(self: this){
        const {enhancedElement, value} = self;
        const attr = self.attr;
        enhancedElement.ariaLive = 'polite';
        return value === undefined ? self.parseAttr(self) : {
            resolved: true,
            valueFromTextContent: attr === 'textContent',
        };
    
        
    }

    obs(self: this){
        const {enhancedElement, mutOptions} = self;
        self.#mutationObserver = new MutationObserver((/*mutations: MutationRecord[]*/) => {
            //console.log('in mut observer event');
            if(self.#skipParsingAttrOrTextContentChange){
                self.#skipParsingAttrOrTextContentChange = false;
                return;
            }
            Object.assign(self, self.parseAttr(self));
        });
        self.#mutationObserver.observe(enhancedElement, mutOptions);
    }

    obsTC(self: this){
        return {
            mutOptions:{
                childList: true
            }
        } as BVAP;
    }

    obsAttr(self: this){
        return {
            mutOptions: {
                attributeFilter: [self.attr],
                attributes: true
            }
        } as BVAP;
    }

    get attr(): PropTypes {
        const {enhancedElement} = this;
        for(const prop of propTests){
            if(prop in enhancedElement) return prop;
        }
        return 'textContent';
    }

    override detach(detachedElement: Element): void {
        if(this.#mutationObserver !== undefined) this.#mutationObserver.disconnect();
    }



    parseAttr(self: this): Partial<BVAAllProps> {
        const {enhancedElement, attr} = self;
        
        const returnObj: Partial<BVAAllProps> = {
            resolved: true,
            valueFromTextContent: attr === 'textContent'
        };
        if(attr === 'textContent'){
            return {
                value: enhancedElement.textContent,
                ...returnObj
            }
        }
        self.#skipSettingAttr = true;
        switch(attr){
            case 'content':{
                const type = enhancedElement.getAttribute('itemtype');
                const content = (<any>enhancedElement).content;
                return {
                    value: parseVal(content, type, true),
                    ...returnObj
                }
            }
            case 'href': {
                const {href}: {href: string} = (<any>enhancedElement);
                if (enhancedElement instanceof HTMLLinkElement){
                    const split = (enhancedElement.href).split('/');
                    const lastVal = split.at(-1);
                    switch(lastVal){
                        case 'True':
                            return {
                                value: true,
                                ...returnObj
                            }
                        case 'False':
                            return {
                                value: false,
                                ...returnObj
                            }
                        default:
                            return {
                                value: lastVal,
                                ...returnObj
                            }
                    }
                }else{
                    return {
                        value: href,
                        ...returnObj,
                    }
                }
            }
            case 'dateTime': {
                return {
                    value: new Date((<any>enhancedElement).dateTime),
                    ...returnObj
                }
            }
            case 'value':{
                const type = enhancedElement.getAttribute('itemtype');
                const content = (<any>enhancedElement).content;
                return {
                    value: parseVal(content, type, true),
                    ...returnObj
                }
            }
        }
        return {
            resolved: false,
        }
    }

    onValChange(self: this) {
        const {value, valueFromTextContent} = self;
        if(value === undefined || value === null){
            return;
        }
        debugger;
        const {enhancedElement} = self;
        if(!this.#skipSettingAttr){
            this.#skipParsingAttrOrTextContentChange = true;
            if(enhancedElement instanceof HTMLMetaElement){
                enhancedElement.content = JSON.stringify(value);
            }else if(enhancedElement instanceof HTMLLinkElement){
                const urlVal = value === true ? 'True' :
                value === false ? 'False' : value;
                enhancedElement.href = 'https://schema.org/' + urlVal;
            }else if(valueFromTextContent){
                enhancedElement.textContent = value.toString();
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

export const beValueAddedActions: Partial<{[key in keyof BVAActions]: Action<BVAAllProps> | keyof BVAAllProps}> = {
    hydrate: 'attached',
    onValChange:{
        ifKeyIn: ['value']
    },
    obsTC: {
        ifAllOf: ['beVigilant', 'valueFromTextContent'],
    },
    obsAttr:{
        ifAllOf: ['beVigilant'],
        ifNoneOf: ['valueFromTextContent']
    },
    obs: 'mutOptions',
};

const tagName = 'be-value-added';
const ifWantsToBe = 'value-added';
const upgrade = 'time,data,link,meta';

const xe = new XE<BVAAllProps, BVAActions>({
    config:{
        tagName,
        isEnh: true,
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