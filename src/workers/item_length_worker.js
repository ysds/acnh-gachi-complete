import {
  totalLength,
  collectedLength,
  allTotalLength,
  allCollectedLength,
} from "../utils/filterItems";
import { navs } from "../utils/navs";

// 中断指示フラグ
let abort = false;

addEventListener("message", (e) => {
  const { data } = e;

  if (data.abort) {
    abort = true;
    return;
  } else {
    abort = false;
  }

  /* 全体のTotalLength */
  postMessage({
    requestId: data.requestId,
    allTotalLength: allTotalLength({
      isFullMode: data.isFullMode,
      partnerlist: data.partnerlist,
    }),
  });

  /* 中断指示チェック */
  if (abort) return;

  /* 全体のCollectedLength */
  postMessage({
    requestId: data.requestId,
    allCollectedLength: allCollectedLength({
      collected: data.collected,
      isFullMode: data.isFullMode,
      partnerlist: data.partnerlist,
    }),
  });

  /* 中断指示チェック */
  if (abort) return;

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
        /* 中断指示チェック */
        if (abort) return;
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
      /* 中断指示チェック */
      if (abort) return;
      /* nav単位で送信すると特にAndroidでCollectedLengthの更新遅延が発生する。そのため、ある程度まとめて送信する。 */
      if (Object.keys(navsLengths).length >= 10) {
        postMessage({ requestId: data.requestId, navsLengths: navsLengths });
        navsLengths = {};
      }
    });

  /* nav別の未送信分を送信 */
  if (Object.keys(navsLengths).length > 0) {
    postMessage({ requestId: data.requestId, navLengths: navsLengths });
  }

  return postMessage({ requestId: data.requestId, complete: true });
});

export default {};
