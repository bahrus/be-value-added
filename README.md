# be-value-added

The output element provides an example of a built-in element that "outputs" its value.  It's a bit of a strange feature, given that it displays the exact value passed in, but the "value-add" proposition the output element provides may be bit esoteric (a11y related).

Anyway, the model / precedent that the output element provides seems quite useful, when applied to elements that may do a bit more than simply display the value.  In particular, elements that format the value, based on Intl.* settings.

This package contains a base class that helps implement such features in userland using custom enhancements.  It isn't currently planned to provide any end-user capabilities, but that is subject to change.