# Development

## Editor plugins

- editorconfig
- eslint

### VSCode

Add settings:

```
"javascript.validate.enable": false
```

## Install dependencies

```
yarn
```

## Start develop

```
yarn start
```

## Guideline

### Enforce component methods order (react/sort-comp)

s/sort-comp.md

### ECMAScript This-Binding Syntax

https://github.com/tc39/proposal-bind-operator

Example: `this.signIn = ::this.signIn`

### Optional Chaining for JavaScript

https://github.com/tc39/proposal-optional-chaining

Example: `this.props.user?.status`

> Will add:

### ECMAScript Pattern Matching

https://github.com/tc39/proposal-pattern-matching

> //

### Example

```jsx
contructor(props) {
  super(props);
  this.routeRender = ::this.routeRender;
}
```

## Code Templates

```jsx
import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';

class NewComponent extends React.Component {
  static propTypes = {
    // children: PropTypes.any.isRequired,
  }

  // constructor(props) {
  //   super(props);
  //   // ...
  // }

  render() {
    return (
      <div></div>
    );
  }
}

// const mapState = (state) => {
//   const { auth } = state;
//   return { auth };
// };

export default NewComponent;

// export default connect(mapState)(NewComponent);

```
