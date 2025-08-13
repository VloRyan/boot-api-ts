import { Badge } from "react-bootstrap";

export type StatusType = "ok" | "warning" | "error" | "imported";
export const StatusBadge = ({ status }: { status: StatusType }) => {
  let bg, caption: string;
  switch (status) {
    case "ok":
      bg = "success";
      caption = "Ok";
      break;
    case "warning":
      bg = "warning";
      caption = "Warning";
      break;
    case "error":
      bg = "danger";
      caption = "Error";
      break;
    case "imported":
      bg = "secondary";
      caption = "Imported";
      break;
  }
  return (
    <Badge bg={bg} pill>
      {caption}
    </Badge>
  );
};
