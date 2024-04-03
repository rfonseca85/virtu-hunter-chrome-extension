import React from 'react';
import '../assets/styles/Footer.scss';

function Footer() {
  return (
    <footer className='v-footer w-full rounded-lg shadow mt-4'>
      <div className='w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between'>
        <span className='text-sm  sm:text-center'>
          © 2024{' '}
          <a href='https://virtu.ai.com/' className='hover:underline'>
            Virtu.ai™
          </a>
          . All Rights Reserved.
        </span>
        <ul className='flex flex-wrap items-center mt-3 text-sm font-medium sm:mt-0'>
          <li>
            <a href='#' className='hover:underline me-4 md:me-6'>
              About
            </a>
          </li>
          <li>
            <a href='#' className='hover:underline me-4 md:me-6'>
              Privacy Policy
            </a>
          </li>
          <li>
            <a href='#' className='hover:underline me-4 md:me-6'>
              Licensing
            </a>
          </li>
          <li>
            <a href='#' className='hover:underline'>
              Contact
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
