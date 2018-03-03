import parseHyperscript from '../internal/helper/parseHyperscript';

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
                    || secondArg.isElement === true);

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

        if (argCount > 2) {
            children = Array(argCount - 2);

            for (let i = 2; i < argCount; ++i) {
                children[i - 2] = arguments[i];
            }
        }
    } else if (argCount > 1) {
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

        ret = {
            type,
            props,
            children,
            isElement: true
        };

        if (hyperscriptRecords && hyperscriptRecords.length > 1) {
            for (let i = hyperscriptRecords.length - 2; i >= 0; --i) {
                const data = hyperscriptRecords[i];

                ret = {
                    type: data.tag,
                    props: data.props,
                    children: [ret],
                    isElement: true
                };
            }
        }
    }

    return ret;
}
