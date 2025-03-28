import { createRoot } from 'react-dom/client'
import './index.css'

interface WelcomeProps {
  name: string;
}

const Welcome = (props: WelcomeProps) => {
  return <h1>Hello, {props.name}</h1>;
};

createRoot(document.getElementById('root')!).render(
<Welcome name="Sarah" />
)
