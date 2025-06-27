import React from 'react';

const CompassPage = () => {
  return (
    <div style={{ height: 'calc(100vh - 57px)' }}>
      <iframe
        src="https://karma-compass.vercel.app/"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        title="Karma Compass"
        allow="camera; microphone"
      />
    </div>
  );
};

export default CompassPage;
