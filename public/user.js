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
                <img class="userPicture" src="" alt="">
                <div class="FistLastName"></div>
                <div class="email"></div>
                <div class="placesVisited">Visited:</div>
                <div class="placesToVisite">Wants to visit:</div>
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
