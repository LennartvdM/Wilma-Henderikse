import React from 'react';
import { useScrollAnimation } from '../utils/animations';
import './PublicationsGallery.css';

function PublicationsGallery() {
  const publications = [
    {
      image: '/wp-content/uploads/2018/10/Scherven-Brengen-Geluk-2.png',
      pdf: '/wp-content/uploads/publications/scherven-brengen-geluk.pdf',
      sticky: true
    },
    {
      image: '/wp-content/uploads/2018/10/Sleutels_tot_succes_VDH-1.png',
      pdf: '/wp-content/uploads/publications/sleutels_tot_succes_vdh.pdf'
    },
    {
      image: '/wp-content/uploads/2018/10/Rijkmetleeftijd-2.png',
      pdf: '/wp-content/uploads/publications/rijk-met-leeftijd-aan-de-slag-met-leeftijdsbewust-beleid-bij-de-rijksoverheid.pdf'
    },
    {
      image: '/wp-content/uploads/2018/10/Bedrijven-Monitor.png',
      pdf: '/wp-content/uploads/publications/bedrijvenmonitor-topvrouwen-2017.pdf'
    },
    {
      image: '/wp-content/uploads/2018/10/Gelijke-Kansen-kaft.png',
      pdf: '/wp-content/uploads/publications/werken-aan-gelijke-kansen-en-non-discriminatie.pdf'
    },
    {
      image: '/wp-content/uploads/2021/11/Screenshot-2021-11-16-183809.png',
      pdf: '/wp-content/uploads/publications/werkende-vaders-strategieën-voor-vaders-die-werk-en-zorg-willen-combineren.pdf'
    }
  ];

  const image0Ref = useScrollAnimation('fade', 'top', 0, '0');
  const image1Ref = useScrollAnimation('slide', 'bottom', 0, '0');
  const image2Ref = useScrollAnimation('fade', 'right', 0, '0');
  const image3Ref = useScrollAnimation('fade', 'right', 0, '0');
  const image4Ref = useScrollAnimation('fade', 'top', 0, '0');
  const image5Ref = useScrollAnimation('fade', 'top', 0, '0');

  return (
    <section className="et_pb_section publications-gallery-section">
      <div className="et_pb_row publications-gallery-row">
        <div className="et_pb_column publications-gallery-column-left">
          <div ref={image0Ref} className="et_pb_image publication-image publication-image-0">
            <a href={publications[0].pdf} target="_blank" rel="noopener noreferrer">
              <span className="et_pb_image_wrap">
                <img src={publications[0].image} alt="Scherven Brengen Geluk" />
              </span>
            </a>
          </div>
          <div ref={image1Ref} className="et_pb_image publication-image publication-image-1">
            <a href={publications[1].pdf} target="_blank" rel="noopener noreferrer">
              <span className="et_pb_image_wrap">
                <img src={publications[1].image} alt="Sleutels tot succes" />
              </span>
            </a>
          </div>
        </div>
        <div className="et_pb_column publications-gallery-column-right">
          <div className="et_pb_row_inner publications-gallery-row-inner-0"></div>
          <div className="et_pb_row_inner publications-gallery-row-inner-1">
            <div className="et_pb_column publications-gallery-column-inner">
              <div ref={image2Ref} className="et_pb_image publication-image publication-image-2">
                <a href={publications[2].pdf} target="_blank" rel="noopener noreferrer">
                  <span className="et_pb_image_wrap">
                    <img src={publications[2].image} alt="Rijk met Leeftijd" />
                  </span>
                </a>
              </div>
            </div>
          </div>
          <div className="et_pb_row_inner publications-gallery-row-inner-2">
            <div className="et_pb_column publications-gallery-column-inner publications-gallery-column-inner-2">
              <div ref={image3Ref} className="et_pb_image publication-image publication-image-3">
                <a href={publications[3].pdf} target="_blank" rel="noopener noreferrer">
                  <span className="et_pb_image_wrap">
                    <img src={publications[3].image} alt="Bedrijven Monitor" />
                  </span>
                </a>
              </div>
            </div>
            <div className="et_pb_column publications-gallery-column-inner publications-gallery-column-inner-3">
              <div ref={image4Ref} className="et_pb_image publication-image publication-image-4">
                <a href={publications[4].pdf} target="_blank" rel="noopener noreferrer">
                  <span className="et_pb_image_wrap">
                    <img src={publications[4].image} alt="Gelijke Kansen" />
                  </span>
                </a>
              </div>
              <div ref={image5Ref} className="et_pb_image publication-image publication-image-5">
                <a href={publications[5].pdf} target="_blank" rel="noopener noreferrer">
                  <span className="et_pb_image_wrap">
                    <img src={publications[5].image} alt="Werkende vaders" />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PublicationsGallery;

