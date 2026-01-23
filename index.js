import { tweetsData as defaultTweets } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

let tweetsData = localStorage.getItem('tweetsData') ? JSON.parse( localStorage.getItem('tweetsData')): defaultTweets




document.addEventListener('click', function(e){
  if (e.target.dataset.like){
    handleLikeClick(e.target.dataset.like)
  }
   else if(e.target.dataset.retweet){
    handleRetweetClick(e.target.dataset.retweet)
  } else if(e.target.dataset.comment){
        handleReplyClick(e.target.dataset.comment)
    }else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }else if (e.target.dataset.reply){
           handleReplyBtnClick(e.target.dataset.reply)
    }else if(e.target.dataset.delete){
           handleDeleteBtnClick(e.target.dataset.delete)
    }
})


function getFeedHtml(){
    let feedHtml = ''
    tweetsData.forEach(function(tweet){

        const likeIconClass = tweet.isLiked ? 'liked' : ''
        
        const retweetIconClass = tweet.isRetweeted ? 'retweeted' : ''

        let repliesHtml = ''
        if(tweet.replies.length>0){
            tweet.replies.forEach(function(reply){
                repliesHtml += `
                            <div class="tweet-reply">
                                    <div class="tweet-inner">
                                        <img src="${reply.profilePic}" class="profile-pic">
                                            <div>
                                                <p class="handle">${reply.handle}}</p>
                                                <p class="tweet-text">${reply.tweetText}</p>
                                            </div>
                                    </div>
                            </div>
            `
            })
        }
        feedHtml +=`
                <div class="tweet">
                    <div class="tweet-inner">
                        <img src="${tweet.profilePic}" alt="" class="profile-pic">
                        <div>
                            <p class="handle">${tweet.handle}</p>
                            <p class="tweet-text">${tweet.tweetText}</p>
                            <div class="tweet-details">
                                <span class="tweet-detail">
                                    <i class="fa-regular fa-comment-dots" data-comment="${tweet.uuid}"></i>        
                                    ${tweet.replies.length}
                                </span>

                                <span class="tweet-detail">
                                    <i class="fa-solid fa-heart ${likeIconClass}" data-like="${tweet.uuid}"></i>
                                    ${tweet.likes}
                                </span>

                                <span class="tweet-detail">
                                    <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweet.uuid}"></i>                        
                                    ${tweet.retweets}
                                </span>
                            </div>
                        </div>
                        <button class="delete-btn" data-delete="${tweet.uuid}">Delete</button>
                    </div>
                        <div class="hidden" id="replies-${tweet.uuid}">${repliesHtml}</div>  
                </div>
        `
    })
return feedHtml
}


function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()


function handleLikeClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0];
    if(targetTweetObj.isLiked){
        targetTweetObj.likes--
    }else{
            targetTweetObj.likes++
    }
            targetTweetObj.isLiked = !targetTweetObj.isLiked
            localStorage.setItem("tweetsData", JSON.stringify(tweetsData))
    render()
}

function handleRetweetClick(tweetId){
const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0];
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }else{
            targetTweetObj.retweets++
    }
            targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
            localStorage.setItem("tweetsData", JSON.stringify(tweetsData))
    render()
}

function handleReplyClick(replyId){
   let replyHtml = document.getElementById(`replies-${replyId}`)
   replyHtml.classList.toggle('hidden')
    replyHtml.innerHTML += `
      <div class="tweet-reply">
      <textarea id="reply-input" class="reply-input" placeholder="post your reply"></textarea>
      <button class="reply-btn" id="reply-btn" data-reply=${replyId}>Reply</button>
      </div>
    `
}

function handleTweetBtnClick(){
const tweetInput = document.getElementById('tweet-input')
    if(tweetInput.value){
    tweetsData.unshift({ 
                handle: `@Scrimba`,
                profilePic: `images/scrimbalogo.png`,
                likes: 0,
                retweets: 0,
                tweetText: tweetInput.value,
                replies: [],
                isLiked: false,
                isRetweeted: false,
                uuid: uuidv4(),
            })
            render()
            localStorage.setItem("tweetsData", JSON.stringify(tweetsData))
            tweetInput.value = ''
        }
}

function handleReplyBtnClick(replyId){
    let replyInput = document.getElementById('reply-input')

    const targetTweetObj = tweetsData.filter(function(tweet){
         return tweet.uuid === replyId
    })[0]
    if(replyInput.value){
            targetTweetObj.replies.push({
                handle: `@Scrimba`,
                profilePic: `images/scrimbalogo.png`,
                tweetText: replyInput.value,
            })
    }render()
    localStorage.setItem("tweetsData", JSON.stringify(tweetsData))
}


function handleDeleteBtnClick(tweetId){
     tweetsData =  tweetsData.filter(function(tweet){
         return tweet.uuid != tweetId
      })
      render()
}
