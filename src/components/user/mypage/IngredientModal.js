import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import '../../../styles/MyPage.css'; // Re-use existing modal styles or add new ones

const IngredientModal = ({ isOpen, onClose, ingredients, initialTab = 'all', onAddClick }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Reset tab when modal opens with a new initialTab
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const renderContent = () => {
    const focusList = ingredients.focus || [];
    const avoidList = ingredients.avoid || [];

    if (activeTab === 'focus') {
      return (
        <section className="ingredient-section focus full-width">
          <div className="ingredient-grid">
            {focusList.map((item, index) => (
              <div key={index} className="ingredient-card focus">
                <div className="card-header">
                  <span className="ingredient-name">{item.name}</span>
                </div>
                <p className="ingredient-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      );
    }

    if (activeTab === 'avoid') {
      return (
        <section className="ingredient-section avoid full-width">
          <div className="ingredient-grid">
            {avoidList.map((item, index) => (
              <div key={index} className="ingredient-card avoid">
                <div className="card-header">
                  <span className="ingredient-name">{item.name}</span>
                </div>
                <p className="ingredient-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      );
    }

    // 'all' tab
    return (
      <div className="all-ingredients-view">
        {focusList.length > 0 && (
          <section className="ingredient-section focus">
            <h3>
              관심 성분 <span className="count">{focusList.length}</span>
            </h3>
            <div className="ingredient-grid">
              {focusList.map((item, index) => (
                <div key={index} className="ingredient-card focus">
                  <div className="card-header">
                    <span className="ingredient-name">{item.name}</span>
                  </div>
                  <p className="ingredient-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {focusList.length > 0 && avoidList.length > 0 && <div className="section-divider" />}

        {avoidList.length > 0 && (
          <section className="ingredient-section avoid">
            <h3>
              피할 성분 <span className="count">{avoidList.length}</span>
            </h3>
            <div className="ingredient-grid">
              {avoidList.map((item, index) => (
                <div key={index} className="ingredient-card avoid">
                  <div className="card-header">
                    <span className="ingredient-name">{item.name}</span>
                  </div>
                  <p className="ingredient-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content ingredient-modal" onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <h2>즐겨 찾는 성분</h2>
          <div className="header-actions">
            <button className="add-btn" onClick={onAddClick}>
              <Plus size={16} />
              <span>추가</span>
            </button>
            <button className="close-btn" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
        </header>

        <div className="modal-tabs">
          <button className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
            전체
          </button>
          <button className={`tab-btn ${activeTab === 'focus' ? 'active' : ''}`} onClick={() => setActiveTab('focus')}>
            관심 성분
          </button>
          <button className={`tab-btn ${activeTab === 'avoid' ? 'active' : ''}`} onClick={() => setActiveTab('avoid')}>
            피할 성분
          </button>
        </div>

        <div className="modal-body">{renderContent()}</div>
      </div>
    </div>
  );
};

export default IngredientModal;
