//pages changing
$('.home').click(() => {
    $('.mainPage').css('display', 'flex');
    $('.blogPage').css('display', 'none');
    $('.helpPage').css('display', 'none');
    
});
$('.blog').click(() => {
    $('.mainPage').css('display', 'none');
    $('.blogPage').css('display', 'flex');
    $('.helpPage').css('display', 'none');
});
$('.help').click(() => {
    $('.mainPage').css('display', 'none');
    $('.blogPage').css('display', 'none');
    $('.helpPage').css('display', 'flex');
});

//compass animation
$('.helpCompass').css('transform', 'rotate(0deg)');
$('.helpCompass').hover(
    function() {
        $(this).css('transform', 'rotate(-50deg)');
    }, 
    function() {
        $(this).css('transform', 'rotate(0deg)');
    }
);
$('.helpCompass').click(function() {
     var $this = $(this);
    $this.css('transition', 'transform 0.1s ease');
    $this.css('transform', 'rotate(-300deg)');
    setTimeout(function() {
        $this.css('transform', 'rotate(-200deg)');
        setTimeout(function() {
            $this.css('transform', 'rotate(-250deg)');
            setTimeout(function() {
                $this.css('transform', 'rotate(-220deg)');
                setTimeout(function() {
                    $this.css('transition', 'transform 0.3s ease');
                    $this.css('transform', 'rotate(-50deg)');
                }, 100);
            }, 100);
        }, 100);
    }, 100);
});

//icons hover effects
$('.icon').hover(
            function() {
                $(this).css('color', '#4F6F52');
            }, 
            function() {
                $(this).css('color', '#45474B');
            }
);
$('.iconWhite').hover(
            function() {
                $(this).css('color', '#4F6F52');
            }, 
            function() {
                $(this).css('color', '#fff');
            }
);

//user profile opening
$('.profileIcon').click(() => {
    $.ajax({
        url: '/auth/user',
        type: 'GET',
        success: function(response) {
            window.location.href = '/user';
        },
        error: function(xhr) {
            if (xhr.status === 401) {
                window.location.href = '/auth';
            } else {
                console.error('An error occurred:', xhr.responseText);
            }
        }
    });
});

//registration redirect
$('#discover').click(() => {
    window.location.href = '/auth';
});

//about button scroll animation
$(document).ready(function() {
    $('#aboutBlog').click(function() {
        $('html, body').animate({
            scrollTop: $('.howToUse').offset().top
        }, 1000);
    });
});

