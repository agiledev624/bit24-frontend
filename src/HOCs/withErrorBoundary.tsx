import { redText } from '@/exports';
import React from 'react';

//@TODO
const COMPONENT_ERROR = 'COMPONENT ERROR';
const DEFAULT_STACKTRACE = 'DEFAULT STACKTRACE';
const SUGGESTION_TEXT = 'An unexpected error occurred. Please refresh the page or contact support if the issue persists';

export function withErrorBoundary(Component, title) {
	return class extends React.Component {
		state = {
			hasError: false,
			errorStack: null,
		}

		// constructor(props) {
		//     super(props);

		//     this.onOpen = this.onOpen.bind(this)
		//     this.onClose = this.onClose.bind(this)
		// }

		componentDidCatch(error, info) {
			// Display fallback UI
			const stackTrace = this.generateStackTrace(error)
			this.setState({ hasError: true, errorStack: stackTrace })
			// You can also log the error to an error reporting service
			console.error(error, info)
		}

		generateStackTrace(error) {
			if (!error || !error.stack) {
				return DEFAULT_STACKTRACE
			}
			return error.stack.split('\n').map((item, key) => <div key={key}>{item}</div>)
		}

		render() {
			const { hasError, errorStack } = this.state
			const titleText = `${title}: ${COMPONENT_ERROR}`;
			if (hasError) {
				return (
					<div className={redText()}>
						<h2>{titleText}</h2>
						<div className='errorboundry__suggestion-container'>
							{SUGGESTION_TEXT}
						</div>
						<div className='show-smaller errorboundry__stacktrace-container'>
							{errorStack}
						</div>
					</div>
				)
			}
			return <Component {...this.props} />
		}
	}
}

export default withErrorBoundary;