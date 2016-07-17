import React, { PropTypes } from 'react';
import ajaxGet from './ajaxGet';
import * as utils from './utils';

const typeToLabel = {
  stargazers: 'Star',
  watchers: 'Watch',
  forks: 'Fork',
};

const typeToPath = {
  forks: 'network',
};

export default React.createClass({
  displayName: 'GitHubButton',
  propTypes: {
    className: PropTypes.string,
    type: PropTypes.oneOf([
      'stargazers',
      'watchers',
      'forks',
    ]).isRequired,
    namespace: PropTypes.string.isRequired,
    repo: PropTypes.string.isRequired,
    size: PropTypes.oneOf([
      'large',
    ]),
  },
  getInitialState() {
    return {
      count: null,
    };
  },
  componentDidMount() {
    this.xhr = ajaxGet(this.getRequestUrl(), this.setCount);
  },
  componentWillUnmount() {
    if (this.xhr) {
      this.xhr.abort();
    }
  },
  setCount(data) {
    const count = data[`${this.props.type}_count`];
    this.setState({ count });
  },
  getRequestUrl() {
    const { namespace, repo } = this.props;
    return `//api.github.com/repos/${namespace}/${repo}`;
  },
  getRepoUrl() {
    const { namespace, repo } = this.props;
    return `//github.com/${namespace}/${repo}/`;
  },
  getCountUrl() {
    const { namespace, repo, type } = this.props;
    return `//github.com/${namespace}/${repo}/${typeToPath[type] || type}/`;
  },
  getCountStyle() {
    const count = this.state.count;
    if (count !== null) {
      return {
        display: 'block',
      };
    }
    return null;
  },
  render() {
    const { className, type, size, ...rest } = this.props;
    delete rest.namespace;
    delete rest.repo;

    const count = this.state.count;

    const buttonClassName = utils.classNames({
      'github-btn': true,
      'github-btn-large': size === 'large',
      [className]: className,
    });

    return (
      <span {...rest} className={buttonClassName}>
        <a className="gh-btn" href={this.getRepoUrl()} target="_blank">
          <span className="gh-ico" aria-hidden="true"></span>
          <span className="gh-text">{ typeToLabel[type] }</span>
        </a>
        <a className="gh-count" target="_blank"
          href={this.getCountUrl()}
          style={this.getCountStyle()}
        >
          { count }
        </a>
      </span>
    );
  },
});
