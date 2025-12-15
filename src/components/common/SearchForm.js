import React from 'react';

/**
 * 관리자 페이지 검색 폼 공통 컴포넌트
 *
 * @param {Object} props
 * @param {Array} props.fields - 검색 필드 설정 배열
 * @param {Object} props.values - 현재 폼 값 객체
 * @param {Function} props.onChange - 입력 변경 핸들러 (key, value) => void
 * @param {Function} props.onSubmit - 검색 버튼 클릭 핸들러
 * @param {string} props.title - 검색 폼 제목 (기본값: '검색')
 * @param {string} props.submitText - 검색 버튼 텍스트 (기본값: '🔎 검색')
 *
 * @example
 * const fields = [
 *   {
 *     key: 'memberName',
 *     label: '회원명',
 *     type: 'text',
 *     gridCol: 'full',
 *     placeholder: '회원명 입력',
 *   },
 *   {
 *     key: 'startDate',
 *     label: '시작일',
 *     type: 'date',
 *     gridCol: 'half',
 *   },
 * ];
 *
 * <SearchForm
 *   fields={fields}
 *   values={formValues}
 *   onChange={(key, value) => setFormValues({ ...formValues, [key]: value })}
 *   onSubmit={handleSearch}
 *   title="주문 검색"
 * />
 */
const SearchForm = ({ fields = [], values = {}, onChange, onSubmit, title = '검색', submitText = '🔎 검색' }) => {
  // 검색 필드 렌더링 헬퍼
  const renderSearchField = field => {
    const commonProps = {
      className: 'form-control',
      value: values[field.key] || '',
      onChange: e => onChange(field.key, e.target.value),
    };

    switch (field.type) {
      case 'date':
        return <input type="date" {...commonProps} />;

      case 'text':
        return <input type="text" placeholder={field.placeholder} {...commonProps} />;

      case 'number':
        return (
          <input
            type="number"
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step}
            {...commonProps}
          />
        );

      case 'select':
        return (
          <select {...commonProps} className="form-select">
            <option value="">{field.placeholder || '선택하세요'}</option>
            {field.options?.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return <textarea placeholder={field.placeholder} rows={field.rows || 3} {...commonProps} />;

      default:
        return null;
    }
  };

  // 그리드 레이아웃 계산
  const renderSearchRows = () => {
    const rows = [];
    let currentRow = [];

    fields.forEach((field, index) => {
      if (field.gridCol === 'half') {
        currentRow.push(field);

        // 2개가 모이거나 마지막 필드면 행 완성
        if (currentRow.length === 2 || index === fields.length - 1) {
          rows.push([...currentRow]);
          currentRow = [];
        }
      } else if (field.gridCol === 'full') {
        // 이전에 쌓인 half 필드들이 있으면 먼저 행 추가
        if (currentRow.length > 0) {
          rows.push([...currentRow]);
          currentRow = [];
        }
        // full 필드는 단독 행
        rows.push([field]);
      }
    });

    return rows.map((rowFields, rowIndex) => (
      <dl key={rowIndex} className="w-100 row align-items-center mb-2">
        {rowFields.map(field => (
          <React.Fragment key={field.key}>
            <dt className={`col-2 text-end`} style={{ margin: '0px', padding: '0px' }}>
              {field.label} :
            </dt>
            <dd
              className={`col-${field.gridCol === 'full' ? '10' : '4'}`}
              style={{ margin: '0px', padding: '0px 15px' }}
            >
              {renderSearchField(field)}
            </dd>
          </React.Fragment>
        ))}
      </dl>
    ));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <div className="card mb-4 shadow-sm" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="card-header bg-light fw-bold">🔍 {title}</div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="w-100 d-flex flex-column align-items-center">
            {renderSearchRows()}

            {/* 검색 버튼 */}
            <div className="col-12 text-center mt-3">
              <button type="submit" className="btn btn-primary px-4">
                {submitText}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchForm;
