import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    if (location.pathname === path) {
      navigate("/");
    } else {
      navigate(path);
    }
  };

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Koko</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNavigation("/settings")}
              className={`
              btn btn-sm gap-2 transition-colors
              ${location.pathname === "/settings" ? "btn-primary" : "btn-ghost"}
              `}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </button>

            {authUser && (
              <>
                <button
                  onClick={() => handleNavigation("/profile")}
                  className={`
                  btn btn-sm gap-2 transition-colors
                  ${location.pathname === "/profile" ? "btn-primary" : "btn-ghost"}
                  `}
                >
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </button>

                <button
                  className="btn btn-sm btn-ghost flex gap-2 items-center text-error hover:bg-error/10"
                  onClick={logout}
                >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
