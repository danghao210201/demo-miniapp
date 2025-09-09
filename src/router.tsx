import Layout from "@/components/layout";
import HomePage from "@/pages/home";
import { createBrowserRouter } from "react-router-dom";
import ServicesPage from "./pages/services";
import CategoriesPage from "./pages/categories";
import ExplorePage from "./pages/explore";
import ServiceDetailPage from "./pages/detail/service";
import NotFound from "./pages/404";
import BookingPage from "./pages/booking";
import ScheduleHistoryPage from "./pages/schedule/history";
import ScheduleDetailPage from "./pages/schedule/detail";
import ProfilePage from "./pages/profile";
import InvoicesPage from "./pages/invoices";
import AskPage from "./pages/ask";
import FeedbackPage from "./pages/feedback";
import SearchResultPage from "./pages/search";
import { ErrorBoundary } from "./components/error-boundary";
import DepartmentDetailPage from "./pages/detail/department";
import NewsPage from "./pages/news";
import RestaurantListPage from "./pages/home/restaurants/list";
import RestaurantDetailPage from "./pages/home/restaurants/detail";
import DanhSachPhanAnh from "./pages/home/kiennghi/danhsachphananh";
import ChiTietPhanAnh from "./pages/home/kiennghi/chitietphananh";
import GuiPhanAnh from "./pages/home/kiennghi/guiphananh";
import PhanAnhDaGui from "./pages/home/kiennghi/phananhdagui";
import HotelListPage from "./pages/home/hotel/list";
import HotelDetailPage from "./pages/home/hotel/detail";
import DuongDayNongPage from "./pages/home/hotline/list";
import HomestayListPage from "./pages/home/homestay/list";
import HomestayDetailPage from "./pages/home/homestay/detail";
import LichSuVanHoaListPage from "./pages/home/lichsuvanhoa/list";
import LichSuVanHoaDetailPage from "./pages/home/lichsuvanhoa/detail";
import YTePage from "./pages/home/dichvuthietyeu/yte";
import GiaoDucPage from "./pages/home/dichvuthietyeu/giaoduc";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },

        {
          path: "/search",
          element: <SearchResultPage />,
        },
        {
          path: "/categories",
          element: <CategoriesPage />,
          handle: {
            back: true,
            title: "Danh mục",
            noScroll: true,
          },
        },
        {
          path: "/explore",
          element: <ExplorePage />,
        },
        {
          path: "/services",
          element: <ServicesPage />,
          handle: {
            back: true,
            title: "Tất cả dịch vụ",
          },
        },
        {
          /**
           * Accepted params:
           * - `tab`: to change to default tab (this page has 3 tabs). For example, to visit the doctor tab, navigate to /service/1?tab=2
           * - `doctor`: to default pick a doctor. For example: /service/1?tab=2&doctor=1
           */
          path: "/service/:id",
          element: <ServiceDetailPage />,
          handle: {
            back: true,
            title: "custom",
          },
        },
        {
          /**
           * Accepted params like above
           */
          path: "/department/:id",
          element: <DepartmentDetailPage />,
          handle: {
            back: true,
            title: "custom",
          },
        },
        {
          path: "/booking/:step?",
          element: <BookingPage />,
          handle: {
            back: true,
            title: "Đặt lịch khám",
          },
        },
        {
          path: "/ask",
          element: <AskPage />,
          handle: {
            back: true,
            title: "Gửi câu hỏi",
          },
        },
        {
          path: "/feedback",
          element: <FeedbackPage />,
          handle: {
            back: true,
            title: "Gửi phản ảnh",
          },
        },
        {
          path: "/schedule",
          element: <ScheduleHistoryPage />,
        },
        {
          path: "/schedule/:id",
          element: <ScheduleDetailPage />,
          handle: {
            back: true,
            title: "Chi tiết",
          },
        },
        {
          path: "/profile",
          element: <ProfilePage />,
          handle: {
            profile: true,
          },
        },
        {
          path: "/news/:id",
          element: <NewsPage />,
          handle: {
            back: true,
            title: "Tin tức",
          },
        },
        {
          path: "/invoices",
          element: <InvoicesPage />,
          handle: {
            back: true,
            title: "Hóa đơn",
          },
        },
        {
          path: "*",
          element: <NotFound />,
        },
        {
          path: "/restaurants/list",
          element: <RestaurantListPage />,
          handle: {
            back: true,
            title: "Nhà hàng",
            noScroll: true,
          },
        },
        {
          path: "/restaurants/:index",
          element: <RestaurantDetailPage />,
          handle: {
            back: true,
            title: "Thông tin chi tiết",
            noScroll: true,
          },
        },
        {
          path: "/hotel/list",
          element: <HotelListPage />,
          handle: {
            back: true,
            title: "Khách sạn",
            noScroll: true,
          },
        },
        {
          path: "/homestay/list",
          element: <HomestayListPage />,
          handle: {
            back: true,
            title: "Homestay",
            noScroll: true,
          },
        },
        {
          path: "/homestay/:index",
          element: <HomestayDetailPage />,
          handle: {
            back: true,
            title: "Thông tin chi tiết",
            noScroll: true,
          },
        },
          {
          path: "/lichsuvanhoa/list",
          element: <LichSuVanHoaListPage />,
          handle: {
            back: true,
            title: "Lịch sử - Văn hoá",
            noScroll: true,
          },
        },
        {
          path: "/lichsuvanhoa/:index",
          element: <LichSuVanHoaDetailPage />,
          handle: {
            back: true,
            title: "Thông tin chi tiết",
            noScroll: true,
          },
        },
        {
          path: "/hotel/:index",
          element: <HotelDetailPage />,
          handle: {
            back: true,
            title: "Thông tin chi tiết",
            noScroll: true,
          },
        },
        {
          path: "/kiennghi/danhsachphananh",
          element: <DanhSachPhanAnh />,
          handle: {
            back: true,
            title: "Kiến nghị - Phản ánh",
            noScroll: true,
          },
        },

        {
          path: "/kiennghi/chitietphananh",
          element: <ChiTietPhanAnh />,
          handle: {
            back: true,
            title: "Chi tiết",
            noScroll: true,
          },
        },

        {
          path: "/kiennghi/guiphananh",
          element: <GuiPhanAnh />,
          handle: {
            back: true,
            title: "Gửi Kiến nghị - Phản ánh",
            noScroll: true,
          },
        },

        {
          path: "/kiennghi/phananhdagui",
          element: <PhanAnhDaGui />,
          handle: {
            back: true,
            title: "Kiến nghị - Phản ánh đã gửi",
            noScroll: true,
          },
        },
        {
          path: "/hotline/list",
          element: <DuongDayNongPage />,
          handle: {
            back: true,
            title: "Đường dây nóng",
            noScroll: true,
          },
        },
        {
          path: "/dichvuthietyeu/yte",
          element: <YTePage />,
          handle: {
            back: true,
            title: "Dịch vụ y tế",
            noScroll: true,
          },
        },
         {
          path: "/dichvuthietyeu/giaoduc",
          element: <GiaoDucPage />,
          handle: {
            back: true,
            title: "Giáo dục",
            noScroll: true,
          },
        },
      ],
      ErrorBoundary,
    },
  ],
  { basename: getBasePath() }
);

export function getBasePath() {
  const urlParams = new URLSearchParams(window.location.search);
  const appEnv = urlParams.get("env");

  if (
    import.meta.env.PROD ||
    appEnv === "TESTING_LOCAL" ||
    appEnv === "TESTING" ||
    appEnv === "DEVELOPMENT"
  ) {
    return `/zapps/${window.APP_ID}`;
  }

  return window.BASE_PATH || "";
}

export default router;
