import ServiceItem from "@/components/items/service";
import MarkedTitleSection from "@/components/marked-title-section";
import clipboard from "@/static/services/clipboard.svg";
import pill from "@/static/services/pill.svg";
import stethoscope from "@/static/services/stethoscope.svg";
import { openWebview } from "zmp-sdk/apis";

function YTePage() {
  return (
    <div className="py-4 px-3 space-y-4">
      <MarkedTitleSection title="Danh mục">
        <div className="grid grid-cols-4 px-5 gap-x-3 gap-y-8">
          <ServiceItem
            icon={clipboard}
            label="Tra cứu bảo hiểm y tế"
            onClick={() =>
              openWebview({
                url: "https://baohiemxahoi.gov.vn/tracuu/Pages/tra-cuu-thoi-han-su-dung-the-bhyt.aspx",
                config: { style: "normal" },
              })
            }
          />
          {/* Không thay đổi 2 mục còn lại theo yêu cầu */}
          <ServiceItem
            icon={pill}
            label="Tra cứu thuốc"
           onClick={() =>
              openWebview({
                url: "https://dav.gov.vn/tra-cuu-thuoc.html",
                config: { style: "normal" },
              })
            }
          />
          <ServiceItem
            icon={stethoscope}
            label="Địa điểm tiêm chủng"
             onClick={() =>
              openWebview({
                url: "https://sotiemchung.vncdc.gov.vn/login",
                config: { style: "normal" },
              })
            }
          />
        </div>
      </MarkedTitleSection>
    </div>
  );
}

export default YTePage;