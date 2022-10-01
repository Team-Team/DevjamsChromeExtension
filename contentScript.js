let youtubeLeftControls, youtubePlayer;
let currentVideo = "";
let currentVideoBookmarks = [];
const channel_list = [
  {
    link: "https://www.youtube.com/c/DrGajendraPurohitMathematics",
    name: "Dr.Gajendra Purohit",
    imgLink:
      "https://yt3.ggpht.com/ytc/AMLnZu8kXYOXnHIGpTQubSEyUjzjtttv0kJ_Bj7FAfhv=s176-c-k-c0x00ffffff-no-rj",
    numberOfSubs: 10,
    numberOfVideos: 15,
  },
  {
    link: "https://www.youtube.com/c/ApnaCollegeOfficial",
    name: "Apna College",
    imgLink:
      "https://yt3.ggpht.com/O12gYmCwBASezJpxddXOj1PEirMgxCGX2gOiJ3plomaK4E0K1hr_iobbQEWz1e4QVMflTmug=s176-c-k-c0x00ffffff-no-rj-mo",
    numberOfSubs: 10,
    numberOfVideos: 15,
  },
  {
    link: "https://www.youtube.com/c/nesoacademy",
    name: "Neso Academy",
    imgLink:
      "https://yt3.ggpht.com/ytc/AMLnZu-IKrxloiUX0fNCVH6QqIjmTCSQ74CBvlotA00I=s176-c-k-c0x00ffffff-no-rj",
    numberOfSubs: 10,
    numberOfVideos: 15,
  },
  {
    link: "https://www.youtube.com/c/CodeWithHarry",
    name: "CodeWithHarry",
    imgLink:
      "https://yt3.ggpht.com/ytc/AMLnZu8dZQJYCt6Ffcd-pl113huuo_HJ3PpvgkyFk5FkrQ=s176-c-k-c0x00ffffff-no-rj",
    numberOfSubs: 10,
    numberOfVideos: 15,
  },
  {
    link: "https://www.youtube.com/c/JennyslecturesCSITNETJRF",
    name: "Jenny's lectures CS/IT NET&JRF",
    imgLink:
      "https://yt3.ggpht.com/ytc/AMLnZu_2_iLE-XxqIjRg-Ms_iEeJUP3plS3XUbfgftMOcA=s176-c-k-c0x00ffffff-no-rj",
    numberOfSubs: 10,
    numberOfVideos: 15,
  },
];

function main() {
  // Watching Url from extenal resources
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      window.location.reload();
    }
  }).observe(document, { subtree: true, childList: true });
  // antiSearch();
  anitEverything();
  clearRelated();
  clearHomepage();
  handleBookmarks();
  newVideoLoaded();
}
main();

function anitEverything() {
  const href_without_queries = window.location.href.split("?")[0];
  if (
    ![
      // "https://www.youtube.com/results",
      "https://www.youtube.com/",
      "https://m.youtube.com/",
      "https://m.youtube.com/watch",
      "https://www.youtube.com/watch",
    ].includes(href_without_queries) &&
    !channel_list.some(
      (channel_object) => href_without_queries.search(channel_object.link) > -1
    )
  ) {
    alert("You are in focus mode");
    window.location.href = "https://www.youtube.com/";
  }
}

function antiSearch() {
  const href_without_queries = window.location.href.split("?")[0];
  if (href_without_queries == "https://www.youtube.com/results") {
    alert("You are in focus mode");
    window.location.href = "https://www.youtube.com/";
  }
}

function antiShorts() {
  const beta = window.location.href.split("/")[3];
  if (beta == "shorts") {
    alert("You are in focus mode");
    window.location.href = "https://www.youtube.com/";
  }
}

async function clearRelated() {}

function clearHomepage() {
  setInterval(() => {
    const alpha = window.location.href.split("?")[0];
    if (
      alpha == "https://www.youtube.com/" ||
      alpha == "https://m.youtube.com/"
    ) {
      let element = document.getElementById("primary");
      element && (() => (element.innerHTML = Homepage()))();
    }
  }, 1000);
}

