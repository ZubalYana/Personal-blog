//display all the users
axios.get('/api/getUser')
.then((res) => {
    console.log(res.data);
    for(let user of res.data){
        $('.usersContainer').prepend(
            `
                        <div class="user">
                <i class="fa-regular fa-flag"></i>
                <i class="fa-solid fa-trash-can"></i>
                <div class="topInfo">
                    <img src="${user.profilePicture}" alt="#" class="userPic">
                    <div class="basicCon">
                        <div class="nameCon">
                            <div class="name">${user.firstname}</div>
                            <div class="lastName">${user.lastName}</div>
                        </div>
                        <div class="email">${user.email}</div>
                    </div>
                </div>
                <div class="description"></div>
                <div class="visited">Visited: <span>${user.placesVisited}</span></div>
                <div class="toVisit">Wants to visit: <span>${user.placesToVisit}</span></div>
            </div>
            `
        )
    }
})
.catch((err) => {
    console.error('Error fetching users:', err);
});
