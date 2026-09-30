// Badges.jsx: reusable status, priority and technician badges
const PRIORITY = { low: "gray", medium: "blue", high: "orange", urgent: "red" };
const STATUS = {
  open: "blue",
  new: "blue",
  scheduled: "purple",
  in_progress: "amber",
  completed: "green",
  cancelled: "gray",
};

const label = (v = "") =>
  v.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

export function Badge({ tone = "gray", children }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export const PriorityBadge = ({ value }) => (
  <Badge tone={PRIORITY[value?.toLowerCase()] || "gray"}>{label(value)}</Badge>
);

export const StatusBadge = ({ value }) => (
  <Badge tone={STATUS[value?.toLowerCase()] || "gray"}>{label(value)}</Badge>
);

export const TechnicianBadge = ({ name, onAssign }) =>
  name && name !== "-" ? (
    <span className="tech">
      <span className="avatar sm">{name[0]}</span>
      {name}
    </span>
  ) : onAssign ? (
    <button className="badge badge-amber badge-btn" onClick={onAssign}>
      Assign
    </button>
  ) : (
    <Badge tone="amber">Unassigned</Badge>
  );