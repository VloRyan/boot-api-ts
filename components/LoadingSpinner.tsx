import { Spinner } from "react-bootstrap";

export const LoadingSpinner = ({ size }: { size?: "sm" }) => (
  <div className="container d-flex justify-content-center">
    <Spinner size={size} animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
);
