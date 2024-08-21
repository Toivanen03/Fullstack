const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
        <Header course={course} />
        <Content part={part1} exercise={exercises1} />
        <Content part={part2} exercise={exercises2} />
        <Content part={part3} exercise={exercises3} />
      <p>Number of exercises {exercises1 + exercises2 + exercises3}</p>
    </div>
  )
}

const Header = (props) => {
  return (
    <div>
      {props.course}
      <p />
    </div>
  )
}

const Content = (props) => {
  return (
    <div>
      {props.part} {props.exercise}
      <p />
    </div>
  )
}

export default App