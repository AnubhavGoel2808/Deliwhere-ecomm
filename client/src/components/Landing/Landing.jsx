import { Link } from "react-router-dom"
import './Landing.css'
import { Routes } from "../../routes"

function Landing() {
    return (
        <section className="u-clearfix u-white u-section-1" id="carousel_9216">
        <div className="u-clearfix u-sheet u-sheet-1">
          <div className="u-clearfix u-expanded-width u-layout-wrap u-layout-wrap-1">
            <div className="u-gutter-0 u-layout">
              <div className="u-layout-row">
                <div className="u-align-right u-container-style u-layout-cell u-left-cell u-size-31 u-layout-cell-1" style={{marginLeft: "48%"}}>
                  <div className="u-container-layout u-valign-middle u-container-layout-1">
                    <h6 className="u-custom-font u-text u-text-font u-text-5" style={{fontSize: "30px"}}>About us</h6>
                    <h1 className="u-text u-text-palette-4-base u-text-2">DeliWhere</h1>
                    <h5 className="u-text u-text-palette-4-base u-text-10">Courier Delivery Service</h5>
                    <p className="u-text u-text-palette-5-dark-3 u-text-10">One stop solution for all types of deliveries. It provides different types of courier services for most, if not all types of goods. DeliWhere provides safe and low-cost deliveries.</p>
                    <Link to={{ pathname: Routes.SignIn.path}}>
                      <button className="u-btn u-btn-round u-button-style u-palette-4-base u-radius-50 u-text-body-alt-color u-btn-1">
                        LogIn / SignUp
                      </button>
                    </Link>
                  </div>
                </div>
                {/* <div className="u-align-right u-container-style u-expand-resize u-image u-layout-cell u-right-cell u-size-28 u-image-1">
                  <div className="u-container-layout u-container-layout-2"></div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
}

export default Landing
