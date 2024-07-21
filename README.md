# be-value-added (📶)

(The name of that emoji is "antenna bars").


[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-value-added?style=for-the-badge)](https://bundlephobia.com/result?p=be-value-added)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-value-added?compression=gzip">
[![NPM version](https://badge.fury.io/js/be-value-added.png)](http://badge.fury.io/js/be-value-added)
[![Playwright Tests](https://github.com/bahrus/be-value-added/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-value-added/actions/workflows/CI.yml)

*be-value*added* is a [be-enhanced](https://github.com/bahrus/be-enhanced) based enhancement that enhances most built-in elements with a "value" property, which other enhancements use to provide formatting.  Adds two-way binding support between this "value" property and a key property of the enhanced element, in some cases.

The [output element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output) provides an example of a built-in element that "outputs" its value.  It's a bit of a strange creature, given that it displays the exact value passed in, but the "value-add" proposition the output element provides may be a bit esoteric (a11y related).

The "value" property this enhancement adds is accessible via oElement.beEnhanced.beValueAdded.value.

The elements be-value-added supports are many of the special elements used by microdata:

| Element        | Binding property/attribute         
|----------------|------------------------------------|
| a              | href/href                          |
| time           | datetime/dateTime                  |
| meta           | content/content                    |
| data           | value/value                        |


## HTML signals

Anyway, the model / precedent that the output element provides seems quite useful, when applied to elements that may do a bit more than simply display the value.  In particular, elements that format the value, based on Intl.* settings, or elements that reflect values to metadata attributes (meta, link tags).

```html
<time id=time  be-value-added></time>
<data id=data  be-value-added></data>
<meta id=meta  be-value-added>
<link id=link  be-value-added>
...

<script type=module>
    const {emc} = await import('be-value-added/behivior.js'));
    await time.whenResolved(emc).value = new Date();
    await data.whenResolved(emc).value = 13456789;
    await meta.whenResolved(emc).value = 'hello';
    await link.whenResolved(emc).value = true;
</script>
```

Where values are displayed (for the data and time tags above), the user will see the .toLocale... value.  To customize the international settings, use [https://github.com/bahrus/be-intl](be-intl) enhancement that enhances this enhancement.

This is the canonical name.  In less formal settings, where there is little chance of collision with other libraries, you can reference 📶.js instead and use the much shorter syntax:

```html
<time id=time  📶></time>
<data id=data  📶></data>
<meta id=meta  📶>
<link id=link  📶>
...

<script type=module>
    const {emc} = await import('be-value-added/📶.js'));
    await time.whenResolved(emc).value = new Date();
    await data.whenResolved(emc).value = 13456789;
    await meta.whenResolved(emc).value = 'hello';
    await link.whenResolved(emc).value = true;
</script>
```

This will display the date and number in locale string format, and the meta and link tags in a microdata compatible way.

This package contains a base class that helps implement such features in userland using custom [enhancements](https://github.com/bahrus/be-enhanced).  This package  also provide end-user capabilities in its own right.

Note that this does *not* add or modify the value property onto the enhanced element (top level).  It just provides a uniform interface for multiple enhancements, all of which need to:

1.  Be able to be passed a value
2.  Reflect that value in some way to an attribute and/or text content of the element.
3.  Optionally be able to observe the attribute (or text content -- todo) for modifications from other sources, and sync that back up with the value.

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

For just the enhancement without attribute support:

```JavaScript
import 'be-value-added/be-value-added.js';
```

For attribute/behivior support as well:

```JavaScript
import 'be-value-added/behivior.js';
```

## Using from CDN:

```html
<script type=module crossorigin=anonymous>
    import 'https://esm.run/be-value-added';
</script>
```


