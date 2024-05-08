import { BE } from 'be-enhanced/BE.js';
export class BeValueAdded extends BE {
    static config = {
        propInfo: {
            attached: {
                def: true,
                ro: true,
            }
        },
    };
    #mutationObserver;
    #skipParsingAttrOrTextContentChange = false;
    #skipSettingAttr = false;
}
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
