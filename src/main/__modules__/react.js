import adaptHyperscriptFunction from '../internal/helper/adaptHyperscriptFunction';
import React from 'react';

export default adaptHyperscriptFunction({
    createElement: React.createElement,
    isElement: React.isValidElement,
    Fragment: React.Fragment,
    adapterName: 'react'
});
