import { AuthProvider } from "./context/authcontext";
import { AdminAuthProvider } from "./context/adminAuthContext";
import AppRouter from "./router/approuter";

function App() {
  return (
    <AdminAuthProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </AdminAuthProvider>
  );
}

export default App;
