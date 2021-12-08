import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginPage from '../Pages/LoginPage';
import SignupPage from '../Pages/SignupPage';
import TransactionPage from '../Pages/TransactionPage';
import SummaryPage from '../Pages/SummaryPage';
import CurrencyPage from '../Pages/CurrencyPage';
import TipsPage from '../Pages/TipsPage';

it('snapshot with no content matches (login)', () => {
  const tree = renderer
    .create(
      <Router>
        <LoginPage />
      </Router>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('snapshot with no content matches (signup)', () => {
  const tree = renderer
    .create(
      <Router>
        <SignupPage />
      </Router>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('snapshot with no content matches (transaction)', () => {
  const tree = renderer.create(<TransactionPage />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('snapshot with no content matches (summary)', () => {
  const tree = renderer.create(<SummaryPage />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('snapshot with no content matches (currency)', () => {
  const tree = renderer.create(<CurrencyPage />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('snapshot with no content matches (tips)', () => {
  const tree = renderer.create(<TipsPage />).toJSON();
  expect(tree).toMatchSnapshot();
});
