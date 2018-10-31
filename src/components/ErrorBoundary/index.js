import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    componentDidCatch(error, info) {
      // Display fallback UI
      this.setState({ hasError: true });
      // You can also log the error to an error reporting service
      // logErrorToMyService(error, info);
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <div>Something went wrong.</div>;
      }
      return this.props.children;
    }
}

export const wrapBoundary = (WrappedComponent) => {
  class HOC extends React.Component {
    render() {
      return (<ErrorBoundary>
        <WrappedComponent {...this.props} />
      </ErrorBoundary>);
    }
  }
  return HOC;
};


export default ErrorBoundary;
