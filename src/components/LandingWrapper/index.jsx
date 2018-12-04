import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { setLanguage, updateModal } from '@/reducers/app/action';
import { Link } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

// style
import imgNinja from '@/assets/images/ninja/ninja-header-black.svg';
import imgLogo from '@/assets/images/logo.png';
import { SEOHome } from '@/components/SEO';
import './styles.scss';

class Index extends React.PureComponent {
  static propTypes = {
    setLanguage: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.changeCountry = :: this.changeCountry;
  }

  componentDidMount() {
    const appContainer = document.getElementById('app');
    appContainer.classList.add('mobileTabletApp');
  }

  changeCountry(countryCode) {
    this.props.setLanguage(countryCode);
  }

  handleToggleModal = () => {
    this.props.updateModal({ show: false })
  }

  render() {
    const { name, children, type, btnToggleLeftMenu, fullWidthContent,
      modal: { className, show, body, title, centered },
    } = this.props;
    const logo = <Link to="/" className="d-inline-block mt-1"><img src={imgNinja} width="100" /></Link>;

    return (
      <div className={"landing-page ct-" + name}>
        {SEOHome}
        <div className="landing-background">
          <div>
            {/* mobile */}
            <div className="container">
              <div className="row d-md-none">
                <div className="col-5">
                  {logo}
                </div>
                <div className="col-7">
                </div>
              </div>
              <div className="row d-md-none">
                <div className="col">{btnToggleLeftMenu}</div>
              </div>

              {/* desktop */}
              <div className="row d-none d-md-flex">
                <div className="col-2">
                  {logo}
                </div>
                <div className="col-10">
                </div>
              </div>
            </div>

            {
              fullWidthContent ? children : (
                <div className="container">
                  {children}
                </div>
              )
            }

            <div className="container">
              <hr className="landing-hr" />

              <div className="row landing-footer no-gutters">
                <div className="col-12 col-md-1">
                  <img src={imgLogo} width="54" />
                </div>
                <div className="col-12 col-md-7">
                  <div className="align-middle px-1 pt-1">
                    <div>Building blockchain powered apps, tools and solutions for the new wild west world web.<br />Join the dojo: <a href="https://t.me/ninja_org" className="landing-link">t.me/ninja_org</a><br />Contact us: <a href="mailto:support@ninja.org" className="landing-link" target="_top">support@ninja.org</a>/div>
                  </div>
                </div>
                <div className="col-12 col-md-4 text-left text-md-right">
                  <div className="pl-1 pt-1">
                    <div>
                      Join the dojo on <a href="https://t.me/ninja_org" className="landing-link">Telegram</a>
                    </div>
                    <div>
                      Read our <a href="https://medium.com/@ninja_org/shakeninja-bex-1c938f18b3e8" className="landing-link">whitepaper</a> | Find us on <a href="https://github.com/ninjadotorg" className="landing-link">Github</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>

          <Modal isOpen={show} toggle={this.handleToggleModal} className={className} centered={centered}>
            {title && <ModalHeader toggle={this.handleToggleModal}>{title}</ModalHeader>}
            <ModalBody>
              {body}
            </ModalBody>
          </Modal>
        </div>
        </div>
      </div>
    );
  }
}
const mapState = (state) => ({
  modal: state.app.modal,
});

const mapDispatch = ({
  setLanguage,
  updateModal
});

export default connect(mapState, mapDispatch)(Index);
