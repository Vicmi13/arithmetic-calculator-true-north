import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsUserLogged } from "../features/auth/authSlice";
import Header from "./Header";

const ProtectedRoute = ({ redirectTo = "/login" }) => {
  const isUserLogged = useSelector(selectIsUserLogged);
  if (!isUserLogged) {
    return <Navigate to={redirectTo} replace />;
  }
  return <Header />;
};

export default ProtectedRoute;
