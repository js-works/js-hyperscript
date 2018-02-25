import adaptHyperscriptFunction from '../internal/helper/adaptHyperscriptFunction';
import { createElement, isElement } from 'js-surface';

export default adaptHyperscriptFunction({
    createElement: createElement,
    isElement: isElement,
    Fragment: null,
    adapterName: 'surface'
});
