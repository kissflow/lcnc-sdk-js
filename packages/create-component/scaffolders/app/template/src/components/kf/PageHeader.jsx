// Page title with a vibrant gradient accent + optional action buttons.
export function PageHeader({ title, accent, subtitle, children }) {
  return (
    <div className="kf kf-head">
      <div>
        <h1>
          {title} {accent && <span className="kf-accent">{accent}</span>}
        </h1>
        {subtitle && <p className="kf-sub">{subtitle}</p>}
      </div>
      {children && <div className="kf-head-actions">{children}</div>}
    </div>
  );
}
