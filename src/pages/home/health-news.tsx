import Section from "@/components/section";
import TransitionLink from "@/components/transition-link";
import { Article } from "@/types";
import newsData from "@/components/mock/tintuc.json";
import { useLocation } from "react-router-dom";

/**
 * Hiển thị 1 item tin tức sức khỏe.
 * Nhận vào dữ liệu theo kiểu Article (đã được map từ tintuc.json).
 */
export function NewsItem(news: Article) {
  return (
    <TransitionLink
      to={`/news/${news.id}`}
      className="flex w-full justify-between items-center gap-4 rounded-lg bg-white p-4"
    >
      <div className="flex-1 space-y-2">
        <h3 className="text-xs font-medium">{news.title}</h3>
        <p className="text-xs text-disabled line-clamp-1">{news.description}</p>
        <div className="flex justify-between text-xs text-disabled pt-2">
          <span>{news.category}</span>
          <span>{news.timeAgo}</span>
        </div>
      </div>
      <img
        src={news.image}
        className="h-20 w-20 rounded-lg object-cover object-center"
        alt="News thumbnail"
      />
    </TransitionLink>
  );
}

/**
 * Section "Tin tức sức khỏe" lấy dữ liệu từ mock tintuc.json.
 * - Gọi dữ liệu từ src/components/mock/tintuc.json
 * - Map sang kiểu Article để tái sử dụng component NewsItem hiện có
 * - Hiển thị 3 bản tin đầu tiên
 */
export default function HealthNews() {
  // Map dữ liệu thô từ tintuc.json sang Article để phù hợp UI hiện tại
  const mapped: Article[] = (newsData as any[]).map((n) => ({
    id: n.id,
    title: n.title,
    description: n.preview || "",
    category: "Tin tức",
    timeAgo: "",
    image: n.thumbnail,
    content: n.content,
  }));

  const [a1, a2, a3] = mapped.slice(0, 3);
  
  // Ẩn tiêu đề và nút "Xem tất cả" khi đang ở trang danh mục id 12 (/home/health-news)
  // Sử dụng useLocation để xác định đường dẫn hiện tại.
  const location = useLocation();
  const isCategoryPage = location.pathname === "/home/health-news";

  return (
    <Section
      className="py-4 space-y-3"
      title={isCategoryPage ? undefined : "Thông tin từ chính quyền"}
      viewMore={isCategoryPage ? undefined : "/explore"}
    >
      {a1 && <NewsItem {...a1} />}
      {a2 && <NewsItem {...a2} />}
      {a3 && <NewsItem {...a3} />}
    </Section>
  );
}
