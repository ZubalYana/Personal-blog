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

let userId;
//get user ID for liked posts
axios.get('/auth/user')
    .then((res) => {
        userId = res.data._id
        console.log(userId)
    })
    .catch((err) => {
        console.error('Error fetching user ID:', err);
    });


//get and display all the posts
axios.get('/api/getPosts')
.then((res) => {

    //posts display and pagination
    const posts = res.data.reverse();
    const postsPerPage = 12;
    const totalPages = Math.ceil(posts.length / postsPerPage);
    let currentPage = 1;
    function renderPosts(page = 1) {
        const start = (page - 1) * postsPerPage;
        const end = start + postsPerPage;
        const postsToDisplay = posts.slice(start, end);

        $('.postsContainer').empty();
        postsToDisplay.forEach(post => {
            const isLiked = post.likes.includes(userId);
            const likeClass = isLiked ? 'fa-solid fa-thumbs-up liked' : 'fa-regular fa-thumbs-up';
            const formattedDate = moment(post.date).fromNow();
            const profilePic = post.author?.profilePicture || './materials/profile pic default.png';
            const authorName = post.author ? `${post.author.firstname} ${post.author.lastName}` : 'Unknown Author';
            const postPic = post.pic || './materials/post pic default.png';

            $('.postsContainer').append(`
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
                    <img class="postImg" src="${postPic}" alt="Post Image">
                    <h3 class="postTitle">${post.title}</h3>
                    <div class="postText">
                        <span class="postExcerpt">${post.body.substring(0, 80)}</span>
                        <span class="postFullText" style="display: none;">${post.body.substring(80, 500)}</span>
                        <a href="#" class="readMore">Read More</a>
                    </div>
                    <p class="postHashtags">${post.hashtags}</p>
                    <div class="actions">
                        <div class="likesAmount">${post.likes.length}</div>
                        <i class="likePost ${likeClass}" data-liked="${isLiked}"></i>
                        <i class="fa-solid fa-share-nodes"></i>
                    </div>
                </div>
            `);
        });
    }
    function setupPagination(totalPages) {
        const pagination = document.createElement('div');
        pagination.classList.add('pagination');

        for (let i = 1; i <= totalPages; i++) {
            const page = document.createElement('div');
            page.classList.add('page');
            page.textContent = i;
            page.addEventListener('click', () => {
                currentPage = i;
                renderPosts(currentPage);
            });
            pagination.appendChild(page);
        }
        $('.postsContainer').after(pagination);
    }
    renderPosts();
    if (totalPages > 1) {
        setupPagination(totalPages);
    }

    //active page showing
    $('.page').each(function() {
        if ($(this).text() === '1') {
            $(this).addClass('active');
        }
    });
    $('.page').click(function() {
        $('.page').removeClass('active');
        $(this).addClass('active');
    })

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
                url: `/api/userPosts?userId=${targetUserId}`,
                method: 'GET',
                success: function(posts) {
                    $('.userPostsContainer').empty();
                    console.log('Author element clicked:', targetUserId);
                
                    posts.forEach(post => {
                        const formattedDate = moment(post.date).fromNow();
                        const isLiked = post.likes.includes(userId); 
                        const likeClass = isLiked ? 'fa-solid fa-thumbs-up liked' : 'fa-regular fa-thumbs-up';
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
                                    <div class="likesAmount">${post.likes.length}</div>
                                    <i class="likeTargetUserPost ${likeClass}" data-liked="${isLiked}" data-post-id="${post._id}"></i>
                                    <i class="fa-solid fa-share-nodes"></i>
                                </div>
                            </div>
                            `
                        );
                    });

                    //liking/unliking
                    $(document).on('click', '.likeTargetUserPost', function () {
                        const postData = $(this).closest('.post').data();
                        const postId = postData.id;
                        const isLiked = $(this).data('liked');
                        const likeApiUrl = isLiked ? '/api/unlikePost' : '/api/likePost';
                        const likePostElement = $(this);
                    
                        axios.post(likeApiUrl, { postId })
                            .then(response => {
                                const newLikeClass = isLiked ? 'fa-regular fa-thumbs-up' : 'fa-solid fa-thumbs-up liked';
                                likePostElement.attr('class', `likePost ${newLikeClass}`);
                                likePostElement.data('liked', !isLiked);
                                likePostElement.siblings('.likesAmount').text(response.data.likesCount);
                            })
                            .catch(error => {
                                console.error('Error while liking/unliking the post:', error);
                            });
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
            $.ajax({
                url: `/auth/user/${targetUserId}`,
                type: 'GET',
                success: function(targetUser) {
                    $('.userPostsContainer').empty();
                    $('.wrap').addClass('no-scroll');
                    console.log(targetUser)
                    $('.userProfilePopup').css('display', 'flex');

                    //check wheather the user is followed 
                    axios.get(`/api/checkFollow/${targetUserId}`)
                    .then((response) => {
                        const followBtn = $('.followBtn');
                        if (response.data.isFollowing) {
                            followBtn.text('following').css({
                                color: '#1A4D2E',
                                fontWeight: '600'
                            });
                        } else {
                            followBtn.text('follow').css({
                                color: '#45474B',
                                fontWeight: '400'
                            });
                        }
                    })
                    .catch((error) => {
                        console.error('Error checking follow status:', error);
                    });
                    
                    //populating the user profile
                    $('.userProfilePopup').html(
                        `
                        <div class="user">
                            <i class="fa-solid fa-chevron-left backToMainArrow"></i>
                            <!-- User Info -->
                            <div class="userInfo">
                                <img class="userPicture" src="/${targetUser.profilePicture}" alt="profile picture">
                                <div class="nameAndFollow">
                                    <h2 class="FistLastName">${targetUser.firstname} ${targetUser.lastName}</h2>
                                    <div class="round"></div>
                                    <div class="followBtn"></div>
                                </div>
                                <p class="email">${targetUser.email}</p>
                                <p class="description">${targetUser.profileDescription}</p>
                                <span class="placesVisited">Visited: <p class='visitedPlaces'>${targetUser.placesVisited}</p></span>
                                <span class="placesToVisit">Wants to visit: <p class='toVisitPlaces' >${targetUser.placesToVisit}</p></span>
                                <div class="followings">
                                    <div class="following" id="followersCon">
                                        <span class="amount" id="followerCountValue">${targetUser.followers.length}</span>
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

                    //following/unfollowing directly inside the user profile
                    $('.followBtn').click(function () {
                        axios.get('/auth/user')
                            .then((authRes) => {
                                const userWhoFollows = authRes.data._id;
                    
                                if (userWhoFollows === targetUserId) {
                                    alert('You cannot follow yourself!');
                                    return;
                                }
                    
                                const followAction = $(this).text() === 'follow' ? 'follow' : 'unfollow';
                                axios.post(`/api/${followAction}/${targetUserId}`)
                                    .then(() => {
                                        if (followAction === 'follow') {
                                            $(this).text('following').css({
                                                color: '#1A4D2E',
                                                fontWeight: '500'
                                            });
                                            const currentCount = parseInt($('#followerCountValue').text(), 10);
                                            $('#followerCountValue').text(currentCount + 1);
                    
                                        } else {
                                            $(this).text('follow').css({
                                                color: '#45474B',
                                                fontWeight: '400'
                                            });
                                            const currentCount = parseInt($('#followerCountValue').text(), 10);
                                            $('#followerCountValue').text(currentCount - 1);
                                        }
                                    })
                                    .catch((error) => {
                                        console.error(`Error ${followAction}ing user:`, error);
                                    });
                            })
                            .catch((error) => {
                                console.error('Error fetching current user:', error);
                            });
                    });

                    //get and display all the target user's liked posts
                    $.ajax({
                        url: `/api/userLikedPosts/${targetUserId}`,
                        type: 'GET',
                        success: function(res) {

                            console.log(res)
                            $('.likedPostsContainer').empty();
                            res.forEach(post => {
                                console.log(post)
                                const formattedDate = moment(post.date).fromNow();
                                const isLiked = post.likes.includes(userId); 
                                const likeClass = isLiked ? 'fa-solid fa-thumbs-up liked' : 'fa-regular fa-thumbs-up';
                                $('.likedPostsContainer').prepend(
                                    `
                                    <div class="post" data-post='${JSON.stringify(post)}'>
                                        <div class="top">
                                            <div class="author">
                                                <img class="author_pic" src="${post.author?.profilePicture || '.materials/profile pic default.png'}" alt="Profile Picture">
                                                <p class="author_name">${post.author.firstname} ${post.author.lastName}</p>
                                            </div>
                                            <p class="time">${formattedDate}</p>
                                        </div>
                                        <img class="postImg" src="${post.pic || '.materials/post pic default.png'}" alt="Post Image">
                                        <h3 class="postTitle">${post.title}</h3>
                                        <div class="postText">
                                            <span class="postExcerpt">${post.body.substring(0, 80)}</span>
                                            <span class="postFullText" style="display: none;">${post.body.substring(80, 500)}</span>
                                            <a href="#" class="readMore">Read More</a>
                                        </div>
                                        <p class="postHashtags">${post.hashtags}</p>
                                        <div class="actions">
                                            <div class="likesAmount">${post.likes.length}</div>
                                            <i class="likePost ${likeClass}" data-liked="${isLiked}" data-post-id="${post._id}"></i>
                                            <i class="fa-solid fa-share-nodes"></i>
                                        </div>
                                    </div>
                                    `
                                );
                            });
            
                            //liking/unliking
                            $(document).on('click', '.likePost', function () {
                                const postData = $(this).closest('.post').data('post');
                                const postId = postData._id;
                                const isLiked = $(this).data('liked');
                                const likeApiUrl = isLiked ? '/api/unlikePost' : '/api/likePost';
                                const likePostElement = $(this);
                            
                                axios.post(likeApiUrl, { postId })
                                    .then(response => {
                                        const newLikeClass = isLiked ? 'fa-regular fa-thumbs-up' : 'fa-solid fa-thumbs-up liked';
                                        likePostElement.attr('class', `likePost ${newLikeClass}`);
                                        likePostElement.data('liked', !isLiked);
                                        likePostElement.siblings('.likesAmount').text(response.data.likesCount);
                                    })
                                    .catch(error => {
                                        console.error('Error while liking/unliking the post:', error);
                                    });
                            });
                        },
                        error: function(error) {
                            console.error('Error fetching user liked posts:', error);
                        }
                    });

                    //main page opening and closing the popup
                    $('.backToMainArrow').click(()=>{
                        $('.userProfilePopup').css('display', 'none');
                        $('.wrap').removeClass('no-scroll');
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
                    })

                    //user's posts/liked posts toggling
                    function switchTab(activeTab, inactiveTab, showContainer, hideContainer) {
                        activeTab.addClass('active');
                        inactiveTab.removeClass('active');
                        showContainer.show();
                        hideContainer.hide();
                    }
        
                    // Initial active state
                    $('.publishedPosts').addClass('active');
        
                    // Event listeners for tab switching
                    $('.likedPosts').click(() => {
                        switchTab(
                            $('.likedPosts'),
                            $('.publishedPosts'),
                            $('.likedPostsContainer'),
                            $('.userPostsContainer')
                        );
                    });
                    $('.publishedPosts').click(() => {
                        switchTab(
                            $('.publishedPosts'),
                            $('.likedPosts'),
                            $('.userPostsContainer'),
                            $('.likedPostsContainer')
                        );
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
            
        });

        //posts liking
        $(document).on('click', '.likePost', function () {
            const postData = $(this).closest('.post').data('post');
            const postId = postData._id;
            const isLiked = $(this).data('liked');
            const likeApiUrl = isLiked ? '/api/unlikePost' : '/api/likePost';
            const likePostElement = $(this);
        
            axios.post(likeApiUrl, { postId })
                .then(response => {
                    const newLikeClass = isLiked ? 'fa-regular fa-thumbs-up' : 'fa-solid fa-thumbs-up liked';
                    likePostElement.attr('class', `likePost ${newLikeClass}`);
                    likePostElement.data('liked', !isLiked);
                    likePostElement.siblings('.likesAmount').text(response.data.likesCount);
                })
                .catch(error => {
                    console.error('Error while liking/unliking the post:', error);
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

//settings popup logic
$('.gear').click(() => {
    $('.settingsCon').css('display', 'flex');
    $('#settingsXMark').click(() => {
        $('.settingsCon').css('display', 'none');
    });
});

//theme changing
$(document).ready(function() {
    let theme = localStorage.getItem('theme') || 'light';
    applyTheme(theme);

    $('.themeChanger').click(function(){
        theme = (theme === 'light') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        applyTheme(theme);
    });

    function applyTheme(theme){
        console.log("Applying theme:", theme); 
        if(theme === 'light'){
            $('body').removeClass('dark-theme').addClass('light-theme');
            $('.themeChanger').text('light');
            $('.greetingBottom').attr('src', './materials/greeting screen bottom decoration.png');
            $('.futerTop').attr('src', './materials/greeting screen bottom decoration.png');
            $('#usageArrow1').attr('src', './materials/how to use arrow 1.png');
            $('#usageArrow2').attr('src', './materials/how to use arrow 2.png');
            $('#usageArrow3').attr('src', './materials/how to use arrow 3.png');
            $('.camera').attr('src', './materials/camera.png');
            $('.helpArrow').attr('src', './materials/help arrow.png');

        } else {
            $('body').removeClass('light-theme').addClass('dark-theme');
            $('.themeChanger').text('dark');
            $('.greetingBottom').attr('src', './materials/greeting screen bottom decoration dark.png');
            $('.futerTop').attr('src', './materials/greeting screen bottom decoration dark.png');
            $('#usageArrow1').attr('src', './materials/how to use arrow 1 dark.png');
            $('#usageArrow2').attr('src', './materials/how to use arrow 2 dark.png');
            $('#usageArrow3').attr('src', './materials/how to use arrow 3 dark.png');
            $('.camera').attr('src', './materials/camera dark.png');
            $('.helpArrow').attr('src', './materials/help arrow white.png');

        }
    }
});

//burger menu
$('.burger').click(()=>{
    $('.burgerPopupContainer').css('display', 'flex');
    $('.burgerPopupXmark').click(()=>{
        $('.burgerPopupContainer').css('display', 'none');
    });
}); 

//newSletter subcription
$('#newsletterSubscribe').click(async () => {
    const email = $('#newslatterEmail').val().trim();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    const data = { email };

    try {
        const response = await fetch('/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (response.ok) {
            $('#messageText').text('Thank you for subscribing to our newsletter!');
            $('.confirm').text('OK');
            $('.cancel').css('display', 'none');
            $('.buttons').css('width', '100%');
            $('.confirm').click(() => {
                $('.messageCon').css('display', 'none');
            })
            $('.messageCon').css('display', 'flex');
            $('#newslatterEmail').val(''); 
        } else {
            alert(await response.text());
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error subscribing.');
    }
});

