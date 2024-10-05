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

//theme changing
$(document).ready(function() {
    let theme = localStorage.getItem('theme') || 'light';
    applyTheme(theme);

    $('.themeChanger').click(function(){
        theme = (theme === 'light') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        applyTheme(theme);
    });

    function applyTheme(theme){
        console.log("Applying theme:", theme); 
        if(theme === 'light'){
            $('body').removeClass('dark-theme').addClass('light-theme');
            $('.themeChanger').text('Light Theme');
            $('#profile-pic-preview').attr('src', './materials/profile pic default.png');
        } else {
            $('body').removeClass('light-theme').addClass('dark-theme');
            $('.themeChanger').text('Dark Theme');
            $('#profile-pic-preview').attr('src', './materials/profile pic default light.png');
        }
    }

    // Password validation conditions
    let countOfSymbolsCondition = false;
    let bigLetterCondition = false;
    let smallLetterCondition = false;
    let numberCondition = false;
    let specialCaseCondition = false;

    // Password validation functions
    function checkAmountOfSymbols(password) {
        if (password.length >= 8 && password.length <= 12) {
            $('#countOfSymbols').addClass('valid');
            countOfSymbolsCondition = true;
        } else {
            $('#countOfSymbols').removeClass('valid');
            countOfSymbolsCondition = false;
        }
    }

    function checkSpecialCase(password) {
        let hasSpecialSymbols = /[!@#$%^&*(){}+=]/.test(password);
        if (hasSpecialSymbols) {
            $('#specialSymbols').addClass('valid');
            specialCaseCondition = true;
        } else {
            $('#specialSymbols').removeClass('valid');
            specialCaseCondition = false;
        }
    }

    function checkBigLetter(password) {
        let hasBigLetter = /[A-Z]/.test(password);
        if (hasBigLetter) {
            $('#bigLetter').addClass('valid');
            bigLetterCondition = true;
        } else {
            $('#bigLetter').removeClass('valid');
            bigLetterCondition = false;
        }
    }

    function checkSmallLetter(password) {
        let hasSmallLetter = /[a-z]/.test(password);
        if (hasSmallLetter) {
            $('#smallLetter').addClass('valid');
            smallLetterCondition = true;
        } else {
            $('#smallLetter').removeClass('valid');
            smallLetterCondition = false;
        }
    }

    function checkNumber(password) {
        let hasNumber = /\d/.test(password);
        if (hasNumber) {
            $('#numbers').addClass('valid');
            numberCondition = true;
        } else {
            $('#numbers').removeClass('valid');
            numberCondition = false;
        }
    }

    // Periodically check password validity
    setInterval(() => {
        let password = $('#password').val();
        checkAmountOfSymbols(password);
        checkSpecialCase(password); 
        checkBigLetter(password);
        checkSmallLetter(password);
        checkNumber(password);
    }, 500);

    // Other existing JavaScript code...
});


//password hiding and displaying
$('.showPasswordSignIn').click(function() {
    let passwordInput = $('#password');
    let icon = $(this);

    if (passwordInput.attr('type') === 'password') {
        passwordInput.attr('type', 'text');
        icon.removeClass('fa-eye').addClass('fa-eye-slash');

    } else {
        passwordInput.attr('type', 'password');
        icon.removeClass('fa-eye-slash').addClass('fa-eye');

    }
});
$('.showPasswordLogIn').click(function() {
    let passwordInput = $('#LogInpassword');
    let icon = $(this);

    if (passwordInput.attr('type') === 'password') {
        passwordInput.attr('type', 'text');
        icon.removeClass('fa-eye').addClass('fa-eye-slash');

    } else {
        passwordInput.attr('type', 'password');
        icon.removeClass('fa-eye-slash').addClass('fa-eye');

    }
});

//password conditions
let countOfSymbolsCondition;
let bigLetterCondition;
let smallLetterCondition;
let numberCondition;
let specialCaseCondition;

// password checking
// let password = $('#password').val();
// function checkAmountOfSymbols(password) {
//     if (password.length >= 8 && password.length <= 12) {
//         $('#countOfSymbols').addClass('valid');
//         countOfSymbolsCondition = true;
//     } else {
//         $('#countOfSymbols').removeClass('valid');
//         countOfSymbolsCondition = false;
//     }
// }

// function checkSpecialCase(password) {
//     let hasSpecialSymbols = /[!@#$%^&*(){}+=]/.test(password);
//     if (hasSpecialSymbols) {
//         $('#specialSymbols').addClass('valid');
//         specialCaseCondition = true;
//     } else {
//         $('#specialSymbols').removeClass('valid');
//         specialCaseCondition = false;
//     }
// }

// function checkBigLetter(password) {
//     let hasBigLetter = /[A-Z]/.test(password);
//     if (hasBigLetter) {
//         $('#bigLetter').addClass('valid');
//         bigLetterCondition = true;
//     } else {
//         $('#bigLetter').removeClass('valid');
//         bigLetterCondition = false;
//     }
// }

// function checkSmallLetter(password) {
//     let hasSmallLetter = /[a-z]/.test(password);
//     if (hasSmallLetter) {
//         $('#smallLetter').addClass('valid');
//         smallLetterCondition = true;
//     } else {
//         $('#smallLetter').removeClass('valid');
//         smallLetterCondition = false;
//     }
// }

// function checkNumber(password) {
//     let hasNumber = /\d/.test(password);
//     if (hasNumber) {
//         $('#numbers').addClass('valid');
//         numberCondition = true;
//     } else {
//         $('#numbers').removeClass('valid');
//         numberCondition = false;
//     }
// }
// setInterval(() => {
//     let password = $('#password').val();
//     checkamountOfSymbols(password);
//     checkSpecialCase(password); 
//     bigletter(password);
//     smallLetter(password);
//     number(password);
// }, 500);

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

    const formData = new FormData();
    formData.append('firstname', $('#firstName').val());
    formData.append('lastName', $('#lastName').val());
    formData.append('email', $('#email').val());
    formData.append('password', $('#password').val());
    formData.append('profileDescription', $('#profileDescription').val());
    formData.append('placesVisited', $('#placesVisited').val());
    formData.append('placesToVisit', $('#placesToVisit').val());
    formData.append('profile-pic', $('#profile-pic')[0].files[0]);

    try {
        const response = await axios.post('/auth/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log(response.data.message);
    } catch (error) {
        console.log('Registration error:', error.response.data.message);
    }

    $('#firstName').val('');
    $('#lastName').val('');
    $('#email').val('');
    $('#password').val('');
    $('#profileDescription').val('');
    $('#placesVisited').val('');
    $('#placesToVisit').val('');
    $('.registration').css('display', 'none');
    $('.logIn').css('display', 'flex');
});

