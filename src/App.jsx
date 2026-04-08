import { Route, Routes } from "react-router-dom";
import SiteLayout from "./components/SiteLayout";
import HomePage from "./pages/HomePage";
import StoreDetailPage from "./pages/StoreDetailPage";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/stores/:storeRef" element={<StoreDetailPage />} />
      </Route>
    </Routes>
  );
}
