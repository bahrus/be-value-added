import {config as beCnfg} from 'be-enhanced/config.js';
import {BE, BEConfig} from 'be-enhanced/BE.js';
import {BVAActions, BVAAllProps, BVAP, PropTypes, } from './types';
import { Positractions, PropInfo } from 'trans-render/froop/types';
import {IEnhancement,  BEAllProps} from 'trans-render/be/types';

export class BeValueAdded extends BE<Element> implements BVAActions{
    static override config: BEConfig<BVAP & BEAllProps, BVAActions & IEnhancement, any> = {
        propInfo: {
            attached: {
                def: true,
                ro: true,
            },
            value: {},
            resolved: {
                def: false,
            },
            valueFromTextContent: {}
        },
        actions: {
            hydrate: {
                ifAllOf: ['attached'],
            },
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
            obs:{
                ifAllOf: ['mutOptions']
            },
        }

    };

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

    get attr(): PropTypes {
        const {enhancedElement} = this;
        for(const prop of propTests){
            if(prop in enhancedElement) return prop;
        }
        return 'textContent';
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
                const currVal = (enhancedElement as HTMLTimeElement).dateTime;
                if(!currVal){
                    this.#skipSettingAttr = false;
                }
                return {
                    value: new Date(currVal),
                    ...returnObj
                }
            }
            case 'value':{
                const type = enhancedElement.getAttribute('itemtype');
                const content = (<any>enhancedElement).value;
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

    override async detach(detachedElement: Element) {
        if(this.#mutationObserver !== undefined) this.#mutationObserver.disconnect();
    }

    onValChange(self: this) {
        const {value, valueFromTextContent} = self;
        if(value === undefined || value === null){
            return;
        }
        const {enhancedElement} = self;
        if(!this.#skipSettingAttr){
            this.#skipParsingAttrOrTextContentChange = true;
            if(enhancedElement instanceof HTMLMetaElement){
                enhancedElement.content = Array.isArray(value) ? jsonArrAttr : value.toString(); 
            }else if(enhancedElement instanceof HTMLLinkElement){
                const urlVal = value === true ? 'True' :
                value === false ? 'False' : value;
                enhancedElement.href = 'https://schema.org/' + urlVal;
            }else if(enhancedElement instanceof HTMLDataElement){
                enhancedElement.textContent = value.toLocaleString ? value.toLocaleString() : value.toString();
            }else if(enhancedElement instanceof HTMLTimeElement){
                enhancedElement.textContent = (value as Date).toLocaleDateString ? (value as Date).toLocaleDateString() : value.toString();
            }else if(valueFromTextContent){
                enhancedElement.textContent = value.toString();
            }
        }
        this.#skipSettingAttr = false;
    }
}

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
        if(str === jsonArrAttr || str === jsonObjAttr) return str;
        try{
            return JSON.parse(str);
        }catch(e){
            return str;
        }
    }else{
        return str;
    }
    
}

export interface BeValueAdded extends BVAAllProps{}

const propTests: Array<PropTypes> = ['href', 'content', 'value', 'dateTime', 'textContent'];

const jsonObjAttr = '{...}';
const jsonArrAttr = '[...]';