//get and display all the posts
axios.get('/api/getPosts')
    .then((res) => {
        console.log(res.data);
        for (let post of res.data) {
            const formattedDate = moment(post.date).fromNow();
            const profilePic = (post.author && post.author.profilePicture) ? post.author.profilePicture : './materials/profile pic default.png';
            const authorName = post.author ? `${post.author.firstname} ${post.author.lastName}` : 'Unknown Author';
            const postPic = post.pic && post.pic !== '' ? post.pic : './materials/post pic default.png';
            console.log(post.author)
            $('.postsContainer').prepend(
                `
                <div class="post" data-post='${JSON.stringify(post)}'>
                    <div class="top">
                        <div class="author">
                        <div class="authorHendler" style="display: flex; align-items: center; cursor: pointer;">
                            <img class="author_pic" src="${profilePic}" alt="Profile Picture">
                            <p class="author_name">${authorName}</p>
                        </div>
                            <div class="dot"></div>
                            <p class="follow" data-user-id="${post.author._id}">follow</p>
                        </div>
                        <p class="time">${formattedDate}</p>
                    </div>
                    <img class="postImg" src="${postPic}" alt="Post Image" onerror="this.onerror=null; this.src='./materials/post pic default.png';">
                    <h3 class="postTitle">${post.title}</h3>
                    <div class="postText">
                        <span class="postExcerpt">${post.body.substring(0, 80)}</span>
                        <span class="postFullText" style="display: none;">${post.body.substring(80, 500)}</span>
                        <a href="#" class="readMore">Read More</a>
                    </div>
                    <p class="postHashtags">${post.hashtags}</p>
                    <div class="actions">
                        <div class="likesAmount">${post.likes.length}</div>
<svg class="likePost" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" data-liked="false">
<path d="M18.9727 0.186195C16.7344 -0.54342 14.3965 0.935891 13.7578 3.49289L13.4238 4.83163C13.207 5.70182 12.8145 6.50506 12.2812 7.17443L9.27539 10.9497C8.75391 11.6057 8.79492 12.6231 9.36914 13.2189C9.94336 13.8146 10.834 13.7677 11.3555 13.1118L14.3613 9.3365C15.1875 8.29898 15.791 7.06064 16.125 5.7152L16.459 4.37646C16.6699 3.52636 17.4492 3.03102 18.1992 3.272C18.9492 3.51297 19.377 4.40323 19.166 5.26003L18.832 6.59877C18.498 7.93082 17.9707 9.18924 17.2734 10.3138C16.9688 10.8024 16.9336 11.445 17.1738 11.9805C17.4141 12.516 17.8945 12.8507 18.4219 12.8507H26.25C26.7656 12.8507 27.1875 13.3327 27.1875 13.9217C27.1875 14.3769 26.9355 14.7718 26.5781 14.9258C26.1445 15.1132 25.8164 15.5282 25.7051 16.0436C25.5938 16.559 25.7109 17.1012 26.0156 17.4961C26.1621 17.6836 26.25 17.9312 26.25 18.2057C26.25 18.7278 25.9219 19.1629 25.4883 19.2566C25.0078 19.3637 24.6035 19.7452 24.4336 20.274C24.2637 20.8028 24.3398 21.3919 24.6445 21.8337C24.7676 22.0144 24.8438 22.242 24.8438 22.4963C24.8438 22.9448 24.5977 23.3398 24.2461 23.4937C23.5723 23.7949 23.209 24.6249 23.4023 25.4215C23.4258 25.5085 23.4375 25.6089 23.4375 25.7093C23.4375 26.2984 23.0156 26.7803 22.5 26.7803H16.7871C16.0488 26.7803 15.3223 26.5327 14.707 26.0641L11.0918 23.313C10.4473 22.8176 9.57422 23.0185 9.14062 23.7615C8.70703 24.5045 8.88281 25.4951 9.5332 25.9905L13.1484 28.7416C14.2266 29.5649 15.4922 30 16.7871 30H22.5C24.5332 30 26.1855 28.1525 26.25 25.8499C27.1055 25.0667 27.6562 23.8619 27.6562 22.503C27.6562 22.2018 27.627 21.914 27.5801 21.6329C28.4824 20.8497 29.0625 19.6114 29.0625 18.2191C29.0625 17.784 29.0039 17.3623 28.8984 16.9673C29.5781 16.1775 30 15.1065 30 13.9217C30 11.5588 28.3242 9.63772 26.25 9.63772H20.8418C21.1172 8.94157 21.3516 8.21865 21.5332 7.48234L21.8672 6.1436C22.5059 3.5866 21.2109 0.91581 18.9727 0.186195ZM1.875 10.7087C0.837891 10.7087 0 11.6659 0 12.8507V27.8446C0 29.0294 0.837891 29.9866 1.875 29.9866H5.625C6.66211 29.9866 7.5 29.0294 7.5 27.8446V12.8507C7.5 11.6659 6.66211 10.7087 5.625 10.7087H1.875Z" fill="#45474B"/>
</svg>

                        <i class="fa-solid fa-share-nodes"></i>
                    </div>
                </div>
                `
            );
            
            
        }

        //following checking
        $('.follow').each(function() {
            const userId = $(this).data('user-id');
            axios.get(`/api/checkFollow/${userId}`)
                .then((response) => {
                    if (response.data.isFollowing) {
                        $(this).text('following');
                        $(this).css('color', '#1A4D2E')
                        $(this).css('font-weight', '500')
                    }
                })
                .catch((error) => {
                    console.error('Error checking follow status:', error);
                });
        });

        //following logic
        $('.follow').click(function() {
            axios.get('/auth/user')
                .then(res => {
                    const postData = $(this).closest('.post').data('post');
                    const userToFollow = postData.author._id;
                    console.log(userToFollow)
                    const userWhoFollows = res.data._id;
                    console.log(userWhoFollows)
                    if (userToFollow === userWhoFollows) {
                        alert('You can\'t follow yourself, dude!');
                    }
        
                    if ($(this).text() === 'follow') {
                        axios.post(`/api/follow/${userToFollow}`)
                            .then(() => {
                                $(this).text('following');
                                $(this).css('color', '#1A4D2E')
                                $(this).css('font-weight', '500')
                            })
                            .catch((err) => {
                                console.error('Error following user:', err);
                            });
                    } else {
                        axios.post(`/api/unfollow/${userToFollow}`)
                            .then(() => {
                                $(this).text('follow');
                                $(this).css('color', '#45474B')
                                $(this).css('font-weight', '400')
                            })
                            .catch((err) => {
                                console.error('Error unfollowing user:', err);
                            });
                    }
                    
                });
        });

        //reading more/less
        $(document).on('click', '.readMore', function(e) {
            e.preventDefault();
            let $this = $(this);
            let $post = $this.closest('.post'); 
            let $fullText = $this.siblings('.postFullText');
            let $excerpt = $this.siblings('.postExcerpt');
        
            $fullText.slideToggle(); 
            $excerpt.show(); 
            $this.text($this.text() === 'Read More' ? 'Read Less' : 'Read More'); 
        
            if ($this.text() === 'Read Less') {
                $post.css('height', 'auto'); 
            } else {
                $post.css('height', '521px'); 
            }
        });
        
        //displaying the post's author profile
        $(document).on('click', '.authorHendler', function(e) {
            e.preventDefault();
            e.stopPropagation();
        
            const postData = $(this).closest('.post').data('post');
            const targetUserId = postData.author._id;
        
        
            $.ajax({
                url: `/auth/user/${targetUserId}`,
                type: 'GET',
                success: function(targetUser) {
                    $('.wrap').addClass('no-scroll');
                    console.log(targetUser)
                    $('.userProfilePopup').css('display', 'flex');
                    $('.userProfilePopup').html(
                        `
                        <div class="user">
                            <i class="fa-solid fa-chevron-left backToMainArrow"></i>
                            <!-- User Info -->
                            <div class="userInfo">
                                <img class="userPicture" src="/${targetUser.profilePicture}" alt="profile picture">
                                <h2 class="FistLastName">${targetUser.firstname} ${targetUser.lastName}</h2>
                                <p class="email">${targetUser.email}</p>
                                <p class="description">${targetUser.profileDescription}</p>
                                <span class="placesVisited">Visited: <p class='visitedPlaces'>${targetUser.placesVisited}</p></span>
                                <span class="placesToVisit">Wants to visit: <p class='toVisitPlaces' >${targetUser.placesToVisit}</p></span>
                                <div class="followings">
                                    <div class="following" id="followersCon">
                                        <span class="amount">${targetUser.followers.length}</span>
                                        <span class="following_text">followers</span>
                                    </div>
                                    <div class="following" id="followingsCon">
                                        <span class="amount">${targetUser.followings.length}</span>
                                        <span class="following_text">followings</span>
                                    </div>
                                </div>
                            </div>
                            <!-- User Posts -->
                            <div class="posts">
                                <div class="postsChanging">
                                    <div class="publishedPosts">Published posts</div>
                                    <div class="likedPosts">Liked posts</div>
                                </div>
                                <div class="userPostsContainer"></div>
                                <div class="likedPostsContainer" style="display: none;"></div>
                            </div>
                        </div>
                                <div class="followingsPopupContainer">
            <div class="followingsPopup">
                <i class="fa-solid fa-xmark" id="followingXmark"></i>
                <div class="followers">
                    <h3>${targetUser.firstname}'s followers:</h3>
                    <div class="followersCon">
                    </div>
                </div>
                <div class="followingsPopupStage">
                    <h3>${targetUser.firstname}'s followings:</h3>
                    <div class="showFollowingsCon">
                    </div>
                </div>
            </div>
        </div>  
                        `
                    );

                    //main page opening and closing the popup
                    $('.backToMainArrow').click(()=>{
                        $('.userProfilePopup').css('display', 'none');
                        $('.wrap').removeClass('no-scroll');
                    })

                    // User's posts/liked posts toggling
                    $('.likedPosts').click(() => {
                        $('.likedPostsContainer').css('display', 'flex');
                        $('.postsContainer').css('display', 'none');
                        $('.likedPosts').css('background-color', '#1A4D2E').css('color', '#fff');
                        $('.publishedPosts').css('background-color', '#fff').css('color', '#1A4D2E');
                    });

                    $('.publishedPosts').click(() => {
                        $('.likedPostsContainer').css('display', 'none');
                        $('.postsContainer').css('display', 'flex');
                        $('.likedPosts').css('background-color', '#fff').css('color', '#1A4D2E');
                        $('.publishedPosts').css('background-color', '#1A4D2E').css('color', '#fff');
                    });
        
                    // Load followers and followings
                    async function loadFollowers(followers) {
                        try {
                            const response = await fetch('/api/getUsersByIds', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ ids: followers })
                            });
                            const followersData = await response.json();
                            for (let follower of followersData) {
                                $('.followersCon').append(
                                    `
                                    <div class="follower" data-id="${follower._id}">
                                        <img class="followerPic" src="${follower.profilePicture}" alt="${follower.firstname} ${follower.lastName}">
                                        <div class="followerName">${follower.firstname} ${follower.lastName}</div>
                                    </div>
                                    `
                                );
                            }
                        } catch (error) {
                            console.error('Error loading followers:', error);
                        }
                    }
                    async function loadFollowings(followings) {
                        try {
                            const response = await fetch('/api/getUsersByIds', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ ids: followings })
                            });
        
                            const followingsData = await response.json();
        
                            for (let following of followingsData) {
                                $('.showFollowingsCon').prepend(
                                    `
                                    <div class="following" data-id="${following._id}">
                                        <img class="followingPic" src="${following.profilePicture}" alt="${following.firstname} ${following.lastName}">
                                        <div class="followingName">${following.firstname} ${following.lastName}</div>
                                    </div>
                                    `
                                );
                            }
                        } catch (error) {
                            console.error('Error loading followings:', error);
                        }
                    }
                    loadFollowers(targetUser.followers);
                    loadFollowings(targetUser.followings);
        
                    // Followers and followings views
                    $(document).on('click', '#followersCon', function() {
                        $('.followingsPopupContainer').css('display', 'flex');
                        $('.followers').css('display', 'flex');
                        $('.followingsPopupStage').css('display', 'none');
                    });
                    $(document).on('click', '#followingsCon', function() {
                        $('.followingsPopupContainer').css('display', 'flex');
                        $('.followers').css('display', 'none');
                        $('.followingsPopupStage').css('display', 'flex');
                    });
                    $('#followingXmark').click(() => {
                        $('.followingsPopupContainer').css('display', 'none');
                    });
                },
                error: function(xhr) {
                    console.error('Error fetching user data:', xhr.responseText);
                }
            });
            $.ajax({
                url: `/api/userPosts?userId=${targetUserId}`,
                method: 'GET',
                success: function(posts) {
                    $('.userPostsContainer').empty();
                    console.log('Author element clicked:', targetUserId);
                
                    posts.forEach(post => {
                        const formattedDate = moment(post.date).fromNow();
                        $('.userPostsContainer').prepend(
                            `
                            <div class="post" data-id="${post._id}">
                                <div class="top">
                                    <div class="author">
                                        <img class="author_pic" src="${post.author.profilePicture}" alt="">
                                        <p class="author_name">${post.author.firstname} ${post.author.lastName}</p>
                                    </div>
                                    <p class="time">${formattedDate}</p>
                                </div>
                                <img class="postImg" src="${post.pic}" alt="">
                                <h3 class="postTitle">${post.title}</h3>
                                <div class="postText">
                                    <span class="postExcerpt">${post.body.substring(0, 80)}</span>
                                    <span class="postFullText" style="display: none;">${post.body.substring(80, 500)}</span>
                                    <a href="#" class="readMore">Read More</a>
                                </div>
                                <p class="postHashtags">${post.hashtags}</p>
                                <div class="actions">
                                    <i class="fa-regular fa-thumbs-up likePost"></i>
                                    <i class="fa-solid fa-share-nodes"></i>
                                </div>
                            </div>
                            `
                        );
                    });
            
                    // Handle read more/less functionality
                    $(document).on('click', '.readMore', function(e) {
                        e.preventDefault();
                        let $this = $(this);
                        let $post = $this.closest('.post'); 
                        let $fullText = $this.siblings('.postFullText');
                        let $excerpt = $this.siblings('.postExcerpt');
                    
                        $fullText.slideToggle(); 
                        $excerpt.show(); 
                        $this.text($this.text() === 'Read More' ? 'Read Less' : 'Read More'); 
                    
                        if ($this.text() === 'Read Less') {
                            $post.css('height', 'auto'); 
                        } else {
                            $post.css('height', '521px'); 
                        }
                    });
                },
                error: function(error) {
                    console.error('Error fetching user posts:', error);
                }
            });
            
        });

        //posts liking
        $(document).on('click', '.likePost', function () {
            const postData = $(this).closest('.post').data('post');
            const postId = postData._id;
            const $likeIcon = $(this);
            const $likeAmount = $likeIcon.siblings('.likesAmount');
            const isLiked = $likeIcon.data('liked') === 'true';
            const endpoint = isLiked ? '/api/unlikePost' : '/api/likePost';
            axios.post(endpoint, { postId })
                .then((response) => {
                    const updatedLikes = response.data.likesCount;
                    $likeAmount.text(updatedLikes);
                    if (isLiked) {
                        $likeIcon.css('fill', 'none');
                        $likeIcon.data('liked', 'false');
                    } else {
                        $likeIcon.css('fill', '#1A4D2E');
                        $likeIcon.data('liked', 'true');
                    }
                })
                .catch((error) => {
                    console.error('Error liking/unliking post:', error);
                });
        });
        

                  
    })
    .catch((err) => {
        console.error('Error fetching posts:', err);
    });

//camera screen cards animations
$('#cameraPhoto1').click(function() {
    $(this).css('transform', 'rotate(0deg)');
    $(this).css('top', '-150px');
    $(this).css('left', '130px');
setTimeout(() => {
        $(this).css('transform', 'rotate(-40deg)');
        $(this).css('top', '20px');
        $(this).css('left', '300px');
}, 2000);

});
$('#cameraPhoto2').click(function() {
    $(this).css('transform', 'rotate(0deg)');
    $(this).css('top', '-100px');
    $(this).css('left', '60px');
setTimeout(() => {
        $(this).css('transform', 'rotate(-67deg)');
        $(this).css('top', '70px');
        $(this).css('left', '290px');
}, 2000);

});
$('#cameraPhoto3').click(function() {
    $(this).css('transform', 'rotate(0deg)');
    $(this).css('top', '-170px');
    $(this).css('left', '910px');
setTimeout(() => {
        $(this).css('transform', 'rotate(40deg)');
        $(this).css('top', '40px');
        $(this).css('left', '830px');
}, 2000);

});

//settings
$('#gear').click(()=>{
    $('.settingsCon').css('display', 'flex')
    $('#settingsXMark').click(()=>{
        $('.settingsCon').css('display', 'none')
    })
})

