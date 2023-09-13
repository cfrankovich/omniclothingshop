import React from 'react'

function Signup() {
    const handlesubmit = (e) => {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        console.log(formData);

        fetch('http://localhost:8080/signup', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        }).catch((error) => {
            console.error('Error:', error)
        })
    }

  return (
    <>
        signup
        <form method="post" onSubmit={handlesubmit}>
            <label>
                Username: <input type="text" name="username" placeholder="username" />
            </label>
            <label>
                Email: <input type="text" name="email" placeholder="email" />
            </label>
            <label>
                Password: <input type="password" name="password" placeholder="password" />
            </label>
            <button type="reset">reset</button>
            <button type="submit">submit</button>
        </form>
    </>
  )
}

export default Signup