from flask import Flask, request, send_file,jsonify
from PIL import Image
from io import BytesIO
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
image_no=0
def getmessagelength(img,location):
    x = int(location[0])-1
    y = int(location[1])-1
    r,g,b = img.getpixel((x,y))
    return r
def changepixel(img,x=0,y=0,text=0):
    r,g,b = img.getpixel((x,y))
    r = text
    colors = (r,g,b)
    img.putpixel((x,y),colors)
def write_message_at_last(original_image,image_size,text):
    x = int(image_size[0])-1
    y = int(image_size[1])-1
    changepixel(original_image,x,y,text)
def getpixel(img,x_val,y_val):
    r,g,b = img.getpixel((x_val,y_val))
    return r
@app.route("/get_image", methods=['POST'])
def upload_data():
    global image_no, text, image_name,image_extension
    image_no += 1
    if 'image' not in request.files or 'text' not in request.form:
        return 'Missing image or file', 400
    image = request.files['image']
    text = request.form['text']

    if image.filename == '':
        return 'No selected image', 400
    image_extension = os.path.splitext(image.filename)[1]
    image.save(os.path.join(os.getcwd(),f"image{image_no}{image_extension}"))
    print(f"image{image_no}{image_extension}")
    return 'Data uploaded successfully', 200

@app.route('/steg_image', methods=['GET'])
def make_steg_image():
    global text
    img_path = os.path.join(os.getcwd(),f"image{image_no}.png")
    img = Image.open(img_path)
    if(img.mode !='RGB'):
        img = img.convert('RGB')
    write_message_at_last(img,img.size,len(text))
    x_val,y_val = 0,0
    for i in text:
        changepixel(img,x_val,y_val,ord(i))
        x_val+=1
        y_val+=1
    path_to_save = os.path.join(os.getcwd(),"Result.png")
    img.save(path_to_save)
    return send_file(path_to_save,mimetype="image/png")
@app.route("/decrypt_image",methods=['POST'])
def decrypt_image():
    if 'image' not in request.files:
        return {"File Not Found",404}
    img = request.files['image']
    PIL_image = Image.open(img)
    image_length = getmessagelength(PIL_image,PIL_image.size)
    counter = 0
    decoded_message = ""
    x_val,y_val = 0,0
    while(counter<image_length):
        char = getpixel(PIL_image,x_val,y_val)
        decoded_message += chr(char)
        x_val+=1
        y_val+=1
        counter+=1
    return jsonify({"decoded_message":decoded_message}),200
    
if __name__ == "__main__":
    app.run()
