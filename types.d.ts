import { ActionOnEventConfigs } from "trans-render/froop/types";
import {JSONValue} from 'trans-render/lib/types';
import {IBE, Declarations} from 'be-enhanced/types';

//export type TMicroElement = HTMLLinkElement | HTMLMetaElement | HTMLDataElement | HTMLTimeElement;

export interface BVAEndUserProps extends IBE{
    beVigilant?: boolean;
    value?: string | boolean | number | Date | JSONValue;
}

export interface BVAAllProps extends BVAEndUserProps{
    attached?: boolean;
    mutOptions?: MutationObserverInit;
    valueFromTextContent?: boolean;
}

// export interface Output{
//     attr: string,
//     val: string,
// }

export type BVAP = Partial<BVAAllProps>

export interface BVAActions{
    hydrate(self: this): BVAP;
    parseAttr(self: this): BVAP;
    onValChange(self: this): void;
    obs(self: this): void;
    obsTC(self: this): BVAP;
    obsAttr(self: this): BVAP;
}

export type PropTypes = 'href' | 'content' | 'value' | 'dateTime' | 'textContent'