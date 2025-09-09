import ServiceMenu from './service-menu';
import QuickActions from './quick-actions';
import SearchBar from '../search/search-bar';
import FeaturedServices from './featured-services';
import RemoteDiagnosis from './remote-diagnosis';
import HealthNews from './health-news';
import { Page, Box, Avatar, Text, Icon } from "zmp-ui";
import FeaturedDacSan from './featured-dacsan';
import FeaturedNhaHang from './featured-nhahang';
import FeaturedHotel from './featured-hotel';

function HomePage() {
  return (
    <>
      {/* <SearchBar className="mx-4" /> */}
      {/* <QuickActions /> */}

      <Box
        px={5}
        py={3}
        style={{
          backgroundImage:
            'url("https://cms.thainguyen.vn/documents/1329041/3894590/1.+BA+DEN+1.webp/29a730ef-c844-4a4f-922a-1fed964e1a9b")',
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover", // Có thể đổi thành "contain" nếu muốn ảnh không bị cắt
          // minHeight: "80vh",       // Tăng chiều cao để thấy rõ ảnh
          width: "100%",
        }}
      >
        <ServiceMenu />
      </Box>
      <FeaturedServices />
      <FeaturedDacSan />
      <FeaturedNhaHang />
      <FeaturedHotel />
      {/* <RemoteDiagnosis /> */}
      <HealthNews />

    </>
  );
}

export default HomePage;
