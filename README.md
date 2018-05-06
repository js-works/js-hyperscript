# js-hyperscript
*js-hyperscript* provides a helper function to simplfy the creation of virtual UI trees nodes.<br>
It's a pure JavaScript alterative to JSX.<br>
Many thanks to the teams of "hyperscript", "react-hyperscript",
"hiccup" and "reagent" for the inspiration.

Currently adapters for the following UI libraries are available:

- React
- DIO
- js-surface

Moreover, *js-hyperscript* also provides two other adapters
called "common" and "univeral" which generates library independent
virutal UI elements (which is only useful in very special
cases where you need your own UI component tree, independent of any other UI library):

#### universal
```javascript
{
    type: ....,
    props: { ... },  // or null
    children: [...], // or null
    isElement: true  // always true
}
```
### Project installation and build

```
git clone https://github.com/js-works/js-hyperscript.git
cd js-hyperscript
npm install
npm run all
```

### Using *js-hyperscript* in your own projects

```
npm install --save js-hyperscript
```

## Usage

The easiest way to show the usage of the *hyperscript* function,
is to provide some examples - here they are:

### Importing js-hyperscript

```javascript
// If you want to use js-hyperscript for React or React Native
import h from 'js-hyperscript/react';

// If you want to use js-hyperscript for DIO 
import h from 'js-hyperscript/dio';

// If you want to use js-hyperscript to generate universal UI elements
import h from 'js-hyperscript/universal';
```

### Using the original syntax of React's createElement

```javascript
const content =
    h('div', { id: 'container', className: 'box' },
        h('div', null,
            h('button', null, 'Some button')),
        h('div', null,
            h('button', null, 'Some other button')));
```

### Hyperscript shortcut for "id" and "className" props

```javascript
const content =
    h('div#container.box', null,
        h('div', null,
            h('button', null, 'Some button')),
        h('div', null,
            h('button', null, 'Some other button')));
```
### Props as second arguments are optional 

```javascript
const content =
    h('div#container.box',
        h('div',
            h('button', 'Some button')),
        h('div',
            h('button', 'Some other button')));
```
### Simple nesting (for DOM elements with exactly one child) can be simplified

```javascript
    h('div#container.box',
        h('div > button', 'Some button'),
        h('div > button', 'Some other button')));
```

### "div" elements that have a className or an id can also be simplified by leaving the word "div" out and start directly with "#" (for id) or "." (for className)

```javascript
    h('#container.box',
        h('div > button', 'Some button'),
        h('div > button', 'Some other button')));
```

### Plese compare the following HTML snippet with its *js-hyperscript* counterpart

```html
<div className="box">
    <ul className="link-link">
        <li className="primary">
            <a className="link" href="https://www.facebook.com">Facebook</a>
        </li>
        <li className="secondary">
            <a className="link" href="https://www.google.com">Google</a>        
        </li>
    </ul>
</div>
```

```javascript
h('.box > ul.link-list'
    h('li.primary > a.link', { href: 'https://www.facebook.com' }, 'Facebook'),
    h('li.secondary > a.link', { href: 'https://www.google.com' }, 'Google'));
```
## Important note

The main goal of *js-hyperscript* is to be as fast as possible.
Therefore it is necessary that the parsing results of all hyperscript expressions like ```'div#my-id.my-class'``` are cached so that they only have to be parsed once.
Please keep that in mind.

## Project status

The project is in alpha - don't use it yet.
