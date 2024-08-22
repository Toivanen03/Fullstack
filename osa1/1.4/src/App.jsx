const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]

  return (
    <div>
        <Header course={course} />
        <Content parts={parts} />
      <p>Number of exercises {parts[0].exercises + parts[1].exercises + parts[2].exercises}</p>
    </div>
  )
}

const Header = (props) => {
  return (
    <div>
      <p>{props.course}</p>
    </div>
  )
}

const Content = (props) => {
  return (
    <div>
      {props.parts.map((part, index) => (
        <Part key={index} name={part.name} exercises={part.exercises} />
      ))}
    </div>
  )
}

const Part = (props) => {
  return (
    <div>
      {props.name} {props.exercises}
      <p />
    </div>
  )
}

export default App