import adaptHyperscriptFunction from '../internal/helper/adaptHyperscriptFunction';
import dio from 'dio.js';

export const hyperscript = adaptHyperscriptFunction({
    createElement: dio.createElement,
    isElement: dio.isValidElement,
    adapterName: 'dio'
});

export const isElement = dio.isValidElement;