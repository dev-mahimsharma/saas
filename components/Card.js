export default function Card({ children, className = "", as: Tag = "div" }) {
  return (
    <Tag
      className={`rounded-2xl border border-slate-200/80 bg-white shadow-sm ${className}`}
    >
      {children}
    </Tag>
  );
}
