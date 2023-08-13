import { ActionOnEventConfigs } from "trans-render/froop/types";
import {IBE, Declarations} from 'be-enhanced/types';

export interface BVAEndUserProps extends IBE<HTMLLinkElement | HTMLMetaElement | HTMLDataElement | HTMLTimeElement>{
    observeAttr?: boolean;
    value?: string | boolean | number;
}

export interface BVAAllProps extends BVAEndUserProps{
    attached?: boolean;
}

// export interface Output{
//     attr: string,
//     val: string,
// }

export type BVAP = Partial<BVAAllProps>

export interface BVAActions{
    hydrate(self: this): void;
    parseAttr(self: this): BVAP;
    onValChange(self: this): void;
}