//display all the users
axios.get('/api/getUser')
.then((res) => {
    console.log(res.data);
    $('.userCount').html(`<span>${res.data.length}</span> users in total`)
    for(let user of res.data){

        if(!user.profilePicture){
            $('.usersContainer').prepend(
                `
                            <div class="user" id='${user._id}'>
                            <div class="icons">
                                <i class="fa-regular fa-flag"></i>
                                <i class="fa-solid fa-trash-can" id='delete${user._id}'></i>
                            </div>
    
                    <div class="topInfo">
                    <div class="userPicCon">
                        <img src="./materials/profile pic default.png" alt="#" class="userPic">

                    </div>
                        <div class="basicCon">
                            <div class="nameCon">
                                <span class="name">${user.firstname}</span>
                                <span class="lastName">${user.lastName}</span>
                            </div>
                            <div class="email">${user.email}</div>
                        </div>
                    </div>
                    <div class="description">${user.profileDescription}</div>
                    <div class="visited">Visited: <span>${user.placesVisited}</span></div>
                    <div class="toVisit">Wants to visit: <span>${user.placesToVisit}</span></div>
                </div>
                `
            )
        }else{
            $('.usersContainer').prepend(
                `
                            <div class="user"  id='${user._id}'>
                            <div class="icons">
                                <i class="fa-regular fa-flag"></i>
                                <i class="fa-solid fa-trash-can" id='delete${user._id}'></i>
                            </div>
    
                    <div class="topInfo">
                    <div class="userPicCon">
                        <img src="${user.profilePicture}" alt="#" class="userPic">
                        </div>
                        <div class="basicCon">
                            <div class="nameCon">
                                <span class="name">${user.firstname}</span>
                                <span class="lastName">${user.lastName}</span>
                            </div>
                            <div class="email">${user.email}</div>
                        </div>
                    </div>
                    <div class="description">${user.profileDescription}</div>
                    <div class="visited">Visited: <span>${user.placesVisited}</span></div>
                    <div class="toVisit">Wants to visit: <span>${user.placesToVisit}</span></div>
                </div>
                `
            )
        }
    }

    //users deleting
    $(document).on('click', '.fa-trash-can', function () {
        $('#messageText').text('Are you sure you want to delete the user?')
        $('#confirm').text('Delete')
        $('.messageCon').css('display', 'flex')
        $('.message').css('height', '230px')
        $('#cancel').click(()=>{
            $('.messageCon').css('display', 'none')
        })
        $('#confirm').click(()=>{
            const userId = $(this).closest('.user').data('id');
    
            axios.delete(`/api/deleteUser/${userId}`)
                .then(response => {
                    console.log('User deleted:', response.data);
                    location.reload();
                })
                .catch(error => {
                    console.error('Error deleting user:', error);
                });
        })
    
    });
    

})
.catch((err) => {
    console.error('Error fetching users:', err);
});
