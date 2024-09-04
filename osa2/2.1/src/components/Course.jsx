const Course = ({ course }) => {
    const Header = ({ name }) => <h2>{name}</h2>;
    const Part = ({ part }) => <p>{part.name} {part.exercises}</p>;
    const id = course.parts.map((part, index) => ({
        ...part,
        id: index +1
    }))


    return (
        <div>
            <Header name={course.name} />
            {id.map(part => (
                <Part key={part.id} part={part} />    
            ))}
        </div>
    )
  }
  
  export default Course