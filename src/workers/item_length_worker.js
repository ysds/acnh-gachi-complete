import {
  totalLength,
  collectedLength,
  allTotalLength,
  allCollectedLength,
} from "../utils/filterItems";
import { navs } from "../utils/navs";

addEventListener("message", (e) => {
  const { data } = e;

  /* 全体のTotalLength */
  postMessage({
    allTotalLength: allTotalLength({
      isFullMode: data.isFullMode,
      partnerlist: data.partnerlist,
    }),
  });

  /* 全体のCollectedLength */
  postMessage({
    allCollectedLength: allCollectedLength({
      collected: data.collected,
      isFullMode: data.isFullMode,
      partnerlist: data.partnerlist,
    }),
  });

  /* nav別のTotalLengthとCollectedLength */
  let navsLengths = {};
  navs
    .filter((nav) => {
      return nav.id !== "exchange" && nav.id.indexOf("separator");
    })
    .forEach((nav) => {
      const subnavs = nav.subnavs;
      if (subnavs) {
        subnavs.forEach((subnav) => {
          navsLengths[subnav.id] = [
            totalLength({
              nav: subnav.id,
              isFullMode: data.isFullMode,
              partnerlist: data.partnerlist,
            }),
            collectedLength({
              nav: subnav.id,
              collected: data.collected,
              isFullMode: data.isFullMode,
              partnerlist: data.partnerlist,
            }),
          ];
        });
      } else {
        navsLengths[nav.id] = [
          totalLength({
            nav: nav.id,
            isFullMode: data.isFullMode,
            partnerlist: data.partnerlist,
          }),
          collectedLength({
            nav: nav.id,
            collected: data.collected,
            isFullMode: data.isFullMode,
            partnerlist: data.partnerlist,
          }),
        ];
      }
      /* nav単位で送信すると特にAndroidでCollectedLengthの更新遅延が発生する。そのため、ある程度まとめて送信する。 */
      if (Object.keys(navsLengths).length >= 10) {
        postMessage({ navsLengths: navsLengths });
        navsLengths = {};
      }
    });

  /* nav別の未送信分を送信 */
  if (Object.keys(navsLengths).length > 0) {
    postMessage({ navLengths: navsLengths });
  }

  return postMessage({ complete: true });
});

export default {};
