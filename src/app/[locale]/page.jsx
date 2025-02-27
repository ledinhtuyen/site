"use client";

import Feed from "@components/Feed";
import { useTranslation } from '@hooks/useTranslation';

function Home() {
  const { t } = useTranslation();

  return (
    <section className='w-full flex-center flex-col'>
      <h1 className='head_text text-center'>
        <span className="fade-in">
          <span className="fade">🚀</span>
          <span className="fade">D</span>
          <span className="fade">i</span>
          <span className="fade">s</span>
          <span className="fade">c</span>
          <span className="fade">o</span>
          <span className="fade">v</span>
          <span className="fade">e</span>
          <span className="fade">r</span>
          <span className="fade"> & </span>
          <span className="fade">S</span>
          <span className="fade">h</span>
          <span className="fade">a</span>
          <span className="fade">r</span>
          <span className="fade">e</span>
        </span>
        <br className='max-md:hidden' />
        <span className='fade-in galaxy_gradient text-center'> 
          <span className="fade">A</span>
          <span className="fade">I</span>
          <span className="fade">-</span>
          <span className="fade">P</span>
          <span className="fade">o</span>
          <span className="fade">w</span>
          <span className="fade">e</span>
          <span className="fade">r</span>
          <span className="fade">e</span>
          <span className="fade">d</span>
          <span className="fade"> </span>
          <span className="fade">P</span>
          <span className="fade">r</span>
          <span className="fade">o</span>
          <span className="fade">m</span>
          <span className="fade">p</span>
          <span className="fade">t</span>
          <span className="fade">s</span>
        </span>
      </h1>
      <p className='desc text-center'>
        {t('home.description')}
      </p>

      <Feed />
    </section>
  );
}

export default Home;
