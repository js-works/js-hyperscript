import parseHyperscript from '../internal/parseHyperscript';

const
    hyperscriptCache = {},
    simpleTagMark = {};

export default function defineHyperscript({ createElement, isElement, classAlias = 'class' }) {
    return function (...args) {
        const tag = args[0];

        let ret = null;

        if (typeof tag === 'string') {
            let hyperscriptData = hyperscriptCache[tag];

            if (hyperscriptData === simpleTagMark) {
                ret = applyCreateElement(...args);
            } else if (hyperscriptData) {
                ret = createHyperscriptElement(args, hyperscriptData);
            } else {
                hyperscriptData = parseHyperscript(tag);

                if (hyperscriptData === null) {
                    throw new Error(
                        "[createElement] First argument 'tag' "
                        + `is not in valid hyperscript format ('${tag}')`);
                }
                
                if (hyperscriptData.length === 1
                    && !hyperscriptData[0].attrs) {

                    hyperscriptCache[tag] = simpleTagMark;
                    ret = applyCreateElement(...args);
                } else {
                    hyperscriptCache[tag] = hyperscriptData;
                    ret = createHyperscriptElement(args, hyperscriptData);
                }
            }
        } else {
            ret = applyCreateElement(...args);
        }

        return ret;
    };

    function isAttrs(it) {
        return  it === undefined
            || it === null
            || typeof it === 'object'
                && !it[Symbol.iterator]
                && !isElement(it);
    }

    function applyCreateElement(...args) {
        let ret = null;

        if (isAttrs(args[1])) {
            ret = createElement(...args);
        } else {
            ret = createElement(args[0], null, ...args.slice(1));
        }

        return ret;
    }

    function createHyperscriptElement(args, hyperscriptData) {
        let currElem = null;
        
        const dataLength = hyperscriptData.length;

        for (let i = dataLength - 1; i >= 0; --i) {
            const { tag, attrs, entries } = hyperscriptData[i];

            if (i < dataLength - 1) {
                currElem = createElement(tag, attrs, currElem);
            } else {
                const
                    attrs2 = {},
                    hasProps = isAttrs(args[1]);

                let className = attrs && attrs.class ? attrs.class : null;
                
                // This is faster then Object.assign
                for (let i = 0; i < entries.length; ++i) {
                    const entry = entries[i];
                    attrs2[entry[0]] = entry[1];
                }

                if (hasProps) {
                    Object.assign(attrs2, args[1]);

                    const 
                        classVal1 = attrs2.class,
                        classVal2 = attrs2[classAlias];

                    if (classVal1 && classVal1 !== className) {
                        if (!className) {
                            className = classVal1;
                        } else {
                            className += ' ' + classVal1;
                        }
                    }

                    if (classVal2 && classVal2 !== classVal1) {
                        if (!className) {
                            className = classVal2;
                        } else {
                            className += ' ' + classVal2; 
                        }
                    }

                    if (className) {
                        attrs2[classAlias] = className;
                    }

                    if (classAlias !== 'class' && attrs2.class !== undefined) {
                        delete attrs2.class;
                    }

                    // Modifying args array is ugly but runs faster than other solutions
                    args[0] = tag;
                    args[1] = attrs2;
                    currElem = createElement(...args);
                } else {
                    const args2 = [tag, attrs2];

                    for (let i = 1; i < args.length; ++i) {
                        args2.push(args[i]);                    
                    }

                    currElem = createElement(...args2);

                    /*                    
                    args[0] = tag;
                    args.push(null);
                    const length = args.length;
                    for (let i = 1; i < args.length; ++i) {
                        args[length - i] = args[length - i - 1]; 
                    }
                    args[1] = attrs2;
                    
                    currElem = createElement(...args);
                    */
                }
            }
        } 

        return currElem;
    }
}