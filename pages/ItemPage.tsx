import { LoadingSpinner, Toolbar, ToolbarProps } from "../components/";
import { useAlert } from "../hooks/";
import { PropsWithChildren, useEffect } from "react";

export interface ItemPageProps {
  error?: Error | null;
  isLoading?: boolean;
  formId?: string;
  toolBar?: ToolbarProps;
}

export const ItemPage = ({
  error,
  isLoading,
  formId,
  toolBar,
  children,
}: PropsWithChildren<ItemPageProps>) => {
  const { addApiErrorAlerts } = useAlert();
  useEffect(() => {
    if (error) {
      addApiErrorAlerts(error);
    }
  }, [error]);
  if (error && !isLoading) {
    return <Toolbar />;
  }
  if (isLoading) {
    return (
      <>
        <Toolbar />
        <LoadingSpinner />
      </>
    );
  }
  const toolbar = toolBar ? (
    <Toolbar {...toolBar} />
  ) : (
    <Toolbar saveButton={{ name: "save", form: formId }}></Toolbar>
  );
  return (
    <>
      {toolbar}
      {children}
    </>
  );
};
