import { Route, Routes } from "react-router-dom";
import SiteLayout from "./components/SiteLayout";
import HomePage from "./pages/HomePage";
import StoresPage from "./pages/StoresPage";
import StoreDetailPage from "./pages/StoreDetailPage";
import WhyThriftingMattersPage from "./pages/WhyThriftingMattersPage";
import MapPage from "./pages/MapPage";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/stores" element={<StoresPage />} />
        <Route path="/stores/:storeRef" element={<StoreDetailPage />} />
        <Route path="/why-thrifting-matters" element={<WhyThriftingMattersPage />} />
      </Route>
    </Routes>
  );
}