//log in
$('#loginBtn').click(async function (event) {
    event.preventDefault();
    
    const email = $('#LogInemail').val();
    const password = $('#LogInpassword').val();
    try {
        const response = await axios.post('/auth/login', { email, password });
        if (response.status === 200) {
            console.log(response.data.message);
            console.log('Logged in successfully');
            window.location.href = '/user';
        }
    } catch (error) {
        if (error.response) {
            console.log(error.response.data.message);
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

//theme changing
// $(document).ready(function() {
//     let theme = localStorage.getItem('theme') || 'light';
//     applyTheme(theme);

//     $('.themeChanger').click(function(){
//         theme = (theme === 'light') ? 'dark' : 'light';
//         localStorage.setItem('theme', theme);
//         applyTheme(theme);
//     });

//     function applyTheme(theme){
//         console.log("Applying theme:", theme); 
//         if(theme === 'light'){
//             $('body').removeClass('dark-theme').addClass('light-theme');
//             $('.themeChanger').text('light');
//             $('#profile-pic-preview').attr('src', './materials/profile pic default.png');
//         } else {
//             $('body').removeClass('light-theme').addClass('dark-theme');
//             $('.themeChanger').text('dark');
//             $('#profile-pic-preview').attr('src', './materials/profile pic default light.png');
//         }
//     }
// });