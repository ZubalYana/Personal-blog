//display all the users
axios.get('/api/getUser')
.then((res) => {
    console.log(res.data);
})
.catch((err) => {
    console.error('Error fetching users:', err);
});
