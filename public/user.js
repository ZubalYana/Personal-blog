//getting and displaying user's info
document.addEventListener('DOMContentLoaded', () => {
    axios.get('/auth/user')
        .then(res => {
            console.log(res.data);
            $('.wrap').append(
                `
                <div class="user">
                <i class="fa-solid fa-chevron-left backToMainArrow"></i>
                    <div class="userInfo">
                        <img class="userPicture" src="/${res.data.profilePicture}" alt="profile picture">
                        <h2 class="FistLastName">${res.data.firstname} ${res.data.lastName}</h2>
                        <p class="email">${res.data.email}</p>
                        <p class="description">${res.data.profileDescription}</p>
                        <span class="placesVisited">Visited: <p class='visitedPlaces'>${res.data.placesVisited}</p></span>
                        <span class="placesToVisit">Wants to visit: <p class='toVisitPlaces' >${res.data.placesToVisit}</p></span>
                        <div class="followings">
                            <div class="following" id="followersCon">
                                <span class="amount">${res.data.followers.length}</span>
                                <span class="following_text">followers</span>
                            </div>
                            <div class="following" id="followingsCon">
                                <span class="amount">${res.data.followings.length}</span>
                                <span class="following_text">followings</span>
                            </div>
                        </div>
                    </div>
                    <div class="posts">
                        <div class="postsChanging">
                            <div class="publishedPosts">Published posts</div>
                            <div class="likedPosts">Liked posts</div>
                        </div>
                        <div class="postsContainer"></div>
                        <div class="likedPostsContainer" style="display: none;"></div>
                    </div>
                </div>
                `
            );

            //main page opening
            $('.backToMainArrow').click(()=>{
                window.location.href = '/';
            })

            //user's posts/liked posts changing
            $('.likedPosts').click(()=>{
                $('.likedPostsContainer').css('display', 'flex')
                $('.postsContainer').css('display', 'none')
                $('.likedPosts').css('background-color', '#1A4D2E')
                $('.likedPosts').css('color', '#fff')
                $('.publishedPosts').css('background-color', '#fff')
                $('.publishedPosts').css('color', '#1A4D2E')
            })
            $('.publishedPosts').click(()=>{
                $('.likedPostsContainer').css('display', 'none')
                $('.postsContainer').css('display', 'flex')
                $('.likedPosts').css('background-color', '#fff')
                $('.likedPosts').css('color', '#1A4D2E')
                $('.publishedPosts').css('background-color', '#1A4D2E')
                $('.publishedPosts').css('color', '#fff')

            })

            //display followers and followings
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
                               <i class="fa-solid fa-trash-can deleteFollower"></i>
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
            
                    const followinhssData = await response.json();
            
                    for (let following of followinhssData) {
                        $('.showFollowingsCon').prepend(
                            `
                            <div class="following" data-id="${following._id}">
                               <img class="followingPic" src="${following.profilePicture}" alt="${following.firstname} ${following.lastName}">
                               <div class="followingName">${following.firstname} ${following.lastName}</div>
                               <div class="followingsPopup_unfollow">unfollow</div>
                            </div>              
                            `
                        );
                    }
                } catch (error) {
                    console.error('Error loading followers:', error);
                }
            }
            loadFollowers(res.data.followers);
            loadFollowings(res.data.followings);

            //removing followers and unfollowing followings
            $(document).on('click', '.deleteFollower', function() {
                const followerId = $(this).closest('.follower').data('id');
                $('.followingsPopupContainer').css('display', 'none')
                $('#messageText').text('Delete this person from followers?')
                $('#confirm').text('Delete')
                $('#confirm').click(()=>{
                    axios.delete(`/api/removeFollower/${followerId}`)
                    .then(response => {
                        console.log(response.data.message);
                        $(this).closest('.follower').remove();
                        $('.messageCon').css('display', 'none')
                        location.reload()
                    })
                    .catch(error => {
                        console.error('Error removing follower:', error.response.data.message);
                    });
                })

            });
            $(document).on('click', '.followingsPopup_unfollow', function() {
                const followingId = $(this).closest('.following').data('id');
                $('.followingsPopupContainer').css('display', 'none')
                $('.message').css('height', '240px')
                $('.messageCon').css('display', 'flex')
                $('#messageText').text('Unfollow this person? You can follow again any time')
                $('#confirm').text('Unfollow')
                $('#cancel').click(()=>{
                    $('.messageCon').css('display', 'none')

                })
                $('#confirm').click(()=>{
                    axios.post(`/api/unfollow/${followingId}`)
                    .then(response => {
                        console.log(response.data.message);
                        $(this).closest('.following').remove();
                        $('.messageCon').css('display', 'none')
                        location.reload()
                    })
                    .catch(error => {
                        console.error('Error unfollowing user:', error.response.data.message);
                    });
                })

            });
            
            //followers and followings views
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
        });


});

