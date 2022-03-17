import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import { Provider } from "react-redux";
import GlobalStyle from './styles/global-styles';
import theme from './styles/theme';
import { ThemeProvider } from './styles/themed-components';

ReactDOM.render(
	<>
		<GlobalStyle />
		<ThemeProvider theme={theme}>
			<App />
		</ThemeProvider>
	</>,
	document.getElementById('root'),
);
