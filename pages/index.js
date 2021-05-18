import Head from 'next/head'
import Image from 'next/image'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { getUrl } from '../services/getUrl';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import  { motion, AnimatePresence } from 'framer-motion';
import marked from 'marked';
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import "swiper/components/navigation/navigation.min.css"
import SwiperCore, {
  Navigation
} from 'swiper/core';

SwiperCore.use([Navigation]);

export async function getServerSideProps(context) {

  const pageDataResponse = await axios.get(`${getUrl()}/main-page`);
  const pageData = await pageDataResponse.data;

  // console.log(pageData);

  return {
    props: {
      pageData
    }, // will be passed to the page component as props
  }
}

export default function Home({ pageData }) {

  useEffect(() => {
    window.addEventListener('scroll', function() {
      const header = document.querySelector('header');
      header.classList.toggle('sticky', window.scrollY > 50);

      const responsiveHeader = document.querySelector('.responsive-header');
      responsiveHeader.classList.toggle('responsive-sticky', window.scrollY > 50);
    })
  }, []);

  const [emailSent, setEmailSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  const [showResponsiveMenu, setShowResponsiveMenu] = useState(false);

  const initialFormValues = {
    name: '',
    email: '',
    phone: '',
    message: ''
  }

  const initialErrors = {
    name: false,
    email: false,
    phone: false,
    message: false
  }

  const [formData, setFormData] = useState(initialFormValues)

  const [errors, setErrors] = useState(initialErrors)

  const handleSendEmail = () => {
    let errors = {
      name: false,
      email: false,
      phone: false,
      message: false
    };

    let errorArray = [];
    if (formData.name.length < 1) {
      errors.name = true;
      errorArray.push(1);
    }
    if (formData.email.length < 1 || !formData.email.includes('@')) {
      errors.email = true;
      errorArray.push(1);
    }
    if (formData.phone.length < 1) {
      errors.phone = true;
      errorArray.push(1);
    }
    if (formData.message.length < 1) {
      errors.message = true;
      errorArray.push(1);
    }
    setErrors(errors);

    if (errorArray.length < 1) {
      setIsSending(true);

      axios.post(`${getUrl()}/sendmail`, formData)
      .then(res => {
        setIsSending(false);
        setEmailSent(true);
        setErrors(initialErrors);
        setFormData(initialFormValues);
      })
      .catch(error => console.log(error));
    }
  }

  const handleModal = (imageSrc) => {
      setShowModal(true);
      // setModalImage(imageSrc);
      recreateImageGallery(imageSrc);
  }

  const recreateImageGallery = (newImageUrl) => {
    const imagesGallery = pageData.paveiksleliu_galerija.map(image => image.url);
    const imagesGalleryWithRemovedImage = imagesGallery.filter(image => image !== newImageUrl);
    imagesGalleryWithRemovedImage.unshift(newImageUrl);

    setGalleryImages(imagesGalleryWithRemovedImage);
  }

  return (
    <div>
      <Head>
        <title>Šratavimas Pilviškiuose</title>
        <meta name="description" content="blasting.lt - Šratavimas Pilviškiuose" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta name="keywords" content="sratavimas, pilviskiuose, blasting.lt" />
        <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@100;200;300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <main>

      <AnimatePresence>
        {
          showModal && 
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{  opacity: 0 }}
            transition={{ type: 'Inertia'}}
            className='modal'
          >
            <div className='close-btn' onClick={() => setShowModal(false)}>
              <img src='https://res.cloudinary.com/dxdmya6ui/image/upload/v1621240442/cancel_01a1e66ba7.svg?84587.94999995735' />
            </div>
            
            <Swiper navigation={true} className="mySwiper">
              {/* <SwiperSlide>
                { modalImage && <img src={modalImage} />}
              </SwiperSlide> */}
              {
                galleryImages.map(image => 
                  <SwiperSlide>
                    <img src={image} />
                  </SwiperSlide>
                )
              }
            </Swiper>
          </motion.div>
        }
        </AnimatePresence>

        <header>
          <div className='wrapper'>
            <div className='logo'>
              <img src={pageData.logotipas.url} />
            </div>
            <ul>
              <a href='#apie-mus'><li>APIE MUS</li></a>
              <a href='#paslaugos'><li>PASLAUGOS</li></a>
              <a href='#es-projektai'><li>ES PROJEKTAI</li></a>
              <a href='#galerija'><li>GALERIJA</li></a>
              <a href='#kontaktai'><li>KONTAKTAI</li></a>
            </ul>
          </div>
        </header>
        <div className='responsive-header'>
          <div className='wrapper'>
            <div className='logo'>
              <img src={pageData.logotipas.url} />
            </div>
            <div className='menu-button' onClick={() => setShowResponsiveMenu(true)}>
              <img src='https://res.cloudinary.com/dxdmya6ui/image/upload/v1620830146/menu_5fa786fcf4.svg?1828102.859999999' />
            </div>
          </div>
        </div>

      <AnimatePresence>
        {
          showResponsiveMenu && 
          <motion.div
            initial={{ x: '-100%'}}
            animate={{ x: 0 }}
            exit={{ x: '-100%'}}
            transition={{ type: 'Inertia'}}
            className='nav'
          >
            <div className='close-btn' onClick={() => setShowResponsiveMenu(false)}>
              <img src='https://res.cloudinary.com/dxdmya6ui/image/upload/v1620830689/close_1_5f5b283ba3.svg?2362984.58' />
            </div>
            <ul>
              <a href='#apie-mus' onClick={() => setShowResponsiveMenu(false)}><li>APIE MUS</li></a>
              <a href='#paslaugos' onClick={() => setShowResponsiveMenu(false)}><li>PASLAUGOS</li></a>
              <a href='#es-projektai' onClick={() => setShowResponsiveMenu(false)}><li>ES PROJEKTAI</li></a>
              <a href='#galerija' onClick={() => setShowResponsiveMenu(false)}><li>GALERIJA</li></a>
              <a href='#kontaktai' onClick={() => setShowResponsiveMenu(false)}><li>KONTAKTAI</li></a>
            </ul>
          </motion.div>
        }
        </AnimatePresence>

        <section className='hero-bg' style={{'background-image': `url('${pageData.pagrindinis_paveikslelis.url}')`}}>
          <div className='wrapper'>
            <div className='left'>
              <div className='flex-center'>
                <div className='hero-text' dangerouslySetInnerHTML={{__html: `${marked(pageData.puslapio_pavadinimas)}`}}></div>
              </div>
            </div>
            <div className='right'>
              <div className='flex-center'>
                <div dangerouslySetInnerHTML={{__html: `${marked(pageData.paveikslelio_aprasymas)}`}}></div>
                <button><a href='#kontaktai'>Susisiekti</a></button>
              </div>
            </div>
          </div>
        </section>
        <section className='about-us' id='apie-mus'>
          <div className='wrapper'>
            <div className='left'>
              <h2><img src='https://res.cloudinary.com/dxdmya6ui/image/upload/v1620810788/Daco_2373189_83aa6a1bda.png?93325.09000000027' />Apie mus</h2>
            </div>
            <div className='right' dangerouslySetInnerHTML={{__html: `${marked(pageData.apie_mus)}`}}></div>
          </div>
        </section>
        <section className='about-us light-blue-bg' id='paslaugos'>
          <div className='wrapper row-reverse'>
            <div className='left'>
              <h2 className='color-white'><img src='https://res.cloudinary.com/dxdmya6ui/image/upload/v1620812848/painter_8b32ec125d.png?2150974.9950000006' />Paslaugos</h2>
            </div>
            <div className='right color-white' dangerouslySetInnerHTML={{__html: `${marked(pageData.paslaugos)}`}}></div>
          </div>
        </section>
        <section className='why-us'>
          <h2>Kodėl rinktis mus?</h2>
          <div className='wrapper'>
            {pageData.kodel_mes.map(item => 
              <div className='item'>
                <img src={item.ikona.url} />
                <h3>{item.pavadinimas}</h3>
                <p><div dangerouslySetInnerHTML={{__html: `${marked(item.aprasymas)}`}}></div></p>
              </div>
              )}
          </div>
        </section>
        <section className='es-projects' id='es-projektai'>
          <h2>ES PROJEKTAI</h2>
            <div className='wrapper' dangerouslySetInnerHTML={{__html: `${marked(pageData.es_projektai)}`}}></div>
        </section>
        <section className='gallery' id='galerija'>
          <h2>GALERIJA</h2>
          <div className='wrapper'>
          { 
              pageData.paveiksleliu_galerija.length > 0 ? 
              <div className='images-container'>
                {
                  pageData.paveiksleliu_galerija.map(image => 
                  <div 
                    className='background-item' 
                    onClick={() => handleModal(image.url)} 
                    style={{backgroundImage:`url(${image.url}`}}>
                  </div>
                  )
                }
              </div> :
              <p style={{textAlign:'center'}}>Nuotraukų galerija ruošiama.</p>
          }
          </div>
        </section>
        <section className='contact' id='kontaktai'>
          <h3>Kontaktai</h3>
          <div className='wrapper'>
            <div className='text'>
            <p className='find-us-text'>Įmonė</p>
              <p className='content'>
                { pageData.imones_pavadinimas }<br />
                Įmonės kodas: 304998962
              </p>
            <p className='find-us-text'>Telefonas</p>
              <p className='content'>
              { pageData.telefono_numeris }
              </p>
              <p className='find-us-text'>El. paštas</p>
              <p className='content'>
              { pageData.el_pastas }
              </p>
              <p className='find-us-text'>Raskite mus žemėlapyje</p>
              <p className='content'>
                <b>Adresas: </b>{ pageData.adresas }
              </p>
            </div>
            <div className='map'>
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2238.5148128096175!2d21.22144431590551!3d55.87108398058511!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46e5268d77bdef8b%3A0xff7ae6c3748811a9!2sKlaip%C4%97dos%20g.%20127%2C%20Kretinga%2097155!5e0!3m2!1sen!2slt!4v1620815192256!5m2!1sen!2slt" 
                allowfullscreen="" 
                loading="lazy"
              >

              </iframe>
            </div>
          </div>
            <h3 className='write-us'>Parašykite mums</h3>
            <div className='form-row'>
              <TextField value={formData.name} error={errors.name} id="filled-basic" onChange={(e) => setFormData({...formData, name: e.target.value})} label="Vardas" variant="filled" />
              <TextField value={formData.email} error={errors.email} id="filled-basic" onChange={(e) => setFormData({...formData, email: e.target.value})} label="El. pašto adresas" variant="filled" />
              <TextField value={formData.phone} error={errors.phone} id="filled-basic" onChange={(e) => setFormData({...formData, phone: e.target.value})} label="Tel. numeris" variant="filled" />
            </div>
            <div className='field-fullwidth'>
              <TextField id="filled-basic" 
                multiline
                value={formData.message}
                error={errors.message}
                rows={5}
                rowsMax={7} 
                onChange={(e) => setFormData({...formData, message: e.target.value})} 
                label="Žinutė" 
                variant="filled" />
              <Button variant="outlined" disabled={isSending}onClick={() => handleSendEmail()}>SIŲSTI</Button><br />
              { isSending && <div className='email-loader'><CircularProgress /></div>}
              { emailSent && <div className='success-msg'><Alert severity="success">Žinutė sėkmingai išsiųsta. Susisieksime jūsų nurodytais kontaktais artimiausiu metu.</Alert></div>}
            </div>
        </section>
      </main>
      <footer>
        <div className='wrapper'>
          <div className='left'>
            <div className='col'>
              <h3>KOKYBĖ</h3>
              <img src='https://res.cloudinary.com/dxdmya6ui/image/upload/v1620814203/quality_1a7b9f8259.svg?30002.050000000963' />
            </div>
            <div className='col'>
              <h3>PATIRTIS</h3>
              <img src='https://res.cloudinary.com/dxdmya6ui/image/upload/v1620828368/experience_fe21e96e9d.svg?62401.52500000113' />
            </div>
            <div className='col'>
              <h3>KAINA</h3>
              <img src='https://res.cloudinary.com/dxdmya6ui/image/upload/v1620814464/price_tag_dc5b495518.svg?271084.12000000133' />
            </div>
          </div>
          <div className='right'>
            <p>
            { pageData.imones_pavadinimas }<br />
              <b>Įmonės kodas: </b>304998962<br />
              <b>Telefonas: </b>{ pageData.telefono_numeris }<br />
              <b>El. paštas: </b>{ pageData.el_pastas }<br />
              <b>Adresas: </b>{ pageData.adresas }
            </p>
            <img src={pageData.logotipas.url} />
          </div>
        </div>
        <p style={{ textAlign: 'center' }}>© {new Date().getFullYear()}. Visos teisės saugomos.<br />Sprendimas <a href='https://northweb.lt'>northweb.lt</a></p>
      </footer>
    </div>
  )
}
