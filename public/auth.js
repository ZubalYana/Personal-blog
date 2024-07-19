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

//password conditions
let countOfSymbolsCondition;
let bigLetterCondition;
let smallLetterCondition;
let numberCondition;
let specialCaseCondition;

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
$('#registerBtn').click(async function (event) {
    event.preventDefault();
    
    //password checking
    function checkamountOfSymbols() {
        let password = $('#password').val();
        if (password.length >= 8 && password.length <= 12) {
            $('#countOfSymbols').css('color', '#1A4D2E');
            countOfSymbolsCondition = true;
        } else {
            $('#countOfSymbols').css('color', '#4d1a1a');
            countOfSymbolsCondition = false;
        }
    }
    function checkSpecialCase(password) {
        let hasSpecialSymbols = /[!@#$%^&*(){}+=]/.test(password);
        if (hasSpecialSymbols) {
            $('#specialSymbols').css('color', '#1A4D2E');
            specialCaseCondition = true;
        } else {
            $('#specialSymbols').css('color', '#4d1a1a');
            specialCaseCondition = false;
        }
    }
    function bigletter(password) {
        let hasbigletter = /[A-Z]/.test(password);
        if (hasbigletter) {
            $('#bigLetter').css('color', '#1A4D2E');
            bigLetterCondition = true;
        } else {
            $('#bigLetter').css('color', '#4d1a1a');
            bigLetterCondition = false;
        }
    }
    function smallLetter(password) {
        let hassmallletter = /[a-z]/.test(password);
        if (hassmallletter) {
            $('#smallLetter').css('color', '#1A4D2E');
            smallLetterCondition = true;
        } else {
            $('#smallLetter').css('color', '#4d1a1a');
            smallLetterCondition = false;
        }
    }
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
        console.log(error.response.data.message);
    }
});

//log in
$('#loginBtn').click(async function (event) {
    event.preventDefault();
    
    const email = $('#LogInemail').val();
    const password = $('#LogInpassword').val();
    try {
        const response = await axios.post('/auth/login', { email, password });
        if (response.status === 200) {
            alert(response.data.message);
            console.log('Logged in successfully');
            window.location.href = '/user';
        }
    } catch (error) {
        if (error.response) {
            alert(error.response.data.message);
        } else {
            alert('An error occurred. Please try again later.');
        }
    }
});

//cards animations
$('#placeCard1').click(function() {
        $(this).css('transform', 'rotate(0deg)');
        $(this).css('top', '150px');
        $(this).css('right', '130px');
    setTimeout(() => {
            $(this).css('transform', 'rotate(-47deg)');
            $(this).css('top', '480px');
            $(this).css('right', '-130px');
    }, 2000);

});
$('#placeCard2').click(function() {
    $(this).css('transform', 'rotate(0deg)');
    $(this).css('top', '100px');
    $(this).css('right', '-100px');
setTimeout(() => {
        $(this).css('transform', 'rotate(-24deg)');
        $(this).css('top', '360px');
        $(this).css('right', '-250px');
}, 2000);
});
$('#placeCard3').click(function() {
    $(this).css('transform', 'rotate(0deg)');
    $(this).css('top', '70px');
    $(this).css('left', '80px');
setTimeout(() => {
        $(this).css('transform', 'rotate(44deg)');
        $(this).css('top', '-120px');
        $(this).css('left', '-290px');
}, 2000);
});
$('#placeCard4').click(function() {
    $(this).css('transform', 'rotate(0deg)');
    $(this).css('top', '200px');
    $(this).css('left', '70px');
setTimeout(() => {
        $(this).css('transform', 'rotate(19deg)');
        $(this).css('top', '480px');
        $(this).css('left', '-250px');
}, 2000);
});
$('#placeCard5').click(function() {
    $(this).css('transform', 'rotate(0deg)');
    $(this).css('top', '70px');
    $(this).css('right', '100px');
setTimeout(() => {
        $(this).css('transform', 'rotate(-33deg)');
        $(this).css('top', '380px');
        $(this).css('right', '0');
}, 2000);
});
$('#placeCard6').click(function() {
    $(this).css('transform', 'rotate(0deg)');
    $(this).css('top', '50px');
    $(this).css('right', '50px');
setTimeout(() => {
        $(this).css('transform', 'rotate(-20deg)');
        $(this).css('top', '310px');
        $(this).css('right', '-100px');
}, 2000);
});
$('#placeCard7').click(function() {
    $(this).css('transform', 'rotate(0deg)');
    $(this).css('top', '-20px');
    $(this).css('right', '-50px');
setTimeout(() => {
        $(this).css('transform', 'rotate(-16deg)');
        $(this).css('top', '310px');
        $(this).css('right', '-220px');
}, 2000);
});
$('#placeCard8').click(function() {
    $(this).css('transform', 'rotate(0deg)');
    $(this).css('top', '-20px');
    $(this).css('left', '-50px');
setTimeout(() => {
        $(this).css('transform', 'rotate(28deg)');
        $(this).css('top', '320px');
        $(this).css('left', '-220px');
}, 2000);
});
$('#placeCard9').click(function() {
    $(this).css('transform', 'rotate(0deg)');
    $(this).css('top', '50px');
    $(this).css('left', '50px');
setTimeout(() => {
        $(this).css('transform', 'rotate(57deg)');
        $(this).css('top', '400px');
        $(this).css('left', '-160px');
}, 2000);
});