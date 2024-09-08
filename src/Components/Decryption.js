import React, { useState } from "react";
export const Decryption = ()=> {
    const [photo,setPhoto] = useState(null);
    const [text,setText] = useState('');
    const changeHandler = (event) => {
        setPhoto(event.target.files[0]);
    }
    const changeText = (event) => {
        setText(event.target.value);
    }
    const submitHandler = (event) => {
        event.preventDefault();
        const data = new FormData();
        data.append('image',photo)
        fetch("http://127.0.0.1:5000/decrypt_image",{
            method:'POST',
            body:data
        })
        .then((response) => {
            if(!response.ok){
                throw new Error("Image cannot be send");
            }
            return response.json()
        })
        .then((data) => {
            setText(data.decoded_message)
        })
    }
    return (
        <div>
            <form onSubmit={submitHandler}>
            <h1>Please Upload the decrypted message</h1>
            <input type="file" name="file" onChange={changeHandler}/>
            <button type="submit">Decrypt the image</button>
            {text && <h1>The message is {text}</h1>}
            </form>        
        </div>
    );
}