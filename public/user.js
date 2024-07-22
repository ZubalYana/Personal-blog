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