//post screen opening/closing
$('#plus').click(()=>{
    $('.postCreation').css('display', 'flex')
})
$('#postCreation_xmark').click(()=>{
    $('.postCreation').css('display', 'none')
})
$('#cancel').click(()=>{
    $('.postCreation').css('display', 'none')
})

//post img displaying
document.getElementById('post-pic').addEventListener('change', function(event) {
    const input = event.target;
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const max_width = 545;
                const max_height = 400;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > max_width) {
                        height *= max_width / width;
                        width = max_width;
                    }
                } else {
                    if (height > max_height) {
                        width *= max_height / height;
                        height = max_height;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const resizedDataUrl = canvas.toDataURL('image/jpeg');
                document.getElementById('post-pic-preview').src = resizedDataUrl;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
});

//posting
$('#postForm').submit((event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('title', $('#postTitle').val());
    formData.append('body', $('#postText').val());
    formData.append('hashtags', $('#postHashtags').val());
    formData.append('post-pic', $('#post-pic')[0].files[0]);

    axios.post('/api/posts', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then((res) => {
        console.log(res);
        console.log('Post created');
        $('.postCreation').css('display', 'none')
        location.reload()
    })
    .catch((err) => {
        console.error(err);
    });
});

//get and display all the user's posts
$.ajax({
    url: '/api/authUserPosts',
    method: 'GET',
    success: function(posts) {
        posts.forEach(post => {
            const formattedDate = moment(post.date).fromNow();
            $('.postsContainer').prepend(
                `
                <div class="post" data-id="${post._id}">
                    <div class="top">
                        <div class="author">
                            <img class="author_pic" src="${post.author.profilePicture}" alt="">
                            <p class="authro_name">${post.author.firstname} ${post.author.lastName}</p>
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

        //reading more/less
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

//edit post
let postId;
$(document).on('click', '.editPost', function() {
    postId = $(this).closest('.post').data('id');
    $('.postEditingCon').css('display', 'flex');
    $.ajax({
        url: `/api/userPosts/${postId}`,
        method: 'GET',
        success: (post) => {
            $('#editTitle').val(post.title);
            $('#editBody').val(post.body);
            $('#editHashtags').val(post.hashtags);
            $('#currentPostPicture').attr('src', `/${post.pic}`);
        },
        error: (error) => {
            console.error('Error fetching post data:', error);
        }
    });

    $('#cancelPostEditing').click(() => {
        $('.postEditingCon').css('display', 'none');
    });
});
$('#editPost').click(() => {
    const formData = new FormData();
    formData.append('postPicture', $('#editPostPicture')[0].files[0]);
    formData.append('title', $('#editTitle').val());
    formData.append('body', $('#editBody').val());
    formData.append('hashtags', $('#editHashtags').val());

    axios.post(`/api/userPosts/${postId}`, formData)
        .then((res) => {
            console.log('Post updated successfully');
            const post = res.data;
            $(`.post[data-id="${postId}"] .postImg`).attr('src', `/uploads/${post.pic}`);
            $(`.post[data-id="${postId}"] .postTitle`).text(`${post.title}`);
            $(`.post[data-id="${postId}"] .postText`).text(post.body);
            $(`.post[data-id="${postId}"] .postHashtags`).text(post.hashtags);
            $('.postEditingCon').css('display', 'none');
        })
        .catch((err) => {
            console.error('Error updating post:', err);
        });
});
$('#editPostPicture').change(function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            $('#currentPostPicture').attr('src', e.target.result);
        }
        reader.readAsDataURL(file);
    }
});


//logout
$('#logoutIcon').click(() => {
    $('#messageText').text('Are you sure you want to logout?')
    $('#confirm').text('Logout')
    $('.messageCon').css('display', 'flex')
    $('.message').css('height', '200px')
    $('#cancel').click(()=>{
        $('.messageCon').css('display', 'none')
    })
    $('#confirm').click(() => {
        axios.post('/auth/logout')
            .then(response => {
                console.log('Logout response:', response.data);
                if (response.status === 200) {
                    window.location.href = '/';
                }
            })
            .catch(error => {
                console.error('Logout error:', error);
            });
    });
})

//edit profile
$('#pencil').click(() => {
    $('.profileEditingCon').css('display', 'flex');
    $.ajax({
        url: '/auth/user',
        method: 'GET',
        success: (user) => {
            $('#editName').val(user.firstname);
            $('#editLastName').val(user.lastName);
            $('#editEmail').val(user.email);
            $('#editDescription').val(user.profileDescription);
            $('#editPlacesVisited').val(user.placesVisited);
            $('#editPlacesToVisit').val(user.placesToVisit);
            $('#currentProfilePicture').attr('src', `/${user.profilePicture}`);
        },
        error: (error) => {
            console.error('Error fetching user data:', error);
        }
    });

    $('#cancelEditing').click(() => {
        $('.profileEditingCon').css('display', 'none');
    });
});
$('#editPicture').change(function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            $('#currentProfilePicture').attr('src', e.target.result);
        }
        reader.readAsDataURL(file);
    }
});
$('#edit').click(() => {
    const formData = new FormData();
    formData.append('profilePicture', $('#editPicture')[0].files[0]);
    formData.append('firstname', $('#editName').val());
    formData.append('lastName', $('#editLastName').val());
    formData.append('email', $('#editEmail').val());
    formData.append('profileDescription', $('#editDescription').val());
    formData.append('placesVisited', $('#editPlacesVisited').val());
    formData.append('placesToVisit', $('#editPlacesToVisit').val());

    axios.post('/auth/user/update', formData)
        .then((res) => {
            console.log('Profile updated successfully');
            const user = res.data;
            $('.userPicture').attr('src', `/uploads/${user.profilePicture}`);
            $('.FistLastName').text(`${user.firstname} ${user.lastName}`);
            $('.email').text(user.email);
            $('.description').text(user.profileDescription);
            $('.visitedPlaces').text(user.placesVisited);
            $('.toVisitPlaces').text(user.placesToVisit);
            $('.profileEditingCon').css('display', 'none');
            location.reload();
            function updatePostsAuthorPicture(newProfilePicture) {
              $('.author_pic').attr('src', newProfilePicture);
            }
            updatePostsAuthorPicture(`/uploads/${user.profilePicture}`);
        })
        .catch((err) => {
            console.error('Error updating profile:', err);
        });
});

//settings
$('#gear').click(()=>{
    $('.settingsCon').css('display', 'flex')
    $('#settingsXMark').click(()=>{
        $('.settingsCon').css('display', 'none')
    })
})

//post deleting
$(document).on('click', '.fa-trash-can', function () {
    $('#messageText').text('Are you sure you want to delete the post?')
    $('#confirm').text('Delete')
    $('.messageCon').css('display', 'flex')
    $('.message').css('height', '230px')
    $('#cancel').click(()=>{
        $('.messageCon').css('display', 'none')
    })
    $('#confirm').click(()=>{
        const postId = $(this).closest('.post').data('id');

        axios.delete(`/api/deletePost/${postId}`)
            .then(response => {
                console.log('Post deleted:', response.data);
                location.reload();
            })
            .catch(error => {
                console.error('Error deleting post:', error);
            });
    })

});

//opening followers and followings profiles
$(document).on('click', '.followerPic', function(e) {
    console.log('test');
    e.preventDefault();
    e.stopPropagation();

    const targetUserId = $(this).closest('.follower').data('id');
    console.log(targetUserId);


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
                    <i class="fa-solid fa-chevron-left followerBackToMainArrow"></i>
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
            $('.followerBackToMainArrow').click(()=>{
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