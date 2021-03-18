import Link from "next/link";
export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: "Sign In ", href: "/auth/signin" },
    !currentUser && { label: "Sign up", href: "/auth/signup" },
    currentUser && { label: "Sign Out", href: "auth/signout" },
  ]
    .filter((labelConfig) => labelConfig)
    .map(({ label, href }) => {
      return (
        <li className="nav-item" key={href}>
          <Link href={href}>
            <a className="nav-link"> {label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">GetTix</a>
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};
