//main page opening
$('.backToMainArrow').click(() => {
    window.location.href = '/';
});

//getting and displaying user's info
document.addEventListener('DOMContentLoaded', ()=>{
    axios.get('/auth/user')
.then(res=>{
    console.log(res.data)
    $('.wrap').append(
        `
                <div class="user">
            <div class="userInfo">
                <img class="userPicture" src="${res.data.profilePicture}" alt="profile picture">
                <h2 class="FistLastName">${res.data.firstname} ${res.data.lastName}</h2>
                <p class="email">${res.data.email}</p>
                <p class="description">${res.data.profileDescription}</p>
                <span class="placesVisited">Visited: <p class='visitedPlaces'>${res.data.placesVisited}</p></span>
                <span class="placesToVisit">Wants to visit: <p class='toVisitPlaces' >${res.data.placesToVisit}</p></span>
            </div>
            <div class="posts">
                <div class="postsChanging">
                    <div class="publishedPosts">Published posts</div>
                    <div class="likedPosts">Liked posts</div>
                </div>
                <div class="postsContainer"></div>
            </div>
        </div>
        `
    )
})
})

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

    axios.post('http://localhost:3000/api/posts', formData, {
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
    url: '/api/userPosts',
    method: 'GET',
    success: function(posts) {
        posts.forEach(post => {
            const formattedDate = moment(post.date).fromNow();
            $('.postsContainer').prepend(
                `
                <div class="post">
                    <div class="top">
                        <div class="author">
                            <img class="author_pic" src="${post.author.profilePicture}" alt="">
                            <p class="authro_name">${post.author.firstname} ${post.author.lastName}</p>
                        </div>
                        <p class="time">${formattedDate}</p>
                    </div>
                    <img class="postImg" src="${post.pic}" alt="">
                    <h3 class="postTitle">${post.title}</h3>
                    <p class="postText">${post.body}</p>
                    <p class="postHashtags">${post.hashtags}</p>
                    <div class="actions">
                        <i class="fa-regular fa-thumbs-up"></i>
                        <i class="fa-solid fa-share-nodes"></i>
                        <i class="fa-solid fa-pencil"></i>
                        <i class="fa-solid fa-trash-can"></i>
                    </div>
                </div>
                `
            );
        });
    },
    error: function(error) {
        console.error('Error fetching user posts:', error);
    }
});

//logout
$('#logoutIcon').click(() => {
    $('.messageCon').css('display', 'flex')
    $('#cancelLogout').click(()=>{
        $('.messageCon').css('display', 'none')
    })
    $('#logout').click(() => {
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
$('#pencil').click(()=>{
    $('.profileEditingCon').css('display', 'flex')
    $('#cancelEditing').click(()=>{
        $('.profileEditingCon').css('display', 'none')
    })
})

//settings
$('#gear').click(()=>{
    $('.settingsCon').css('display', 'flex')
    $('#settingsXMark').click(()=>{
        $('.settingsCon').css('display', 'none')
    })
})