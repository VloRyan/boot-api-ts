import { PropsWithChildren, useEffect, useState } from "react";
import { ErrorPage } from "../pages/";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ErrorBoundary({ children }: PropsWithChildren<any>) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      console.error("ErrorBoundary caught an error: ", event.error);
      setHasError(true);
    };

    // Assign the error handler
    window.addEventListener("error", errorHandler);

    // Cleanup function
    return () => {
      window.removeEventListener("error", errorHandler);
    };
  }, []);

  if (hasError) {
    return <ErrorPage error={new Error("Something went wrong.")} />;
  }

  // Render children components as usual
  return children;
}
