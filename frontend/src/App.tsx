import { Routes, Route, BrowserRouter } from 'react-router-dom';
import HomePage from './pages/page';
import CategorySection from './components/CategorySection';
import CartPage from './pages/cart/page';
import RootLayout from './pages/layout';
import ShopPage from './pages/shop/page';
import LoginPage from './pages/login/page';
import SignupPage from './pages/signup/page';
import AboutPage from './pages/about/page';
import ContactPage from './pages/contact/page';
import MyOrdersPage from './pages/my-orders/page';
import CheckoutPage from './pages/checkout/page';
import NotAuthorizedPage from './pages/not-authorized/page';
import PrivacyPage from './pages/privacy/page';
import ProductPage from './pages/product/page';
import Page from './pages/reset-password/page';
import ForgotPasswordPage from './pages/forgot-password/page';
import AdminDashboardPage from './pages/admin/page';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<RootLayout />}>
      <Route index element={<HomePage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SignupPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/reset-password" element={<Page />} />
      <Route path="/my-orders" element={<MyOrdersPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/not-authorized" element={<NotAuthorizedPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      {/* <Route path="/products" element={< />} /> */}
      <Route path="/category/:id" element={<CategorySection />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/admin" element={<AdminDashboardPage />} />
      </Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
