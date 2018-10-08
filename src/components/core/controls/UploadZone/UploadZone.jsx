import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
// style
import './UploadZone.scss';

class UploadZone extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    multiple: PropTypes.bool,
    onDrop: PropTypes.func,
    acceptMimeType: PropTypes.array,
    dropLabel: PropTypes.string,
  };

  static defaultProps = {
    className: '',
    multiple: false,
    onDrop: () => { },
    acceptMimeType: [],
    dropLabel: '',
  };

  constructor(props) {
    super(props);
    this.state = { files: [] };
    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(files) {
    this.setState({
      files,
    }, () => {
      const { onDrop } = this.props;
      onDrop(this.state.files);
    });
  }

  render() {
    const {
      className,
      multiple,
      acceptMimeType,
      dropLabel,
    } = this.props;
    return (
      <section>
        <div>
          <Dropzone multiple={multiple} onDrop={this.onDrop} accept={acceptMimeType.join(',')} className={`uploadzone ${className}`}>
            <p className="label">{dropLabel}</p>
            {this.state.files.length > 0 ? (
              <aside>
                <ul>
                  {
                    this.state.files.map(f => <li key={f.name}>{f.name}</li>)
                  }
                </ul>
              </aside>
            ) : ''}
          </Dropzone>
        </div>
      </section>
    );
  }
}

export default connect(state => ({ app: state.app }))(UploadZone);