function fetchBookmarks() {
  return new Promise((resolve) => {
    chrome.storage.sync.get([currentVideo], (obj) => {
      resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
    });
  });
}
function handleBookmarks() {
  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, value, videoId } = obj;

    if (type === "NEW") {
      currentVideo = videoId;
      newVideoLoaded();
    } else if (type === "PLAY") {
      youtubePlayer.currentTime = value;
    } else if (type === "DELETE") {
      currentVideoBookmarks = currentVideoBookmarks.filter(
        (b) => b.time != value
      );
      chrome.storage.sync.set({
        [currentVideo]: JSON.stringify(currentVideoBookmarks),
      });

      response(currentVideoBookmarks);
    }
  });
}

async function addNewBookmarkEventHandler() {
  const currentTime = youtubePlayer.currentTime;
  const newBookmark = {
    time: currentTime,
    desc: "Bookmark at " + getTime(currentTime),
  };

  currentVideoBookmarks = await fetchBookmarks();

  chrome.storage.sync.set({
    [currentVideo]: JSON.stringify(
      [...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time)
    ),
  });
}

async function newVideoLoaded() {
  const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];

  currentVideoBookmarks = await fetchBookmarks();

  if (!bookmarkBtnExists) {
    const bookmarkBtn = document.createElement("img");

    bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
    bookmarkBtn.className = "ytp-button " + "bookmark-btn";
    bookmarkBtn.title = "Click to bookmark current timestamp";

    youtubeLeftControls =
      document.getElementsByClassName("ytp-left-controls")[0];
    youtubePlayer = document.getElementsByClassName("video-stream")[0];

    youtubeLeftControls.appendChild(bookmarkBtn);
    bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
  }
}

const getTime = (t) => {
  var date = new Date(0);
  date.setSeconds(t);

  return date.toISOString().substr(11, 8);
};

//
// ********************************COMPONENETS************************************* //
//

