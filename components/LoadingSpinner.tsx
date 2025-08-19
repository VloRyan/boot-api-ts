import { Container, Spinner } from "react-bootstrap";
import { SpinnerProps } from "react-bootstrap/Spinner";

export interface LoadingSpinnerProps extends SpinnerProps {
  centered?: boolean;
}
export const LoadingSpinner = (props: LoadingSpinnerProps) => {
  const spinner = (
    <Spinner {...props}>
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
  if (props.centered === false) {
    return spinner;
  }
  return (
    <Container className="d-flex justify-content-center">{spinner}</Container>
  );
};
