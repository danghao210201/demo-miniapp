import ServiceItem from "@/components/items/service";
import MarkedTitleSection from "@/components/marked-title-section";
import clipboard from "@/static/services/clipboard.svg";
import pill from "@/static/services/pill.svg";
import stethoscope from "@/static/services/stethoscope.svg";
import { openWebview } from "zmp-sdk/apis";
import hocphi from "@/static/image/hocphi.png";
import solienlac from "@/static/image/solienlac.png" 
import tuyensinh from "@/static/image/tuyensinh.png" 
function GiaoDucPage() {
  return (
    <div className="py-3 px-3 space-y-4">
      <MarkedTitleSection title="Danh mục">
        <div className="grid grid-cols-3 px-5 gap-x-3 gap-y-8">
          <ServiceItem
            icon={hocphi}
            label="Thanh toán học phí"
            onClick={() =>
              openWebview({
                url: "https://www.vban.vn/dich-vu/thanh-toan-hoc-phi.aspx",
                config: { style: "normal" },
              })
            }
          />
          {/* Không thay đổi 2 mục còn lại theo yêu cầu */}
          <ServiceItem
            icon={solienlac}
            label="Sổ liên lạc điện tử"
           onClick={() =>
              openWebview({
                url: "https://tracuu.vnedu.vn/kqhtv2/",
                config: { style: "normal" },
              })
            }
          />
          <ServiceItem
            icon={tuyensinh}
            label="Tuyển sinh"
             onClick={() =>
              openWebview({
                url: "https://tuyensinh.tayninh.edu.vn/",
                config: { style: "normal" },
              })
            }
          />
        </div>
      </MarkedTitleSection>
    </div>
  );
}

export default GiaoDucPage;