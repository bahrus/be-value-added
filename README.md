# be-value-added

The output element provides an example of a built-in element that "outputs" its value.  It's a bit of a strange feature, given that it displays the exact value passed in, but the "value-add" proposition the output element provides may be a bit esoteric (a11y related).

Anyway, the model / precedent that the output element provides seems quite useful, when applied to elements that may do a bit more than simply display the value.  In particular, elements that format the value, based on Intl.* settings.

This package contains a base class that helps implement such features in userland using custom enhancements.  It isn't currently planned to provide any end-user capabilities, but that is subject to change.

Note that this does *not* add or modify the value property onto the enhanced element (top level).  It just provides a uniform interface for multiple enhancements, all of which need to:

1.  Be able to be passed a value
2.  Reflect that value in some way to an attribute and/or text content of the element.
3.  Optionally be able to observe the attribute for modifications from other sources, and sync that back up with the value.