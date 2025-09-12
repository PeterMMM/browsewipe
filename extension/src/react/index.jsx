import { createRoot } from 'react-dom/client';
import App from './components/App';
// Clear the existing HTML content


// Render your React component instead
const root = createRoot(document.getElementById('root'));
root.render(<App />);
