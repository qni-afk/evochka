import React from 'react';

const FilterButtons = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'cute', label: 'Cute' },
    { id: 'funny', label: 'Funny' },
    { id: 'cool', label: 'Cool' }
  ];

  return (
    <div className="filter-buttons">
      {filters.map(filter => (
        <button
          key={filter.id}
          className={`filter-button ${activeFilter === filter.label ? 'active' : ''}`}
          onClick={() => onFilterChange(filter.label)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;