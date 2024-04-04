import React from 'react';
import '../assets/styles/Header.scss';
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  useTheme,
  Dialog,
} from '@material-tailwind/react';
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  Bars4Icon,
  GlobeAmericasIcon,
  NewspaperIcon,
  PhoneIcon,
  RectangleGroupIcon,
  SquaresPlusIcon,
  SunIcon,
  TagIcon,
  UserGroupIcon,
} from '@heroicons/react/24/solid';
import ThemeToggle from './ThemeToggle';
import { useLocalStorage } from '@uidotdev/usehooks';
import { DEFAULT_THEME } from '../consts';
import Login from './Login';

const navListMenuItems = [
  {
    title: 'Cover Letter',
    description:
      'Crafting a bespoke cover letter tailored precisely to align with your resume and the specific requirements of the job you are pursuing.',
    icon: SquaresPlusIcon,
  },
  {
    title: 'Resume Analysis',
    description:
      'Evaluate your resume, providing a comprehensive score, and suggest potential enhancements.',
    icon: SquaresPlusIcon,
  },
  {
    title: 'Resume Summary',
    description:
      'Creating a custom Resume summary meticulously crafted to perfectly match the unique requirements of the job you are aiming for.',
    icon: SquaresPlusIcon,
  },
  {
    title: 'Resume Translation',
    description:
      'Harness the power of AI for flawless translation of your resume into any desired language with unparalleled accuracy.',
    icon: SquaresPlusIcon,
  },
  {
    title: 'Interview Simulation',
    description:
      'Provides invaluable insights and a comprehensive Q&A tailored to the company, our tips aim to equip you with the necessary tools for interview preparation.',
    icon: SquaresPlusIcon,
  },
  {
    title: 'Interview Helper',
    description:
      'A remarkable tool designed to assist you during your actual interview by capturing all the questions posed by the interviewer and furnishing concise, bullet-point responses for easy reference.',
    icon: SquaresPlusIcon,
  },
];

const sharedLinkBgStyles = `hover:bg-indigo-900/10 focus:bg-indigo-900/10 active:bg-indigo-900/10 text-gray-900
  dark:hover:bg-indigo-900/20 dark:focus:bg-indigo-900/20 dark:active:bg-indigo-900/20 dark:text-gray-50`;

function NavListMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const renderItems = navListMenuItems.map(
    ({ icon, title, description }, key) => (
      <a href='#' key={key}>
        <MenuItem className='v-menu-item'>
          <div className='v-icon'>
            {' '}
            {React.createElement(icon, {
              strokeWidth: 2,
              className: 'h-6 w-6',
            })}
          </div>
          <div>
            <Typography variant='h6'>{title}</Typography>
            <Typography variant='paragraph' className={`text-xs !font-medium`}>
              {description}
            </Typography>
          </div>
        </MenuItem>
      </a>
    )
  );

  return (
    <React.Fragment>
      <Menu
        open={isMenuOpen}
        handler={setIsMenuOpen}
        offset={{ mainAxis: 20 }}
        placement='bottom'
        allowHover={true}
      >
        <MenuHandler>
          <Typography as='div' variant='small' className='font-medium'>
            <ListItem
              className='v-list'
              selected={isMenuOpen || isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((cur) => !cur)}
            >
              AI Tools
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`hidden h-3 w-3 transition-transform lg:block ${
                  isMenuOpen ? 'rotate-180' : ''
                }`}
              />
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`block h-3 w-3 transition-transform lg:hidden ${
                  isMobileMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </ListItem>
          </Typography>
        </MenuHandler>
        <MenuList className='v-menu-list'>
          <ul className='grid grid-cols-3 gap-y-2 outline-none outline-0'>
            {renderItems}
          </ul>
        </MenuList>
      </Menu>
      <div className='v-menu-list block lg:hidden'>
        <Collapse open={isMobileMenuOpen}>{renderItems}</Collapse>
      </div>
    </React.Fragment>
  );
}

function NavList() {
  return (
    <List className='mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1'>
      <Typography as='a' href='home' variant='small' className='font-medium'>
        <ListItem className='v-list'>Home</ListItem>
      </Typography>
      <Typography as='a' href='profile' variant='small' className='font-medium'>
        <ListItem className='v-list'>Profile</ListItem>
      </Typography>
      <Typography as='a' href='#' variant='small' className='font-medium'>
        <ListItem className='v-list'>Configuration</ListItem>
      </Typography>
      <Typography as='a' href='board' variant='small' className='font-medium'>
        <ListItem className='v-list'>Job Board</ListItem>
      </Typography>
      <NavListMenu /> {/* AI tools */}
    </List>
  );
}

const renderActionButtons = (setOpen, open) => {
  const handleOpen = () => setOpen((cur) => !cur);
  return (
    <>
      <ThemeToggle />
      <Button
        size='sm'
        fullWidth
        className='v-primary-button'
        onClick={handleOpen}
      >
        Log In
      </Button>
      <Dialog
        size='xs'
        open={open}
        handler={handleOpen}
        className='bg-transparent shadow-none'
      >
        <Login />
      </Dialog>
    </>
  );
};

export default function HeaderNavbar() {
  const [openNav, setOpenNav] = React.useState(false);
  const [theme] = useLocalStorage('theme', DEFAULT_THEME);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener(
      'resize',
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  return (
    <Navbar fullWidth className='virtu-header'>
      <div className='flex items-center justify-between'>
        <a href='http://localhost:3000/' className='flex items-center'>
          <img
            src={`src/assets/img/virtuhunter-${theme}.svg`}
            className='h-6 me-3 sm:h-7'
            alt='Virtu.hunter'
          />
        </a>
        <div className='hidden lg:block'>
          <NavList />
        </div>
        <div className='hidden gap-2 lg:flex'>
          {!openNav && renderActionButtons(setOpen, open)}
        </div>
        <IconButton
          variant='text'
          className='button-icon lg:hidden'
          onClick={() => setOpenNav(!openNav)}
        >
          {/* hamburger button */}
          {openNav ? (
            <XMarkIcon className='h-6 w-6' strokeWidth={2} />
          ) : (
            <Bars3Icon className='h-6 w-6' strokeWidth={2} />
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <NavList />
        <div className='flex w-full flex-nowrap items-center gap-2 lg:hidden'>
          {openNav && renderActionButtons(setOpen, open)}
        </div>
      </Collapse>
    </Navbar>
  );
}
