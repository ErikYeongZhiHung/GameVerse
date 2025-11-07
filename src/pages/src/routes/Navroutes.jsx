import Home from "../pages/homePege/Home";
import EpicSignIn from "../pages/SignInPage/EpicSignIn";
import NavLayout from "../layout/Navlayout";
import GameDetailSection from "../pages/GameDetailpage";
import CartPage from "../pages/CartPage";
import Signup from "../pages/signupPage/Signup";
import UploadGame from "../components/UploadGame";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import ProtectedRoute from "./ProtectedRoutes";
import EmailCheck from "../pages/EmailCheck";
import VerifyEmail from "../pages/VerifyEmail";

const NavRoutes = [
  {
    path: "/",
    element: (
      <NavLayout>
        <Home />
      </NavLayout>
    ),
  },
  {
    path: "/detials",
    element: (
      <NavLayout>
        <GameDetailSection />
      </NavLayout>
    ),
  },
  {
    path: "/cart",
    element: (
      <ProtectedRoute role="user">
        <NavLayout>
          <CartPage />
        </NavLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute role="user">
        <NavLayout>
          <ProfilePage />
        </NavLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/upload",
    element: (
      <ProtectedRoute role="developer">
        <NavLayout>
          <UploadGame />
        </NavLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/signin",
    element: <EpicSignIn />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/check-email",
    element: (
      <NavLayout>
        <EmailCheck />,
      </NavLayout>
    ),
  },
  {
    path: "/verify-email",
    element: (
      <NavLayout>
        <VerifyEmail />
      </NavLayout>
    ),
  },
];

export default NavRoutes;