function Channel() {
  return channel_list.map((x, index) => {
    return `<div style="display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); border-bottom: 1px solid #383838; padding:24px 0;">
      <div style="grid-column: span 2 / span 2;">
          <div style="display: flex; height: 100%; align-items: center;">
              <img src=${x.imgLink} width="92px" height="92px" style="border-radius: 9999px; ">
          </div>
      </div>
      <div style="grid-column: span 8 / span 8;">
          <div style="display: flex; flex-direction: column; height: 100%; justify-content: space-evenly;">
          <div>    
          <h1 style="color:white; weight:bold;">${x.name}</h1>
          </div>
          <div>
          <h2 style="color:#A19A9C;">Subscribers ${x.numberOfSubs} • Videos ${x.numberOfVideos}</h2>
          </div>
          </div>
      </div>
      <div style="grid-column: span 2 / span 2; display:flex; align-items:center;">
        <div style="display: grid; grid-template-columns: repeat(6, minmax(0, 1fr));">
          <a href=${x.link} style="background: #CC0000; border-radius: 3px; text-decoration:none; grid-column: span 5 / span 5;">
            <h1 style="font-weight: 600; font-size: 16px; text-align: center; color: #FFFFFF; padding:10px">View Channel</h1>
          </a>
          <button style="background:transparent; border:none; cursor:pointer; grid-column: span 1 / span 1; margin-left:1rem">
        <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.63049 2.9375H10.2555C10.2555 2.5894 10.1172 2.25556 9.87107 2.00942C9.62493 1.76328 9.29109 1.625 8.94299 1.625C8.5949 1.625 8.26106 1.76328 8.01492 2.00942C7.76877 2.25556 7.63049 2.5894 7.63049 2.9375ZM6.31799 2.9375C6.31799 2.24131 6.59455 1.57363 7.08684 1.08134C7.57912 0.589062 8.2468 0.3125 8.94299 0.3125C9.63919 0.3125 10.3069 0.589062 10.7991 1.08134C11.2914 1.57363 11.568 2.24131 11.568 2.9375H16.818C16.992 2.9375 17.159 3.00664 17.282 3.12971C17.4051 3.25278 17.4742 3.4197 17.4742 3.59375C17.4742 3.7678 17.4051 3.93472 17.282 4.05779C17.159 4.18086 16.992 4.25 16.818 4.25H16.0777L14.4962 15.8499C14.3889 16.636 14.0005 17.3566 13.4027 17.8783C12.805 18.4 12.0385 18.6875 11.2451 18.6875H6.64087C5.84748 18.6875 5.08097 18.4 4.48325 17.8783C3.88553 17.3566 3.49707 16.636 3.38981 15.8499L1.80824 4.25H1.06799C0.893945 4.25 0.727025 4.18086 0.603954 4.05779C0.480884 3.93472 0.411743 3.7678 0.411743 3.59375C0.411743 3.4197 0.480884 3.25278 0.603954 3.12971C0.727025 3.00664 0.893945 2.9375 1.06799 2.9375H6.31799ZM7.63049 7.53125C7.63049 7.3572 7.56135 7.19028 7.43828 7.06721C7.31521 6.94414 7.14829 6.875 6.97424 6.875C6.80019 6.875 6.63328 6.94414 6.5102 7.06721C6.38713 7.19028 6.31799 7.3572 6.31799 7.53125V14.0938C6.31799 14.2678 6.38713 14.4347 6.5102 14.5578C6.63328 14.6809 6.80019 14.75 6.97424 14.75C7.14829 14.75 7.31521 14.6809 7.43828 14.5578C7.56135 14.4347 7.63049 14.2678 7.63049 14.0938V7.53125ZM10.9117 6.875C11.0858 6.875 11.2527 6.94414 11.3758 7.06721C11.4989 7.19028 11.568 7.3572 11.568 7.53125V14.0938C11.568 14.2678 11.4989 14.4347 11.3758 14.5578C11.2527 14.6809 11.0858 14.75 10.9117 14.75C10.7377 14.75 10.5708 14.6809 10.4477 14.5578C10.3246 14.4347 10.2555 14.2678 10.2555 14.0938V7.53125C10.2555 7.3572 10.3246 7.19028 10.4477 7.06721C10.5708 6.94414 10.7377 6.875 10.9117 6.875ZM4.69049 15.6727C4.7549 16.1443 4.98796 16.5765 5.34654 16.8895C5.70511 17.2025 6.16492 17.3749 6.64087 17.375H11.2451C11.7213 17.3753 12.1814 17.2029 12.5403 16.8899C12.8991 16.5769 13.1324 16.1445 13.1968 15.6727L14.7534 4.25H3.13256L4.69049 15.6727Z" fill="#979797"/> </svg>
        </button>
        </div>
      </div>
    </div>`;
  });
}

function Final() {
  return Channel().join("\n");
}

function Homepage() {
  return `
      <div style="display: flex; flex-direction: column; row-gap: 3rem;padding: 5%; width:90%; justify-content: center;">
        <div style="display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); width:100%; align-items: center; ">
          <h1 style="color:white; weight:bold; grid-column: span 4 / span 4; font-weight: 500; font-size: 32px;">Focus Mode</h1>
          <div style="grid-column: span 6 / span 6"></div>
          <div style="display: flex; align-items: center; grid-column: span 2 / span 2">
              <a href="#" style="border-radius: 3px; padding: 16px; text-decoration:none; width:100%; border:1px solid #FF0000">
                <h1 style="font-weight: 600; font-size: 16px; text-align: center; color: #FFFFFF;">Add Channel</h1>
              </a>
              </div>
          </div>
          <div style="display: flex; 
            justify-content: start; 
            align-items: center; 
            width: 100%; 
            color:white;" >
          <div style="display: flex; flex-direction: column; width:100%;">
            ${Final()}
          </div>
        </div>
      </div>`;
}
