import React, { useMemo } from "react";
import { Text } from "zmp-ui";
import { useParams } from "react-router-dom";
import { openWebview } from "zmp-sdk/apis";
import data from "@/components/mock/homestay.json";

const { Title } = Text;

export default function HomestayDetailPage() {
  // Lấy chỉ số homestay từ URL, mặc định 0 nếu không có
  const params = useParams();
  const index = useMemo(() => {
    const raw = params.index;
    const i = raw ? parseInt(raw, 10) : 0;
    return Number.isFinite(i) && i >= 0 && i < data.length ? i : 0;
  }, [params.index]);

  const item = data[index] as any;

  const cover = item?.hinhAnh ||
    "https://via.placeholder.com/800x450/e5e7eb/6b7280?text=No+Image";

  const handleOpenMap = async () => {
    try {
      const url = item?.googleMapsUrl as string;
      if (url) {
        await openWebview({ url, config: { style: "normal" } });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenWebsite = async () => {
    const url = item?.googleMapsUrl || ""; // không có website riêng, dùng map link
    if (!url) return;
    try {
      await openWebview({ url, config: { style: "normal" } });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white min-h-0 overflow-y-auto">
      {/* Header với ảnh cover và thẻ thông tin nổi */}
      <div className="relative">
        <div className="relative w-full aspect-[16/9]">
          <img
            src={cover}
            alt={item?.ten}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/800x450/e5e7eb/6b7280?text=No+Image";
            }}
          />
          {/* gradient overlay phía dưới */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        </div>

        {/* Card nổi chứa tên, địa chỉ + 2 nút hành động */}
        <div className="absolute left-4 right-4 -bottom-10">
          <div className="bg-white rounded-2xl shadow-lg border border-black/5 p-4">
            <div className="text-center">
              <div className="text-base font-semibold leading-snug">
                {item?.ten}
              </div>
              {item?.diaChi && (
                <div className="mt-1 text-xs text-gray-600">
                  {item.diaChi}
                </div>
              )}
            </div>

            {/* 2 nút hành động */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={handleOpenMap}
                className="h-10 rounded-full border border-gray-200 text-primary font-medium flex items-center justify-center gap-2 active:scale-95"
              >
                {/* Map pin icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6zm0 8.5A2.5 2.5 0 1 1 12 5a2.5 2.5 0 0 1 0 5.5z" />
                </svg>
                Xem vị trí
              </button>
              <button
                onClick={handleOpenWebsite}
                disabled={!item?.googleMapsUrl}
                className={`h-10 rounded-full font-medium flex items-center justify-center gap-2 active:scale-95 ${
                  item?.googleMapsUrl
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {/* Globe icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm7.938 9h-3.173a15.78 15.78 0 0 0-1.138-5.018A8.032 8.032 0 0 1 19.938 11zM12 4c1.65 0 3.164 2.166 3.78 6H8.22C8.836 6.166 10.35 4 12 4zM4.062 13h3.173a15.78 15.78 0 0 0 1.138 5.018A8.032 8.032 0 0 1 4.062 13zM7.235 11H4.062a8.032 8.032 0 0 1 4.311-5.018A15.78 15.78 0 0 0 7.235 11zm1.985 2h5.56c-.616 3.834-2.13 6-3.78 6s-3.164-2.166-3.78-6zM16.765 13h3.173a8.032 8.032 0 0 1-4.311 5.018A15.78 15.78 0 0 0 16.765 13z" />
                </svg>
                Website
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Nội dung chi tiết */}
      <div className="px-4 pt-14 pb-24 space-y-6">
        {/* Thông tin mô tả */}
        {item?.moTa && (
          <section>
            <Title size="small" className="!mb-2">
              Thông tin
            </Title>
            <p className="text-[13px] leading-relaxed text-gray-700">
              {item.moTa}
            </p>
          </section>
        )}

        {/* Bảng giá phòng nếu có */}
        {Array.isArray(item?.giaPhong) && item.giaPhong.length > 0 && (
          <section>
            <Title size="small" className="!mb-2">
              Giá phòng tham khảo
            </Title>
            <div className="divide-y divide-gray-100 rounded-lg border border-gray-100">
              {item.giaPhong.map((g: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 text-[13px]">
                  <span className="text-gray-700">{g.loai}</span>
                  <span className="font-medium">{g.gia}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Số điện thoại & Địa chỉ */}
        {(item?.soDienThoai || item?.diaChi) && (
          <section className="space-y-2">
            {item?.soDienThoai && (
              <div className="flex items-start gap-3 text-[13px]">
                {/* Phone icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-green-600 mt-0.5"
                >
                  <path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V21a1 1 0 0 1-1 1C11.3 22 2 12.7 2 1a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2z" />
                </svg>
                <div>
                  <div className="font-medium">Hotline liên hệ</div>
                  <a href={`tel:${item.soDienThoai}`} className="text-primary">
                    {item.soDienThoai}
                  </a>
                </div>
              </div>
            )}
            {item?.diaChi && (
              <div className="flex items-start gap-3 text-[13px]">
                {/* Map pin icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-primary mt-0.5"
                >
                  <path d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6zm0 8.5A2.5 2.5 0 1 1 12 5a2.5 2.5 0 0 1 0 5.5z" />
                </svg>
                <div>
                  <div className="font-medium">Địa chỉ</div>
                  <div className="text-gray-700">{item.diaChi}</div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Hình ảnh: file hiện chỉ có 1 ảnh duy nhất mỗi item */}
        {item?.hinhAnh && (
          <section>
            <Title size="small" className="!mb-2">
              Hình ảnh
            </Title>
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-[4/3] rounded-lg overflow-hidden">
                <img
                  src={item.hinhAnh}
                  alt={`${item.ten}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Image";
                  }}
                />
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}