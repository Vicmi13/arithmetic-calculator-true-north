import { useState } from "react";
import { Routes, Route, Navigate } from "react-router";
import CustomizedSnackbars from "./components/CustomSnackBar";
import Dashboard from "./components/Dashboard";
import LoginForm from "./components/login/LoginForm";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const [isUserLogged, setisUserLogged] = useState(false);

  return (
    <div className="App">
      <Routes>
        <Route index element={<Navigate replace to="/login" />} />
        <Route
          path="login"
          element={
            <LoginForm
              userLogged={isUserLogged}
              setisUserLogged={setisUserLogged}
            />
          }
        />

        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<h1> Page not found 404 </h1>} />
      </Routes>
      <CustomizedSnackbars />
    </div>
  );
};

export default App;
