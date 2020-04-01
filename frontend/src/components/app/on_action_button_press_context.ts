import React from 'react';

export const OnActionButtonPressContext = React.createContext<() => void>(
  () => {},
);
