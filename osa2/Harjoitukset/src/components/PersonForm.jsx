const PersonForm = ({ newName, newNumber, addPerson, setNewName, setNewNumber }) => {
    const addName = (event) => {
      setNewName(event.target.value);
    };
  
    const addNumber = (event) => {
      setNewNumber(event.target.value);
    };
  
    return (
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={addName} />
        </div>
        <div>
          number: <input value={newNumber} onChange={addNumber} />
        </div>
        <button type="submit">add</button>
      </form>
    );
  };
  
  export default PersonForm;