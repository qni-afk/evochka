import { useState } from 'react';

function FilterButtons({ setActiveFilter }) {
  const [activeBtn, setActiveBtn] = useState('all');

  const handleFilter = (filter) => {
    setActiveBtn(filter);
    setActiveFilter(filter);
  };

  return (
    <div className="filter-container">
      <button
        className={`filter-btn ${activeBtn === 'all' ? 'active' : ''}`}
        onClick={() => handleFilter('all')}
      >
        All
      </button>
      <button
        className={`filter-btn ${activeBtn === 'funny' ? 'active' : ''}`}
        onClick={() => handleFilter('funny')}
      >
        Smile
      </button>
      <button
        className={`filter-btn ${activeBtn === 'cute' ? 'active' : ''}`}
        onClick={() => handleFilter('cute')}
      >
        Cute
      </button>
      <button
        className={`filter-btn ${activeBtn === 'cool' ? 'active' : ''}`}
        onClick={() => handleFilter('cool')}
      >
        Cool
      </button>
    </div>
  );
}

export default FilterButtons;