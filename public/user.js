//main page opening
$('.backToMainArrow').click(() => {
    window.location.href = '/';
});

//getting and displaying user's info
document.addEventListener('DOMContentLoaded', ()=>{
    axios.get('/auth/user')
.then(res=>{
    console.log(res.data)
})
})
