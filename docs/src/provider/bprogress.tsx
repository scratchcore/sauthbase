"use client";

import { ProgressProvider } from "@bprogress/next/app";

const BprogressProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProgressProvider
      color="#3b82f6"
      height="3px"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
};

export default BprogressProviders;
