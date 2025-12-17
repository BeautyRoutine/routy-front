import React from 'react';
import { classifyFeedback } from '../../common/reviewUtils'; 

const ReviewTagList = ({ feedback }) => {
  // 피드백이 없거나 비어있으면 렌더링 하지 않음
  if (!feedback || feedback.length === 0) return null;

  const { positive, negative } = classifyFeedback(feedback);

  // 공통 스타일 정의 (인라인 스타일 혹은 CSS 클래스로 분리 가능)
  const styles = {
    container: { display: 'flex', flexDirection: 'column', gap: '8px' },
    row: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px' },
    label: { fontSize: '13px', fontWeight: 'bold', minWidth: '40px', marginRight: '4px' },
    tagBase: {
      fontSize: '12px',
      padding: '2px 8px',
      borderRadius: '4px',
      marginRight: '4px',
    },
    positiveTag: {
      background: '#f0f8ff',
      color: '#0056b3',
      border: '1px solid #cce5ff',
    },
    negativeTag: {
      background: '#fff5f5',
      color: '#c92a2a',
      border: '1px solid #ffc9c9',
    },
  };

  return (
    <div style={styles.container} className="review-tag-list">
      {/* 긍정 태그 */}
      {positive.length > 0 && (
        <div style={styles.row}>
          <span style={styles.label}>장점</span>
          {positive.map((tag, i) => (
            <span key={`pos-${i}`} style={{ ...styles.tagBase, ...styles.positiveTag }}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 부정 태그 */}
      {negative.length > 0 && (
        <div style={styles.row}>
          <span style={styles.label}>단점</span>
          {negative.map((tag, i) => (
            <span key={`neg-${i}`} style={{ ...styles.tagBase, ...styles.negativeTag }}>
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewTagList;
