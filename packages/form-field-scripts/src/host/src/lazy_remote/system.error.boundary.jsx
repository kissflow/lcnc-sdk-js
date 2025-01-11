import React from "react";
import PropTypes from "kf-proptypes/widgets";
import { Trans } from "@lingui/macro";

import { MF_REMOTE_ERRORS } from "./constants.js";

// An error boundary component to be used with the System component, that loads custom component from a remote...

class SystemErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    const { error, hasError } = this.state;
    const { fallbacks } = this.props;

    if (hasError) {
      const { perceivedError } = error;

      // Errors that can be encounted while loading a module...
      // Note that errors that doesn't have perceivedError key are errors that occur after the module has
      // been loaded by module federation...
      if (perceivedError === MF_REMOTE_ERRORS.REMOTE_DOWN.code) {
        return (
          <div>
            <Trans>Remote is down</Trans>
          </div>
        );
      } else if (perceivedError === MF_REMOTE_ERRORS.CORRUPT_REMOTE.code) {
        return (
          <div>
            <Trans>The remote is corrupt</Trans>
          </div>
        );
      } else if (perceivedError === MF_REMOTE_ERRORS.MODULE_NOT_FOUND.code) {
        if (fallbacks?.ifModuleNotFound) {
          const { ifModuleNotFound: IfModuleNotFound } = fallbacks;
          return <IfModuleNotFound />;
        } else {
          return (
            <div>
              <Trans>Module not found</Trans>
            </div>
          );
        }
      } else if (
        perceivedError === MF_REMOTE_ERRORS.HIDE_CUSTOM_COMPONENT.code
      ) {
        return (
          <div>
            <Trans>Custom form field not loaded for debugging purposes</Trans>
          </div>
        );
      } else {
        // Errors that occur inside the component after it has been loaded...
        return (
          <div>
            <Trans>Error while rendering the remote component</Trans>
          </div>
        );
      }
    }

    return this.props.children;
  }
}

SystemErrorBoundary.propTypes = {
  children: PropTypes.node,
  fallbacks: PropTypes.shape({
    ifModuleNotFound: PropTypes.node
  })
};

export { SystemErrorBoundary };
