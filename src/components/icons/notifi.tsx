import { SVGProps } from "react";

interface NotifiIconProps extends SVGProps<SVGSVGElement> {
  active?: boolean;
}

/**
 * NotifiIcon (Notification/Bell)
 * - Biểu tượng chuông thông báo dạng SVG 26x26, đồng bộ phong cách với ChatIcon/HomeIcon.
 * - Hỗ trợ prop `active` để đổi màu fill: active dùng gradient (CSS variables), không active màu xám (#DADADA).
 * - Kế thừa mọi props của SVG để có thể truyền className/style,... khi sử dụng.
 */
export default function NotifiIcon({ active, ...props }: NotifiIconProps) {
  return (
    <svg
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
      {...props}
    >
      <g clipPath="url(#clip0_notifi)">
        {/* Thân chuông thông báo */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13 3.25c-3.59 0-6.5 2.91-6.5 6.5v2.4c0 .86-.34 1.69-.95 2.3l-1.21 1.21c-.51.51-.15 1.34.58 1.34h16.16c.73 0 1.09-.83.58-1.34l-1.21-1.21c-.61-.61-.95-1.44-.95-2.3v-2.4c0-3.59-2.91-6.5-6.5-6.5Z"
          fill={active ? "url(#paint0_linear_notifi)" : "#DADADA"}
        />
        {/* Đế chuông / gờ dưới */}
        <path
          d="M8.75 17.5h8.5c.69 0 1.25.56 1.25 1.25 0 .69-.56 1.25-1.25 1.25h-8.5c-.69 0-1.25-.56-1.25-1.25 0-.69.56-1.25 1.25-1.25Z"
          fill={active ? "url(#paint0_linear_notifi)" : "#DADADA"}
        />
        {/* Quả lắc chuông */}
        <path
          d="M11 21c0 1.105.895 2 2 2s2-.895 2-2h-4Z"
          fill={active ? "url(#paint0_linear_notifi)" : "#DADADA"}
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_notifi"
          x1="-2"
          y1="10"
          x2="10"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--primary-gradient)" />
          <stop offset="1" stopColor="var(--primary)" />
        </linearGradient>
        <clipPath id="clip0_notifi">
          <rect width="26" height="26" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}