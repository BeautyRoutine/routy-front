import React, { useEffect } from 'react';

const PostcodeLayer = ({ visible, onClose, onSelect }) => {
  useEffect(() => {
    if (!visible) return;

    const layer = document.getElementById('postcode-layer');

    new window.daum.Postcode({
      oncomplete: function (data) {
        onSelect(data);
        onClose();
      },
      width: '100%',
      height: '100%',
    }).embed(layer);
  }, [visible, onClose, onSelect]);

  if (!visible) return null;

  return (
    <>
      {/* 딤드 배경 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          zIndex: 9998,
        }}
        onClick={onClose}
      />

      {/* 주소 검색 레이어 */}
      <div
        id="postcode-layer"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          width: '400px',
          height: '500px',
          transform: 'translate(-50%, -50%)',
          background: '#fff',
          border: '1px solid #ccc',
          zIndex: 9999,
          overflow: 'hidden',
        }}
      />
    </>
  );
};

export default PostcodeLayer;
