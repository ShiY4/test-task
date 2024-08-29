import React from 'react';
import ReactDOM from 'react-dom/client';
import Slider from './Slider/Slider';
import Canvas from './Canvas/Canvas';
import Uploader from './Uploader/Uploader';

const dom = (
  <>
    <Slider/>
    <Canvas/>
    <Uploader/>
  </>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(dom);
