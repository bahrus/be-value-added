# be-value-added

[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-value-added?style=for-the-badge)](https://bundlephobia.com/result?p=be-value-added)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-value-added?compression=gzip">
[![NPM version](https://badge.fury.io/js/be-value-added.png)](http://badge.fury.io/js/be-value-added)

The [output element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output) provides an example of a built-in element that "outputs" its value.  It's a bit of a strange creature, given that it displays the exact value passed in, but the "value-add" proposition the output element provides may be a bit esoteric (a11y related).

Anyway, the model / precedent that the output element provides seems quite useful, when applied to elements that may do a bit more than simply display the value.  In particular, elements that format the value, based on Intl.* settings, or elements that reflect values to metadata attributes (meta, link tags).

This package contains a base class that helps implement such features in userland using custom [enhancements](https://github.com/bahrus).  This package  provides end-user capabilities in it own right.

Note that this does *not* add or modify the value property onto the enhanced element (top level).  It just provides a uniform interface for multiple enhancements, all of which need to:

1.  Be able to be passed a value
2.  Reflect that value in some way to an attribute and/or text content of the element.
3.  Optionally be able to observe the attribute for modifications from other sources, and sync that back up with the value.

