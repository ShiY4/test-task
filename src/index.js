import React from 'react';
import ReactDOM from 'react-dom/client';
import Slider from './Slider/Slider';
import Canvas from './Canvas/Canvas';

const dom = (
  <>
    <Slider/>
    <Canvas />
  </>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(dom);
