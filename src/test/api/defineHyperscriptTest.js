import { describe, it } from 'mocha';
import { expect } from 'chai';

import defineHyperscript from '../../main/api/defineHyperscript';

const h = defineHyperscript({
    isElemet: it => it && typeof it === 'object' && it.type,

    createElement(type, attrs = null, ...children) {
        return {
            type,
            attrs,
            children
        };
    }
}); 

describe('defineHyperscript', () => {
    it('should generate proper nodes', () => {
        expect(h('div#my-id.my-class', 'some-content'))
            .to.deep.eql({
                type: 'div',
                attrs: {
                    class: 'my-class',
                    id: 'my-id'
                },
                children: ['some-content']
            });
    });
});
