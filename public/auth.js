//profile img work
document.getElementById('profile-pic').addEventListener('change', function(event) {
    const input = event.target;
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const max_size = 100; 
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > max_size) {
                        height *= max_size / width;
                        width = max_size;
                    }
                } else {
                    if (height > max_size) {
                        width *= max_size / height;
                        height = max_size;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const resizedDataUrl = canvas.toDataURL('image/jpeg');
                document.getElementById('profile-pic-preview').src = resizedDataUrl;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
});

//sign in and log in pages changing
$('.loginButton').click(()=>{
    $('.registration').css('display', 'none') 
    $('.logIn').css('display', 'flex') 
})
$('.login_signinButton').click(()=>{
    $('.registration').css('display', 'flex') 
    $('.logIn').css('display', 'none') 
})

//registration
$('#registerBtn').click(async function () {
    const firstname = $('#firstName').val();
    const lastName = $('#lastName').val();
    const email = $('#email').val();
    const password = $('#password').val();
    const profileDescription = $('#profileDescription').val();
    const placesVisited = $('#placesVisited').val();
    const placesToVisit = $('#placesToVisit').val();

    try {
        const response = await axios.post('/auth/register', { 
            firstname, 
            lastName, 
            email, 
            password, 
            profileDescription, 
            placesVisited, 
            placesToVisit
        });
        alert(response.data.message);
    } catch (error) {
        alert(error.response.data.message);
    }
});