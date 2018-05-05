import adaptHyperscriptFunction from '../internal/helper/adaptHyperscriptFunction';
import React from 'react';

export const hyperscript = adaptHyperscriptFunction({
    createElement: React.createElement,
    isElement: React.isValidElement,
    adapterName: 'react'
});

export const isElement = React.isValidElement;