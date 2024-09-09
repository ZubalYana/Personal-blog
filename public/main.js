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
                        <i class="fa-regular fa-thumbs-up"></i>
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
                    $('body').addClass('no-scroll');
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
                    <h3>Your followers:</h3>
                    <div class="followersCon">
                    </div>
                </div>
                <div class="followingsPopupStage">
                    <h3>Your followings:</h3>
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
                        $('body').removeClass('no-scroll');
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
                                    <i class="fa-regular fa-thumbs-up"></i>
                                    <i class="fa-solid fa-share-nodes"></i>
                                    <i class="fa-solid fa-pencil editPost"></i>
                                    <i class="fa-solid fa-trash-can"></i>
                                </div>
                            </div>
                            `
                        );
                    });
            
                    // Handle read more/less functionality
                    $(document).on('click', '.readMore', function(e) {
                        e.preventDefault();
                        var $this = $(this);
                        var $post = $this.closest('.post'); 
                        var $fullText = $this.siblings('.postFullText');
                        var $excerpt = $this.siblings('.postExcerpt');
                    
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

