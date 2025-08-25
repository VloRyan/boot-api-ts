import { Badge, BadgeProps } from "react-bootstrap";

export type StatusType = "default" | "ok" | "warning" | "error" | "inactive";
export interface StatusBadgeProps extends Omit<BadgeProps, "bg"> {
  variant?: StatusType;
}
interface StatusBadgeVariant {
  bg: string;
  caption: string;
}

type StatusBadgeVariantsType = {
  [key in StatusType]: StatusBadgeVariant;
};

const StatusBadgeVariants: StatusBadgeVariantsType = {
  default: { bg: "primary", caption: "Default" },
  ok: { bg: "success", caption: "Ok" },
  warning: { bg: "warning", caption: "Warning" },
  error: { bg: "danger", caption: "Error" },
  inactive: { bg: "secondary", caption: "Inactive" },
};

export const StatusBadge = (props: StatusBadgeProps) => {
  const { variant, children, ...badgeProps } = props;
  if (badgeProps.pill === undefined) {
    badgeProps.pill = true;
  }
  const v = StatusBadgeVariants[variant ?? "default"];
  return (
    <Badge bg={v.bg} {...badgeProps}>
      {children ?? v.caption}
    </Badge>
  );
};
