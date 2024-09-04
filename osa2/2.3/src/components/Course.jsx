const Course = ({ course }) => {
    const Header = ({ name }) => <h2>{name}</h2>;
    const Part = ({ part }) => <p>{part.name} {part.exercises}</p>;
    const id = course.parts.map((part, index) => ({
        ...part,
        id: index +1
    }))
    const totalExercises = course.parts.reduce((total, part) => {
        console.log("What is happening", total, part)
        return total + part.exercises
    },0 )

    return (
        <div>
            <Header name={course.name} />
            {id.map(part => (
                <Part key={part.id} part={part} />    
            ))}
            <p><b>Total of {totalExercises} exercises</b></p>    
        </div>
    )
  }
  
  export default Course