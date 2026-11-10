// Hero images are bundled by Vite (no base64 in HTML anymore).
// "photo" is also used for the canvas particles and section backgrounds, "bg" is the hero background.
import slide1Photo from '../../assets/images/hero-1-photo.jpg';
import slide1Bg from '../../assets/images/hero-1-bg.jpg';
import slide2Photo from '../../assets/images/hero-2-photo.jpg';
import slide2Bg from '../../assets/images/hero-2-bg.jpg';

export const heroSlides = [
  { img: slide1Photo, bg: slide1Bg },
  { img: slide2Photo, bg: slide2Bg },
];
export const heroImages = heroSlides.map((s) => s.img);
