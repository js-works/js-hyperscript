import adaptHyperscriptFunction from '../internal/helper/adaptHyperscriptFunction';

export default adaptHyperscriptFunction({
    createElement,
    isElement,
    adapterName: 'universal'
});

// --- locals ------------------------------------------------------

function createElement(/* type, props, ...children */) {
    const
        argCount = arguments.length,
        type = arguments[0],
        props = arguments[1],
        children = argCount < 3 ? null : new Array(argCount - 2);

    if (children) {
        for (let i = 2; i < argCount; ++i) {
            children[i - 2] = arguments[i];
        }
    }

    return {
        type,
        props,
        children,
        isElement: true
    };
}

function isElement(it) {
    return it && it.isElement === true && 'type' in it;
}
