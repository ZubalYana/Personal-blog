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

//burger animation
// $('.burger').hover(
//     function() {
//         $('.menuContainer').css('height', '200px');
//         $('.sidebar').css('height', '159px');
//         $('.icons').css('font-size', '28px');
//         $('.menuContainer').css('background-color', '#1A4D2E');
//         $('.line').css('background-color', '#fff');
//     }, 
//     function() {
//         $('.menuContainer').css('height', '46px');
//         $('.sidebar').css('height', '0px');
//         $('.icons').css('font-size', '0px');
//         $('.menuContainer').css('background-color', '#fff');
//         $('.line').css('background-color', '#1A4D2E');
//     }
// );