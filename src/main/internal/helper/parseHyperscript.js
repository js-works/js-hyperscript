const
    tagPattern = '^[a-zA-Z][a-zA-Z0-9_-]*',
    idPattern = '#[a-zA-Z][a-zA-Z0-9_-]*',
    classPattern = '\\.[a-zA-Z][a-zA-Z0-9_-]*',
    attrValuePattern = '([a-zA-Z0-9_-]*|"[^">\\\\]*"|\'[^\'>\\\\]*\')',
    attrPattern =  `\\[[a-z][a-zA-Z-]*(=${attrValuePattern})?\\]`,
    elementPattern = `(${tagPattern}|${idPattern}|${classPattern}|${attrPattern})`,
    elementRegex = new RegExp(elementPattern, 'g'),

    forbiddenAttributes = new Set(
        ['id', 'class', 'className', 'innerHTML', 'dangerouslySetInnerHTML']);

export default function parseHyperscript(
    hyperscript,
    classAttributeName = 'className',
    attributeAliases = null,
    attributeAliasesByTagName = null) {

    const items =
        hyperscript
            .split(/\s*>\s*/)
            .map(tag => tokenize(tag, elementRegex));

    let ret = [];

    for (let i = 0; i < items.length; ++i) {
        const item = items[i];

        if (item === null) {
            ret = null;
            break;
        }

        let meta = {
            tag: 'div', // div is default if no tag is given
            props: null,
        };

        ret.push(meta);

        for (let j = 0; j < item.length; ++j) {
            const it = item[j];
        
            switch (it[0]) {
            case '#': {
                if (meta.props && meta.props.id) {
                    ret = null;
                    break;
                }

                meta.props = meta.props || {};
                meta.props.id = it.substr(1);
                
                break;
            }
            case '.': {
                const oneClass = it.substr(1);
                
                if (!meta.props || !meta.props[classAttributeName]) {
                    meta.props = meta.props || {};
                    meta.props[classAttributeName] = oneClass;
                } else {
                    meta.props[classAttributeName] += ` ${oneClass}`;
                }

                break;
            }
            case '[': {
                let
                    [key, ...tokens] = it.substr(1, it.length - 2).split('='),
                    value = tokens ? tokens.join('=') : true;

                if (forbiddenAttributes.has(key)
                    || key === classAttributeName) {

                    ret = null;
                    break;
                }

                if (value[0] === '"' || value[0] === "'") {
                    value = value.substr(1, value.length - 2);
                }

                if (meta.props === null) {
                    meta.props = {};
                }

                if (attributeAliases) {
                    key = attributeAliases[key] || key;
                }

                if (attributeAliasesByTagName) {
                    const aliases = attributeAliasesByTagName[meta.tag];

                    if (aliases) {
                        key = aliases[key] || key;
                    }
                }

                if (meta.props[key] === undefined) {
                    meta.props[key] = value;
                } else {
                    ret = null;
                }
            
                break;
            }
            default: 
                meta.tag = it;
            }

            if (ret === null) {
                break;
            }
        }

        if (meta) {
            meta.entries =
                meta.props
                    ? Object.entries(meta.props)
                    : [];

            meta.hasEntries = meta.entries.length > 0,
            meta.id = meta.hasEntries ? meta.props.id || null : null;
            meta.className = meta.hasEntries ? meta.props.className || null : null,
            meta.others = meta.entries.filter(entry => entry[0] !== 'id' && entry[0] !== 'className');

            if (meta.others.length === 0) {
                meta.others = null;
            }
        }

        if (ret === null) {
            break;
        }    
    }

    if (ret !== null && ret.length === 0) {
        ret = null;
    }

    return ret;
}


function tokenize(str, regex) {
    let ret = null;
  
    if (str !== '') {
        const arr = [];
  
        const rest = str.replace(regex, key => {
            arr.push(key);
      
            return '';  
        });

        if (rest === '') {
            ret = arr;
        }
    }
  
    return ret;
}