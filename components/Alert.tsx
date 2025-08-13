import { useEffect } from "react";
import { Alert, Button } from "react-bootstrap";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Variant } from "react-bootstrap/types";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export class AlertProps {
  title?: string;
  detail?: string;
  variant?: Variant;
  icon?: IconProp;
  timeout? = 0;
  handleDismiss?: () => void = undefined;

  constructor(title: string = "", detail: string = "") {
    this.title = title;
    this.detail = detail;
    this.icon = faTriangleExclamation;
  }
}

export function CloseableAlert({
  title,
  detail,
  variant,
  icon,
  timeout,
  handleDismiss,
}: AlertProps) {
  useEffect(() => {
    if (timeout && timeout > 0 && handleDismiss) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, timeout);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Alert
      className="align-items-center fade show"
      role="alert"
      variant={variant}
      onClose={handleDismiss}
      dismissible
    >
      <h4 className="alert-heading">
        {icon && <FontAwesomeIcon icon={icon} className="me-2" />}
        {title}
      </h4>
      <div>{detail}</div>
      <Button
        type="button"
        className="btn-close"
        onClick={handleDismiss}
        aria-label="Close"
      />
    </Alert>
  );
}
