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
// $('#post').click(() => {
//     const data = {
//         title: $('#postTitle').val(),
//         body: $('#postText').val()
//     }
//     axios.post('http://localhost:3000/api/posts', data)
//     .then((res) => {
//         console.log(res)
//         alert('Post created')
//     })
//     .catch((err) => {
//         console.error(err)
//     })
// })
