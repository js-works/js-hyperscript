import parseHyperscript from './parseHyperscript';

export default function adaptHyperscriptFunction({
    createElement,
    isElement,
    adapterName,
    Fragment = null,
    cache = {},
}) {
    const isDio = adapterName === 'dio';

    return (...args) => {
        let ret;

        const
            argCount = args.length,
            firstArg = args[0],
            typeOfFirstArg = typeof firstArg,
            firstArgIsString = typeOfFirstArg === 'string',
            secondArg = args[1],

            notSkippingProps =
                secondArg === undefined || secondArg === null
                    || typeof secondArg === 'object' && !isElement(secondArg);

        let
            props = notSkippingProps ? secondArg || null : null,
            hyperscriptRecords = null,
            lastHyperscriptRecord = null;

        if (firstArgIsString) {
            hyperscriptRecords = cache[firstArg];

            if (!hyperscriptRecords) {
                hyperscriptRecords = parseHyperscript(firstArg);

                if (!hyperscriptRecords) {
                    throw new Error(`Invalid hyperscript: ${firstArg}`);
                }

                cache[firstArg] = hyperscriptRecords;
            }

            lastHyperscriptRecord =
                hyperscriptRecords[hyperscriptRecords.length - 1];

            args[0] = lastHyperscriptRecord.tag;
        } else if (firstArg === null && Fragment) {
            args[0] = Fragment;
        } else if (!firstArgIsString
            && firstArg
            && firstArg.type
            && typeOfFirstArg === 'function') {
            
                // Supporting factories etc.
            args[0] = firstArg.type;
        }

        if (notSkippingProps
            && (!firstArgIsString
                || (hyperscriptRecords.length === 1 && !lastHyperscriptRecord.props))) {
            
            ret = createElement.apply(null, args);
        } else {
            if (!notSkippingProps && argCount > 1) {
                for (let i = 1; i < argCount; ++i) {
                    args[argCount - i + 1] = args[argCount - i]; 
                }
            }

            const
                hasArgumentProps = notSkippingProps && !!secondArg,
                hasHyperscriptProps = lastHyperscriptRecord && !!lastHyperscriptRecord.props,
                needsPropMerging = hasArgumentProps || hasHyperscriptProps;

            if (!needsPropMerging) {
                if (hasArgumentProps) {
                    props = secondArg;
                } else if (hasHyperscriptProps) {
                    props = lastHyperscriptRecord.props;
                }
            } else {
                props = {};

                let className = null;

                if (hasHyperscriptProps) {
                    const
                        entries = lastHyperscriptRecord.entries,
                        entryCount = entries.length;

                    for (let i = 0; i < entryCount; ++i) {
                        const
                            entry = entries[i],
                            key = entry[0],
                            value = entry[1];
                        
                        props[key] = value;
                    }

                    className = props.className || null;
                }


                if (hasArgumentProps) {
                    for (let key in secondArg) {
                        if (secondArg.hasOwnProperty(key)) {
                            props[key] = secondArg[key];
                        }
                    }

                    if (className !== null && secondArg.className) {
                        props.className = className + ' ' + secondArg.className;
                    }
                }
            }

            args[1] = props;
            ret = createElement.apply(null, args);

            if (hyperscriptRecords && hyperscriptRecords.length > 1) {
                for (let i = hyperscriptRecords.length - 2; i >= 0; --i) {
                    const data = hyperscriptRecords[i];

                    ret = createElement(data.tag, data.props, ret);
                }
            }
        }

        return ret;
    };
}
