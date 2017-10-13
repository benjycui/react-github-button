import React from 'react';
import PropTypes from 'prop-types';
import ajaxGet from './ajaxGet';
import * as utils from './utils';

const typeToLabel = {
  stargazers: 'Star',
  watchers: 'Watch',
  forks: 'Fork',
  follow: 'Follow'
};

const typeToPath = {
  forks: 'network',
};

export default class GitHubButton extends React.Component {
  static displayName = 'GitHubButton';
  static propTypes = {
    className: PropTypes.string,
    type: PropTypes.oneOf([
      'stargazers',
      'watchers',
      'forks',
      'follow'
    ]).isRequired,
    namespace: PropTypes.string.isRequired,
    repo: PropTypes.string,
    size: PropTypes.oneOf([
      'large',
    ]),
  };
  state = {
    count: null,
  };
  componentDidMount() {
    this.xhr = ajaxGet(this.getRequestUrl(), (response) => {
      this.setCount(response);
    });
  }
  componentWillUnmount() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }
  setCount(data) {
    if (!data) return;
    const count = data[`${this.props.type}_count`];
    this.setState({ count });
  }
  getRequestUrl() {
    const { namespace, repo } = this.props;
    console.log(repo);
    return `//github.com/${namespace}/${(repo) ? `${repo}/` : ''}`;
  }
  getRepoUrl() {
    const { namespace, repo } = this.props;
    console.log(repo);
    return `//github.com/${namespace}/${(repo) ? `${repo}/` : ''}`;
  }
  getCountUrl() {
    const { namespace, repo, type } = this.props;
    return `//github.com/${namespace}/${repo}/${typeToPath[type] || type}/`;
  }
  getCountStyle() {
    const count = this.state.count;
    if (count !== null) {
      return {
        display: 'block',
      };
    }
    return null;
  }
  getText(type) {
    switch(type) {
      case 'follow':
      return `Follow @${this.props.namespace}`;

      default:
      return typeToLabel[type];
    }
  }
  render() {
    const { className, type, size, ariaLabel, repo, ...rest } = this.props;
    delete rest.namespace;
    delete rest.repo;

    const count = this.state.count;

    const buttonClassName = utils.classNames({
      'github-btn': true,
      'github-btn-large': size === 'large',
      [className]: className,
    });

    const ghCount = (repo) ? (
      <a className="gh-count" target="_blank"
        href={this.getCountUrl()}
        style={this.getCountStyle()}
      >
        { count }
      </a>
    ) : undefined;

    return (
      <span {...rest} className={buttonClassName}>
        <a aria-label={ariaLabel} className="gh-btn" href={this.getRepoUrl()} target="_blank">
          <span className="gh-ico" aria-hidden="true"></span>
          <span className="gh-text">{ this.getText(type) }</span>
        </a>
        {ghCount}
      </span>
    );
  }
}
