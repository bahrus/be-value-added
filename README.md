# be-value-added

[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-value-added?style=for-the-badge)](https://bundlephobia.com/result?p=be-value-added)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-value-added?compression=gzip">
[![NPM version](https://badge.fury.io/js/be-value-added.png)](http://badge.fury.io/js/be-value-added)

The [output element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output) provides an example of a built-in element that "outputs" its value.  It's a bit of a strange creature, given that it displays the exact value passed in, but the "value-add" proposition the output element provides may be a bit esoteric (a11y related).

## HTML signals

Anyway, the model / precedent that the output element provides seems quite useful, when applied to elements that may do a bit more than simply display the value.  In particular, elements that format the value, based on Intl.* settings, or elements that reflect values to metadata attributes (meta, link tags).

```html
<time id=time  be-value-added></time>
<data id=data  be-value-added></data>
<meta id=meta  be-value-added>
<link id=link  be-value-added>
```

This package contains a base class that helps implement such features in userland using custom [enhancements](https://github.com/bahrus).  This package  also provides end-user capabilities in its own right.

Note that this does *not* add or modify the value property onto the enhanced element (top level).  It just provides a uniform interface for multiple enhancements, all of which need to:

1.  Be able to be passed a value
2.  Reflect that value in some way to an attribute and/or text content of the element.
3.  Optionally be able to observe the attribute (or text content -- todo) for modifications from other sources, and sync that back up with the value.

## Computed itemprops [TODO]

```html
<link itemprop=prop1  be-value-added='
    Negate to prop2.
    Negate to prop2 after 40 ms.
    Toggle to prop2.
    Toggle to prop2 after 40 ms.
    Echo to prop2.
    Echo to prop2 after 40 ms.
    Reflect to host attr.
    Reflect to host custom state.
    Parse to prop2 as number.
    Parse to prop2 as date.
    Parse to prop2 as object.
    Dispatch.
    Clone to prop2.
    Increment to prop2.
' itemtype=https://schema.org/Boolean href=https://schema.org/True>
```

generates:

```html
<link itemprop=prop1  be-value-added='{
    "negateTo": "prop2"
}' itemtype=https://schema.org/Boolean href=https://schema.org/True>
<link itemprop=prop2 itemtype=https://schema.org/Boolean href=https://schema.org/False>
```

Other actions:

| Action     | What it does                      |
|------------|-----------------------------------|
| toggleTo   | toggles peer itemprop to opposite |
| dispatch   | fires event from host             |

etc (copied from xtal-element/types.d.ts)

## Running locally

Any web server that can serve static files will do, but...

1.  Install git.
2.  Do a git clone or a git fork of repository https://github.com/bahrus/be-value-added
3.  Install node.js
4.  Open command window to folder where you cloned this repo.
5.  > npm install
6.  > npm run serve
7.  Open http://localhost:3030/demo in a modern browser.

## Using from ESM Module:

```JavaScript
import 'be-value-added/be-value-added.js';
```

## Using from CDN:

```html
<script type=module crossorigin=anonymous>
    import 'https://esm.run/be-value-added';
</script>
```


