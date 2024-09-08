import React, { useState } from "react";
export const Encryption = () => {
    const [selectImage, setSelectedImage] = useState(null);
    const [text, setText] = useState('');
    const [stegImage, setStegImage] = useState('');
    const [showStegImage, setShowStegImage] = useState(false);
    const formHandler = (event) => {
      event.preventDefault();
      const data = new FormData();
      data.append('image', selectImage);
      data.append('text', text);
        // POST request to upload the image
        fetch("http://127.0.0.1:5000/get_image", {
          method: 'POST',
          body: data
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to Upload data");
          }
          return response.text();
        })
        .then((data) => {
          console.log("Data Upload Successfully" + data);
          // Only after the image upload is successful, make the GET request for steg_image
          return fetch("http://127.0.0.1:5000/steg_image", {
            method: 'GET',
          });
        })
        .then((response) => {
          if (!response.ok) {
            console.log(response);
          }
          return response.blob();
        })
        .then((data) => {
          const imageUrl = URL.createObjectURL(data);
          setStegImage(imageUrl);
          setShowStegImage(true);
        })
        .catch((error) => {
          console.log("Error: " + error);
        });
      };
      
    const stegImageHandler = () => {
      if(showStegImage){
        const link = document.createElement('a');
        link.href = stegImage;
        link.download = 'steg_image.jpg';
        link.click();
      }
    };
    return (
        <>
         <form onSubmit={formHandler}>
        <input type="file" name="image" onChange={(event) => {
          setSelectedImage(event.target.files[0]);
        }}/>
        <textarea onChange={(event) => {
          setText(event.target.value);
        }}/><br/>
        <button type="submit">Submit</button>
        {showStegImage && <img src={stegImage} alt="steg_image" onClick={stegImageHandler}/>}
        {showStegImage && <h1>Click on the Image to download it</h1>}
      </form>
        </>
    );
}