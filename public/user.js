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
                <div class="FistLastName">${res.data.firstname} ${res.data.lastName}</div>
                <div class="email">${res.data.email}</div>
                <div class="description">${res.data.description}</div>
                <div class="placesVisited">Visited: ${res.data.placesVisited}</div>
                <div class="placesToVisit">Wants to visit: ${res.data.placesToVisit}</div>
                <div class="posts">
                    <div class="published"></div>
                    <div class="liked"></div>
                </div>
            </div>
        </div>
        `
    )
})
})
