//pages navigation
$('.users').click(()=>{
    $('.userContent').css('display', 'flex')
    $('.postsContent').css('display', 'none')
    $('.newsletterContent').css('display', 'none')
    $('.users').css('font-weight', '600')
    $('.posts').css('font-weight', '300')
    $('.newsletter').css('font-weight', '300')
})
$('.posts').click(()=>{
    $('.userContent').css('display', 'none')
    $('.postsContent').css('display', 'flex')
    $('.newsletterContent').css('display', 'none')
    $('.users').css('font-weight', '300')
    $('.posts').css('font-weight', '600')
    $('.newsletter').css('font-weight', '300')
})
$('.newsletter').click(()=>{
    $('.userContent').css('display', 'none')
    $('.postsContent').css('display', 'none')
    $('.newsletterContent').css('display', 'flex')
    $('.users').css('font-weight', '300')
    $('.posts').css('font-weight', '300')
    $('.newsletter').css('font-weight', '600')
})

//display all the users
axios.get('/api/getUser')
.then((res) => {
    console.log(res.data);
    $('.userCount').html(`<span>${res.data.length}</span> users in total`)
    for(let user of res.data){

        $('.usersContainer').prepend(
            `
                        <div class="user"  data-id='${user._id}'>
                        <div class="icons">
                            <i class="fa-regular fa-flag"></i>
                            <i class="fa-solid fa-trash-can userDelete" id='delete${user._id}'></i>
                        </div>

                <div class="topInfo">
                <div class="userPicCon">
                    <img src="${user.profilePicture ? user.profilePicture : './materials/profile pic default.png'}" alt="#" class="userPic" onerror="this.src='./materials/profile pic default.png'">
                    </div>
                    <div class="basicCon">
                        <div class="nameCon">
                            <span class="name">${user.firstname}</span>
                            <span class="lastName">${user.lastName}</span>
                        </div>
                        <div class="email">${user.email}</div>
                    </div>
                </div>
                <div class="description">${user.profileDescription}</div>
                <div class="visited">Visited: <span>${user.placesVisited}</span></div>
                <div class="toVisit">Wants to visit: <span>${user.placesToVisit}</span></div>
            </div>
            `
        )
    }

    //users deleting
    $(document).on('click', '.userDelete', function () {
        $('#messageText').text('Are you sure you want to delete the user?')
        $('.confirm').text('Delete')
        $('.messageCon').css('display', 'flex')
        $('.message').css('height', '230px')
        $('.cancel').click(()=>{
            $('.messageCon').css('display', 'none')
        })
        $('.confirm').click(()=>{
            const userId = $(this).closest('.user').data('id');
    
            axios.delete(`/api/deleteUser/${userId}`)
                .then(response => {
                    console.log('User deleted:', response.data);
                    location.reload();
                })
                .catch(error => {
                    console.error('Error deleting user:', error);
                });
        })
    
    });
    

})
.catch((err) => {
    console.error('Error fetching users:', err);
});

//display all the posts
axios.get('/api/getPosts')
.then((res) => {
    console.log(res.data);
    $('.postCount').html(`<span>${res.data.length}</span> posts in total`);

    for (let post of res.data) {
        const formattedDate = moment(post.date).fromNow();

        const profilePic = (post.author && post.author.profilePicture) ? post.author.profilePicture : './materials/profile pic default.png';
        const authorName = post.author ? `${post.author.firstname} ${post.author.lastName}` : 'Unknown Author';
        const postPic = post.pic && post.pic !== '' ? post.pic : './materials/post pic default.png';

        $('.postsContainer').prepend(
            `
            <div class="post">
                <div class="top">
                    <div class="author">
                        <img class="author_pic" src="${profilePic}" alt="Profile Picture">
                        <p class="author_name">${authorName}</p>
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
                    <i class="fa-regular fa-flag"></i>
                    <i class="fa-solid fa-trash-can" id='delete${post._id}'></i>
                </div>
            </div>
            `
        );
    }
    
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

    // Handle post deletion
    $(document).on('click', '.fa-trash-can', function () {
        $('#messageText').text('Are you sure you want to delete the post?');
        $('.confirm').text('Delete');
        $('.messageCon').css('display', 'flex');
        $('.message').css('height', '230px');
        $('.cancel').click(() => {
            $('.messageCon').css('display', 'none');
        });
        $('.confirm').click(() => {
            const postId = $(this).closest('.post').data('id');

            axios.delete(`/api/deletePostAdmin/${postId}`)
                .then(response => {
                    console.log('Post deleted:', response.data);
                    location.reload();
                })
                .catch(error => {
                    console.error('Error deleting post:', error);
                });
        });
    });
})
.catch((err) => {
    console.error('Error fetching posts:', err);
});

//newSlatter form
const quill = new Quill('#editor', {
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        ['image', 'code-block'],
      ],
    },
    placeholder: 'Compose an epic...',
    theme: 'snow', // or 'bubble'
});

//newsletter submission
$('.newSlatter_btn').click(async () => {
    alert('Sending newsletter...');
    const content = quill.root.innerHTML;

    if (!content.trim()) {
        alert('Please enter content for the newsletter.');
        return;
    }

    try {
        const response = await fetch('/send-newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content }),
        });

        if (response.ok) {
            alert('Newsletter sent successfully!');
        } else {
            alert(await response.text());
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error sending the newsletter.');
    }
});
