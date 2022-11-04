import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

var localStoredData = [];

document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  } else if (e.target.className === "reply-btn") {
    handleReplyBtnClick(e);
  }
});

function handleLikeClick(tweetId) {
 localStoredData.filter(function (tweet) {
    if(tweet.uuid ===tweetId){
      if (tweet.isLiked) {
        tweet.likes--;
      } else {
        tweet.likes++;
      }
      tweet.isLiked = !tweet.isLiked;
    }
  });
  window.localStorage.setItem("tweetsData", JSON.stringify(localStoredData));
  render();
}

function handleRetweetClick(tweetId) {
  localStoredData.filter(function (tweet) {
    if(tweet.uuid === tweetId){
      if (tweet.isRetweeted) {
        tweet.retweets--;
      } else {
        tweet.retweets++;
      }
      tweet.isRetweeted = !tweet.isRetweeted;
    }
  });

  window.localStorage.setItem("tweetsData", JSON.stringify(localStoredData));
  render();
}

function handleReplyClick(replyId) {
  document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
}

function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");
  if (tweetInput.value) {
    localStoredData.unshift({
      handle: `@Scrimba`,
      profilePic: `images/scrimbalogo.png`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    });
    window.localStorage.setItem("tweetsData", JSON.stringify(localStoredData));
    render();
    tweetInput.value = "";
  }
}

function handleReplyBtnClick(e) {
  const replyText = document.getElementById(e.target.id).value;
  if (replyText) {
    const newReply = {
      handle: `@Scrimba`,
      profilePic: `images/scrimbalogo.png`,
      tweetText: replyText,
    };
    localStoredData.filter((tweet) => {
      if (tweet.uuid === e.target.id) {
        tweet.replies.unshift(newReply);
      }
    });
    window.localStorage.setItem("tweetsData", JSON.stringify(localStoredData));
    render();
  }
}

function getFeedHtml(tweetsDatas) {
  let feedHtml = ``;

  tweetsDatas.forEach(function (tweet) {
    let likeIconClass = "";

    if (tweet.isLiked) {
      likeIconClass = "liked";
    }

    let retweetIconClass = "";

    if (tweet.isRetweeted) {
      retweetIconClass = "retweeted";
    }

    let repliesHtml = "";

    if (tweet.replies.length > 0) {
      tweet.replies.forEach(function (reply) {
        repliesHtml += `
            <div class="tweet-reply">
                <div class="tweet-inner">
                    <img src="${reply.profilePic}" class="profile-pic">
                        <div>
                            <p class="handle">${reply.handle}</p>
                            <p class="tweet-text">${reply.tweetText}</p>
                        </div>
                    </div>
            </div>
`;
      });
      repliesHtml += `
      <div class="reply">
          <div class="reply-inner">
              <img src="images/scrimbalogo.png" class="profile-pic">
              <textarea placeholder="Reply something?" class="reply-input" id="${tweet.uuid}"></textarea>
          </div>
          <button class="reply-btn" id="${tweet.uuid}" data-replyId="2">Reply</button>
      </div>
          `;
    } else {
      repliesHtml = `
        <div class="reply" >
            <div class="reply-inner">
                <img src="images/scrimbalogo.png" class="profile-pic">
                <textarea placeholder="Reply something?" class="reply-input" id="${tweet.uuid}"></textarea>
            </div>
            <button class="reply-btn" id="${tweet.uuid}" data-replyId="22">Reply</button>
        </div>
            `;
    }

    feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail" >
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail" >
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail" >
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`;
  });
  return feedHtml;
}

function render() {
  if (window.localStorage.getItem("tweetsData")) {
    localStoredData = JSON.parse(window.localStorage.getItem("tweetsData"));
    document.getElementById("feed").innerHTML = getFeedHtml(localStoredData);
  } else {
    localStoredData = tweetsData;
    document.getElementById("feed").innerHTML = getFeedHtml(localStoredData);
    window.localStorage.setItem("tweetsData", JSON.stringify(localStoredData));
  }
}

render();
