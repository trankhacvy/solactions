import { alpha, CSSObject } from "@mui/system";

export function bgImgBlur({ imgUrl }: { imgUrl: string }): CSSObject {
  return {
    position: "relative",
    "&:before": {
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: 9,
      content: '""',
      width: "100%",
      height: "100%",
      opacity: 0.24,
      backgroundImage: `url(${imgUrl})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
    },
  };
}
