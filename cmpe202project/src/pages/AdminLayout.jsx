import { Outlet, Link } from "react-router-dom";

const AdminLayout = () => {
  return (
    <>
      <nav>
        <ul
          style={{
            display: "flex",
            gap: "2rem",
            marginBottom: "4rem",
            justifySelf: "center",
            listStyleType: "none",
          }}
        >
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/signup">Signup</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  );
};

export default AdminLayout;
