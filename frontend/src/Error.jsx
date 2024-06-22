import { Link, useRouteError } from "react-router-dom";

const Error = () => {
  const error = useRouteError();
  return (
    <div
      className="d-flex flex-column w-100 justify-content-center align-items-center gap-y-4 "
      style={{ height: "100vh" }}
    >
      {error.status == 401 && (
        <div className="fs-1 fw-semibold">
          You aren't authorized to see this
        </div>
      )}
      {error.status == 403 && <h1>403: Forbidden</h1>}
      {error.status == 404 && (
        <div className="display-1 fw-semibold">404: Page Not Found</div>
      )}
      {error.message}
      <Link to="/" className="text-blue-700 fs-3">
        Go back
      </Link>
    </div>
  );
};

export default Error;
