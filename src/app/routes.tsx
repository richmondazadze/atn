import { createBrowserRouter } from "react-router";

// Public & Auth pages
import PublicHome from "./pages/public/Home";
import Browse from "./pages/public/Browse";
import ListingDetailPublic from "./pages/public/ListingDetail";
import ProviderProfile from "./pages/public/ProviderProfile";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import ResetPassword from "./pages/auth/ResetPassword";
import Privacy from "./pages/public/Privacy";
import Terms from "./pages/public/Terms";
import HowItWorks from "./pages/public/HowItWorks";
import WomenRiseInitiative from "./pages/public/WomenRiseInitiative";
import WifiHubsPublicPage from "./pages/public/WifiHubs";

// Customer pages
import CustomerHome from "./pages/customer/Home";
import Search from "./pages/customer/Search";
import ListingDetail from "./pages/customer/ListingDetail";
import MyBookings from "./pages/customer/MyBookings";
import Favorites from "./pages/customer/Favorites";
import CustomerHelp from "./pages/customer/Help";
import CustomerSettings from "./pages/customer/Settings";
import WifiHubsCustomerPage from "./pages/customer/WifiHubs";

// Provider pages
import ProviderDashboard from "./pages/provider/Dashboard";
import ProfileEditor from "./pages/provider/ProfileEditor";
import ListingsManager from "./pages/provider/ListingsManager";
import CreateListing from "./pages/provider/CreateListing";
import EditListing from "./pages/provider/EditListing";
import Availability from "./pages/provider/Availability";
import BookingInbox from "./pages/provider/BookingInbox";
import ReviewsReceived from "./pages/provider/ReviewsReceived";
import AICoach from "./pages/provider/AICoach";
import Payouts from "./pages/provider/Payouts";
import ProviderSettings from "./pages/provider/Settings";
import ProviderOnboarding from "./pages/provider/Onboarding";
import ProviderHelp from "./pages/provider/Help";
import WifiHubsProviderPage from "./pages/provider/WifiHubs";

// Admin pages
import AdminOverview from "./pages/admin/Overview";
import ProvidersTable from "./pages/admin/Providers";
import ListingsModeration from "./pages/admin/Listings";
import DisputesPage from "./pages/admin/Disputes";
import FeaturedManager from "./pages/admin/Featured";
import CategoriesManager from "./pages/admin/Categories";
import ResourcesCMS from "./pages/admin/Resources";
import Analytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/Settings";
import WifiHubsAdmin from "./pages/admin/WifiHubs";

// Design System pages
import Foundations from "./pages/design/Foundations";
import Components from "./pages/design/Components";
import States from "./pages/design/States";

import NotFound from "./pages/NotFound";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import CustomerLayout from "./layouts/CustomerLayout";
import ProviderLayout from "./layouts/ProviderLayout";
import AdminLayout from "./layouts/AdminLayout";

export const router = createBrowserRouter([
  // Design System
  { path: "/00-foundations", element: <Foundations /> },
  { path: "/01-components", element: <Components /> },
  { path: "/06-states", element: <States /> },
  
  // Public routes
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <PublicHome /> },
      { path: "browse", element: <Browse /> },
      { path: "listing/:id", element: <ListingDetailPublic /> },
      { path: "provider/:id", element: <ProviderProfile /> },
      { path: "how-it-works", element: <HowItWorks /> },
      { path: "women-rise-initiative", element: <WomenRiseInitiative /> },
      { path: "wifi-hubs", element: <WifiHubsPublicPage /> },
      { path: "privacy", element: <Privacy /> },
      { path: "terms", element: <Terms /> },
    ],
  },
  
  // Auth routes
  { path: "/signup", element: <SignUp /> },
  { path: "/login", element: <Login /> },
  { path: "/reset-password", element: <ResetPassword /> },
  
  // Customer routes
  {
    path: "/customer",
    element: <CustomerLayout />,
    children: [
      { index: true, element: <CustomerHome /> },
      { path: "search", element: <Search /> },
      { path: "listing/:id", element: <ListingDetail /> },
      { path: "bookings", element: <MyBookings /> },
      { path: "favorites", element: <Favorites /> },
      { path: "wifi-hubs", element: <WifiHubsCustomerPage /> },
      { path: "help", element: <CustomerHelp /> },
      { path: "settings", element: <CustomerSettings /> },
    ],
  },
  
  // Provider routes
  {
    path: "/provider",
    element: <ProviderLayout />,
    children: [
      { index: true, element: <ProviderDashboard /> },
      { path: "onboarding", element: <ProviderOnboarding /> },
      { path: "profile", element: <ProfileEditor /> },
      { path: "listings", element: <ListingsManager /> },
      { path: "listings/new", element: <CreateListing /> },
      { path: "listings/:id/edit", element: <EditListing /> },
      { path: "availability", element: <Availability /> },
      { path: "bookings", element: <BookingInbox /> },
      { path: "wifi-hubs", element: <WifiHubsProviderPage /> },
      { path: "reviews", element: <ReviewsReceived /> },
      { path: "ai-coach", element: <AICoach /> },
      { path: "payouts", element: <Payouts /> },
      { path: "help", element: <ProviderHelp /> },
      { path: "settings", element: <ProviderSettings /> },
    ],
  },
  
  // Admin routes
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminOverview /> },
      { path: "providers", element: <ProvidersTable /> },
      { path: "listings", element: <ListingsModeration /> },
      { path: "disputes", element: <DisputesPage /> },
      { path: "featured", element: <FeaturedManager /> },
      { path: "categories", element: <CategoriesManager /> },
      { path: "resources", element: <ResourcesCMS /> },
      { path: "wifi-hubs", element: <WifiHubsAdmin /> },
      { path: "analytics", element: <Analytics /> },
      { path: "settings", element: <AdminSettings /> },
    ],
  },

  // Catch-all 404
  { path: "*", element: <NotFound /> },
]);
