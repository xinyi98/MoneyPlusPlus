import { BrowserRouter as Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
import App from './App';

it('snapshot with no content matches', () => {
  const tree = renderer
    .create(
      <Router>
        <App />
      </Router>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
