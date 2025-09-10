import { useParams } from "react-router-dom";
import NotFound from "../404";
import newsData from "@/components/mock/tintuc.json";

/**
 * Trang chi tiết tin tức.
 * Đọc dữ liệu từ tintuc.json theo id trên URL và render nội dung HTML.
 */
function NewsPage() {
  const { id } = useParams();
  const numericId = Number(id);
  const news = (newsData as any[]).find((n) => n.id === numericId);

  if (!news) {
    return <NotFound />;
  }

  return (
    <div className="flex w-full flex-col gap-4 p-4 text-sm leading-[150%]">
      {/* Tiêu đề bài viết lấy từ tintuc.json */}
      <h1 className="text-lg font-medium">{news.title}</h1>
      {/* Nội dung HTML của bài viết */}
      <div dangerouslySetInnerHTML={{ __html: news.content }} />
    </div>
  );
}

export default NewsPage;
