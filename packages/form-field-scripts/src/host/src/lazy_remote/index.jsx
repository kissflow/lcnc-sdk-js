import React, { useMemo, Suspense, lazy } from "react";
import PropTypes from "kf-proptypes/widgets";

import { MF_REMOTE_ERRORS } from "./constants.js";
import { getRemoteModule } from "./helpers.js";
import { SystemErrorBoundary } from "./system.error.boundary.jsx";

const defaultBridge = (Component) => {
  return (props) => {
    return <Component {...props} />;
  };
};

export function System(props) {
  const {
    remoteUrl,
    componentName,
    fallbacks,
    props: childProps,
    bridge = defaultBridge
  } = props;

  const Component = useMemo(
    function getComponent() {
      const Component = lazy(() => {
        const hideCustomComponent = localStorage.getItem("hideCustomComponent");

        if (hideCustomComponent) {
          return Promise.reject({
            perceivedError: MF_REMOTE_ERRORS.HIDE_CUSTOM_COMPONENT.code,
            actualErrorObject: {}
          });
        }

        return getRemoteModule({ remoteUrl, moduleName: componentName });
      });
      return bridge(Component);
    },
    [componentName, remoteUrl, bridge]
  );

  return (
    <SystemErrorBoundary fallbacks={fallbacks}>
      <Suspense>
        <Component {...childProps} />
      </Suspense>
    </SystemErrorBoundary>
  );
}

System.propTypes = {
  remoteUrl: PropTypes.string,
  componentName: PropTypes.string,
  fallbacks: PropTypes.shape({}),
  props: PropTypes.shape({}),
  bridge: PropTypes.func
};
