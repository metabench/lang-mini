# Control_DOM

The `Control_DOM` class is a base class for controls that are represented in the DOM (Document Object Model). It extends the `Evented_Class` class, and it provides a `constructor` method that sets up a `dom_attributes` object and a `Proxy` object that wraps the `dom_attributes` object.

This class is used internally by the `Control` class, and it is not intended to be used directly. When you create a `Control` object, the `Control_DOM` class is instantiated automatically, and you do not need to create an instance of this class yourself.

## Properties

- `attrs`: Short for attributes
- `attributes`: The DOM attributes of the Control

## Example

Here is an example of how you might use the `Control_DOM` class indirectly through the `Control` class:

```
const Control = require('control');

class MyControl extends Control {
  constructor() {
    super();
    this.dom.attributes.style = 'color: red; font-size: 14px;';
  }
}

const myControl = new MyControl();
```

In this example, the `MyControl` class extends the `Control` class, and it sets the `style` attribute of the control in the constructor by accessing the `dom.attributes.style` property. The `Control` class internally uses the `Control_DOM` class to manage the attributes of the control in the DOM.