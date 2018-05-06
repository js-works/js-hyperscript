import adaptHyperscriptFunction from '../internal/helper/adaptHyperscriptFunction';
import dio from 'dio.js';

export default adaptHyperscriptFunction({
    createElement: dio.createElement,
    isElement: dio.isValidElement,
    adapterName: 'dio'
});
