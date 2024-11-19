const Filter = ({ search, onFilter }) => {
    return (
      <div>
        Filter: <input value={search} onChange={onFilter} />
      </div>
    )
  }
  
  export default Filter  