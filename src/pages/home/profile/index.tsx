import { openShareSheet, createShortcut, getUserInfo } from "zmp-sdk/apis";
import { toast } from "react-hot-toast";
import newsImg from "@/static/news.png";
import { useEffect, useState } from "react";

/**
 * Trang Hồ sơ (ProfileHomePage)
 * - Hiển thị: Avatar, Tên người dùng (username), ID Zalo
 * - Hành động: Chia sẻ ứng dụng, Ghim ứng dụng ra màn hình chính
 * - Xin quyền: Cho phép truy cập tên, ảnh đại diện, userId thông qua getUserInfo của Zalo Mini App
 */
export default function ProfileHomePage() {
  // Trạng thái cục bộ cho thông tin người dùng
  const [userInfo, setUserInfo] = useState<any>({});

  /**
   * Khởi tạo: nếu người dùng đã cấp quyền, lấy luôn thông tin để hiển thị.
   * Nếu chưa cấp quyền, giữ userInfo rỗng để UI hiển thị nút xin quyền.
   */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getUserInfo({ avatarType: "normal" });
        if (mounted) setUserInfo(res?.userInfo ?? {});
      } catch (e) {
        // Chưa cấp quyền -> bỏ qua để hiện UI xin quyền
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  /**
   * Yêu cầu quyền truy cập thông tin người dùng (tên, avatar, id) thông qua Zalo Mini App API.
   * - Nếu người dùng chưa cấp quyền, Zalo sẽ hiển thị hộp thoại xin quyền.
   * - Sau khi thành công, cập nhật state cục bộ để hiển thị thông tin ngay.
   */
  async function handleRequestUserPermission() {
    try {
      // Gọi trực tiếp API của Zalo để xin quyền và lấy thông tin người dùng
      const res = await getUserInfo({ avatarType: "normal" });
      setUserInfo(res?.userInfo ?? {});
      toast.success("Đã cấp quyền truy cập thông tin");
    } catch (err) {
      toast.error("Không thể lấy thông tin người dùng. Vui lòng thử lại.");
    }
  }

  /**
   * Xử lý chia sẻ ứng dụng qua ShareSheet của Zalo Mini App.
   * Fallback: Web Share API khi chạy ngoài môi trường Zalo.
   */
  async function handleShareApp() {
    const appName = (window as any).APP_CONFIG?.app?.title || "Mini App";
    try {
      await openShareSheet({
        type: "zmp",
        data: {
          title: String(appName),
          thumbnail: userInfo?.avatar || newsImg,
          path: "/profile",
          description: `Mời bạn trải nghiệm ${appName}!`,
        },
      });
      toast.success("Đã mở cửa sổ chia sẻ");
    } catch (err) {
      if (typeof navigator !== "undefined" && (navigator as any).share) {
        try {
          await (navigator as any).share({
            title: String(appName),
            text: `Mời bạn trải nghiệm ${appName}!`,
            url: window.location.origin + "/profile",
          });
          toast.success("Chia sẻ thành công");
          return;
        } catch {}
      }
      toast.error("Không thể chia sẻ trên thiết bị này");
    }
  }

  /**
   * Xử lý ghim ứng dụng ra màn hình chính bằng API createShortcut của Zalo.
   * Lưu ý: Một số thiết bị Android yêu cầu cấp quyền thêm shortcut trong cài đặt.
   */
  async function handlePinToHome() {
    try {
      // Nhiều phiên bản SDK không yêu cầu tham số cho createShortcut
      await createShortcut();
      toast.success("Đã yêu cầu ghim ứng dụng ra màn hình chính");
    } catch (err) {
      toast.error(
        "Không thể ghim. Vui lòng kiểm tra quyền 'Lối tắt Màn hình chính' của Zalo trong Cài đặt thiết bị."
      );
    }
  }

  const incompleteProfile = !userInfo?.id || !userInfo?.name || !userInfo?.avatar;

  return (
    <div className="flex-1 flex flex-col bg-page">
      {/* Thông tin cơ bản người dùng */}
      <div className="bg-white px-4 py-6 flex items-center gap-4 shadow-sm">
        <img
          src={userInfo?.avatar}
          alt={userInfo?.name || "avatar"}
          className="h-16 w-16 rounded-full object-cover bg-gray-100"
        />
        <div className="flex-1">
          <div className="text-base font-semibold text-gray-900">
            {userInfo?.name || "Người dùng Zalo"}
          </div>
          <div className="text-xs text-gray-500 mt-1">ID Zalo: {userInfo?.id || "--"}</div>
        </div>
      </div>

      {/* Nhắc xin quyền hiển thị thông tin người dùng khi thiếu dữ liệu */}
      {incompleteProfile && (
        <div className="mx-4 mt-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <div className="text-sm font-medium">Cần quyền truy cập thông tin cơ bản</div>
          <div className="mt-1 text-xs opacity-90">
            Ứng dụng cần quyền truy cập tên, ảnh đại diện và ID Zalo để hiển thị đầy đủ thông tin cá nhân của bạn.
          </div>
          <div className="mt-3">
            <button
              type="button"
              onClick={handleRequestUserPermission}
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-3 py-2 text-xs font-medium text-white active:opacity-90"
            >
              Cấp quyền truy cập
            </button>
          </div>
        </div>
      )}

      {/* Hành động */}
      <div className="mt-3 bg-white divide-y divide-gray-100">
        {/* Chia sẻ ứng dụng */}
        <button
          type="button"
          onClick={handleShareApp}
          className="w-full flex items-center justify-between px-4 py-4 active:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-green-600">
              {/* Share icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.02-4.11c.54.5 1.25.81 2.07.81 1.66 0 3-1.34 3-3s-1.34-3-3 1.34-3 3c0 .24.04.47.09.7L8.91 8.81C8.37 8.31 7.66 8 6.84 8 5.18 8 3.84 9.34 3.84 11s1.34 3 3 3c.82 0 1.53-.31 2.07-.81l7.13 4.17c-.05.2-.08.41-.08.64 0 1.62 1.31 2.93 2.93 2.93s2.93-1.31 2.93-2.93S19.62 16.08 18 16.08z" />
              </svg>
            </span>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900">Chia sẻ ứng dụng</div>
              <div className="text-xs text-gray-500">Gửi liên kết để bạn bè cùng trải nghiệm</div>
            </div>
          </div>
          <span className="text-gray-400">›</span>
        </button>

        {/* Ghim ứng dụng */}
        <button
          type="button"
          onClick={handlePinToHome}
          className="w-full flex items-center justify-between px-4 py-4 active:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              {/* Pin icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M14 4l-2 2 4 4-2 2-4-4-2 2-2-6 6 2zM5 15l4 4-1.41 1.41L3.59 16.41 5 15z" />
              </svg>
            </span>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900">Ghim ứng dụng ra màn hình chính</div>
              <div className="text-xs text-gray-500">Tạo lối tắt để mở ứng dụng nhanh hơn</div>
            </div>
          </div>
          <span className="text-gray-400">›</span>
        </button>
      </div>
    </div>
  );
}