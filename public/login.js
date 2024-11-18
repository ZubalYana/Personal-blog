document.getElementById('adminLoginBtn').addEventListener('click', async () => {
    const adminName = document.getElementById('adminName').value;
    const adminPass = document.getElementById('adminPass').value;

    try {
        const response = await fetch('/admin-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ adminName, adminPass })
        });
        const result = await response.json();

        if (response.ok) {
            alert(result.message); // Notify success
            window.location.href = '/admin'; // Redirect to admin panel
        } else {
            alert(result.message); // Notify invalid credentials
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Please try again.');
    }
});
