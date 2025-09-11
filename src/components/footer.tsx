import HorizontalDivider from "./horizontal-divider";
import { useAtomValue } from "jotai";
import TransitionLink from "./transition-link";
import HomeIcon from "./icons/home";
import ExploreIcon from "./icons/explore";
import ChatIcon from "./icons/cart";
import ProfileIcon from "./icons/profile";
import BigPlusIcon from "./icons/big-plus";
import { useRouteHandle } from "@/hooks";
import FooterWave from "./icons/footer-wave";
import { Icon } from "zmp-ui";
import NotifiIcon from "./icons/notifi";
import { openWebview, openChat } from "zmp-sdk/apis";

/**
 * Mở màn hình chat với OA bằng API Zalo Mini App.
 * - Nếu chạy ngoài môi trường Zalo hoặc API thất bại, fallback mở trang OA trên web.
 */
const handleOpenOAChat = async () => {
  try {
    await openChat({
      type: "oa",
      id: "3940546633955322358",
    });
  } catch (error) {
    console.log(error);
    try {
      await openWebview({ url: "https://zalo.me/3940546633955322358" });
    } catch (e) {
      console.log(e);
    }
  }
};

/**
 * Mở trang thông báo OA qua webview.
 */
const handleOpenThongBao = async () => {
  try {
    await openWebview({
      url: "https://rd.zapps.vn/articles?pageId=3940546633955322358",
    });
  } catch (error) {
    console.log(error);
  }
};

const NAV_ITEMS = [
  {
    name: "Trang chủ",
    path: "/",
    icon: HomeIcon,
  },
  {
    name: "Chat OA",
    path: "/chat-oa",
    icon: ChatIcon,
    // Khi click, mở OA thay vì điều hướng trang
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      handleOpenOAChat();
    },
  },

  {
    name: "Thông báo",
    path: "/thongbao",
    icon: NotifiIcon,
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      handleOpenThongBao();
    },
  },
  // {
  //   name: "Khám phá",
  //   path: "/explore",
  //   icon: ExploreIcon,
  // },
  // {
  //   path: "/booking",
  //   icon: () => (
  //     <BigPlusIcon className="-mt-4 shadow-lg shadow-highlight rounded-full" />
  //   ),
  // },

  // {
  //   name: "Lịch khám",
  //   path: "/schedule",
  //   icon: ChatIcon,
  // },
  {
    name: "Cá nhân",
    path: "/home/profile",
    icon: ProfileIcon,
  },
];

export default function Footer() {
  const [handle] = useRouteHandle();
  // Ẩn Footer nếu có cờ hideFooter, hoặc nếu có back nhưng KHÔNG bật showFooter
  if (handle.hideFooter || (handle.back && !handle.showFooter)) {
    return <></>;
  }

  return (
    <div className="w-full relative">
      {/* <FooterWave
        className="absolute inset-x-0 bottom-sb z-10 h-24 -mb-6"
        style={{
          filter: "drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.08))",
        }}
      /> */}
      <div
        className="w-full px-4 pt-2 grid text-3xs relative z-20 justify-center pb-sb bg-white"
        style={{
          gridTemplateColumns: `repeat(${NAV_ITEMS.length}, 1fr)`,
        }}
      >
        {NAV_ITEMS.map((item) => {
          return (
            <TransitionLink
              to={item.path}
              key={item.path}
              onClick={(item as any).onClick}
              className="flex flex-col items-center space-y-0.5 p-1 active:scale-105"
            >
              {({ isActive }) =>
                item.name ? (
                  <>
                    <div className="w-6 h-6 flex justify-center items-center">
                      <item.icon active={isActive} />
                    </div>
                    <div
                      className={`text-2xs truncate ${isActive ? "text-primary" : "text-disabled"}`}
                    >
                      {item.name}
                    </div>
                  </>
                ) : (
                  <item.icon active={isActive} />
                )
              }
            </TransitionLink>
          );
        })}
      </div>
    </div>
  );
}
