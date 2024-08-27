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
            
            $('.postsContainer').prepend(
                `
                <div class="post" data-post='${JSON.stringify(post)}'>
                    <div class="top">
                        <div class="author">
                        <div class="authorHendler" style="display: flex; align-items: center;">
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

        // Following logic
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
        $(document).on('click', '.authorHendler', function(e){
            e.preventDefault();
            e.stopPropagation();
            console.log('Author element clicked:', this);
            const postData = $(this).closest('.post').data('post');
            console.log(postData.author);
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

