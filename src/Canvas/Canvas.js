import React from 'react';
import { saveAs } from 'file-saver';
import './Canvas.css';

export default class Canvas extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      image: null,
      imageSrc: null,
      rotation: 0,
    }
  }

  handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const src = URL.createObjectURL(file);
      this.setState({imageSrc: src})
      this.setState({image: file})
      this.setState({rotation: 0})
    }
  };

  handleRotate = () => {
    const { rotation } = this.state
    this.setState({rotation: (rotation + 90) % 360})
  };

  handleSave = () => {
    const { imageSrc, rotation, image } = this.state
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      switch(rotation){
        case 90:
        case 270:
          canvas.width = img.height;
          canvas.height = img.width;
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.drawImage(img, -img.width / 2, -img.height / 2);
          break;
        case 180:
          canvas.width = img.width;
          canvas.height = img.height;
          if (rotation === 180) {
            ctx.rotate((180 * Math.PI) / 180);
            ctx.drawImage(img, -img.width, -img.height);
          } else {
            ctx.drawImage(img, 0, 0);
          }
          break;
        default:
          console.log("default");
      }
      canvas.toBlob((blob) => {
        saveAs(blob, `${image.name}_rotated_on_${rotation}deg`);
      });
    };
  };


  render() {
    const { imageSrc, rotation } = this.state
    return (
      <div className="container" style={{ textAlign: 'center', padding: '20px' }}>
        <h1>Image Rotator</h1>
        <input type="file" onChange={this.handleImageChange} accept="image/png, image/jpeg" />
        {imageSrc && (
          <div>
            <h2>Preview:</h2>
            <div style={{ transform: `rotate(${rotation}deg)`, display: 'inline-block' }}>
              <img src={imageSrc} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px' }} />
            </div>
            <div>
              <button onClick={this.handleRotate}>Rotate 90°</button>
              <button onClick={this.handleSave}>Save Rotated Image</button>
            </div>
          </div>
        )}
      </div>
    )
  }
}