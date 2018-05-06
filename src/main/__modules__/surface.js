import parseHyperscript from '../internal/helper/parseHyperscript';

import { createElement } from 'js-surface';

const hyperscriptCache = {};

export default function hyperscript() {
    let 
        ret,
        type = arguments[0],
        props = null,
        children = null,
        hyperscriptRecords,
        lastHyperscriptRecord;

    const
        argCount = arguments.length,
        firstArg = type,
        typeOfFirstArg = typeof firstArg,
        firstArgIsString = typeOfFirstArg === 'string',
        secondArg = arguments[1],

        skippedProps =
            secondArg !== undefined && secondArg !== null
                && (typeof secondArg !== 'object'
                    || secondArg[Symbol.iterator]
                    || secondArg.isElement === true),
        
        hasChildren = argCount === 2 && skippedProps || argCount > 2;

    if (firstArgIsString) {
        hyperscriptRecords = hyperscriptCache[firstArg];

        if (!hyperscriptRecords) {
            hyperscriptRecords = parseHyperscript(firstArg);

            if (!hyperscriptRecords) {
                throw new Error(`Invalid hyperscript: ${firstArg}`);
            }

            hyperscriptCache[firstArg] = hyperscriptRecords;
        }

        lastHyperscriptRecord =
            hyperscriptRecords[hyperscriptRecords.length - 1];

        type = lastHyperscriptRecord.tag;
    } else if (!firstArgIsString
        && firstArg
        && firstArg.type
        && typeOfFirstArg === 'function') {
        
        // Supporting factories etc.
        type = firstArg.type;
    }

    if (!skippedProps) {
        props = arguments[1];

        if (hasChildren) {
            children = Array(argCount - 2);

            for (let i = 2; i < argCount; ++i) {
                children[i - 2] = arguments[i];
            }
        }
    } else if (hasChildren) {
        children = Array(argCount - 1);
        
        for (let i = 1; i < argCount; ++i) {
            children[i - 1] = arguments[i];
        }
    }

    if (!skippedProps
        && (!firstArgIsString
            || (hyperscriptRecords.length === 1 && !lastHyperscriptRecord.props))) {
        
        ret = {
            type,
            props,
            children,
            isElement: true
        };
    } else {
        const
            hasArgumentProps = !skippedProps && !!secondArg,
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

        if (children) {
            if (props === null) {
                props = { children };
            } else if (skippedProps || props !== secondArg) {
                props.children = children;
            } else {
                const
                    baseProps = props,
                    keys = Object.keys(baseProps);

                props = {};

                for (let i = 0; i < keys.length; ++i) {
                    const key = keys[i];

                    props[key] = baseProps[key];
                }

                props.children = children;
            }
        }

        ret = createElement(type, props);

        if (hyperscriptRecords && hyperscriptRecords.length > 1) {
            for (let i = hyperscriptRecords.length - 2; i >= 0; --i) {
                const
                    data = hyperscriptRecords[i],
                    dataProps = data.props;

                let props = {};

                if (dataProps) {
                    const entries = data.entries;

                    props = {};

                    for (let j = 0; j < entries.length; ++j) {
                        const entry = entries[j];

                        props[entry[0]] = entry[1];
                    }
                }

                props.children = [ret];

                ret = createElement(data.tag, props);
            }
        }
    }

    return ret;
}
