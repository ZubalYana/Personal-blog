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
                <p class="placesVisited">Visited: ${res.data.placesVisited}</p>
                <p class="placesToVisit">Wants to visit: ${res.data.placesToVisit}</p>
            </div>
            <div class="posts">
                <div class="published"></div>
                <div class="liked"></div>
            </div>
        </div>
        `
    )
})
})
