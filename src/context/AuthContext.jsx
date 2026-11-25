
import {
  createContext,
  useContext,
  useState
} from "react";

const AuthContext = createContext(null);

function readUser() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && user.id && user.role ? user : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);

  function login(userData) {
    const session = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      doctorId: userData.doctorId || null
    };

    localStorage.setItem("user", JSON.stringify(session));
    setUser(session);
  }

  function logout() {
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
