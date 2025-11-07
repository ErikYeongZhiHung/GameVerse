import NavLayout from "../Layout/Navlayout";
import DashboardPage from "../pages/DashboardPage";
import OrdersPage from "../pages/OrdersPage";
import LoginPage from "../pages/LoginPage";
import Controller from "../pages/Controller";
import ProductDetails from "../pages/ProductDetails";
import User from "../pages/User";
import ProtectedRoutes from "./ProtectedRoutes";
// Only wrap with NavLayout where you want the sidebar
const NavRoutes = [
  // {
  //   path: "/login",
  //   element: <LoginPage />,
  // },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoutes>
        <NavLayout>
          <DashboardPage />
        </NavLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/orders",
    element: (
      <ProtectedRoutes>
        <NavLayout>
          <OrdersPage />
        </NavLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/control-panel",
    element: (
      <ProtectedRoutes>
        <NavLayout>
          <Controller />
        </NavLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/product/:id",
    element: (
      <ProtectedRoutes>
        <NavLayout>
          <ProductDetails />
        </NavLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/users",
    element: (
      <NavLayout>
        <User />
      </NavLayout>
    ),
  },

  // Redirect route to login
  {
    path: "/",
    element: <LoginPage />,
  },
];

export default NavRoutes;
