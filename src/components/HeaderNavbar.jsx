import React from 'react';
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

const navListMenuItems = [
  {
    title: 'Products',
    description: 'Find the perfect solution for your needs.',
    icon: SquaresPlusIcon,
  },
  {
    title: 'About Us',
    description: 'Meet and learn about our dedication',
    icon: UserGroupIcon,
  },
  {
    title: 'Blog',
    description: 'Find the perfect solution for your needs.',
    icon: Bars4Icon,
  },
  {
    title: 'Services',
    description: 'Learn how we can help you achieve your goals.',
    icon: SunIcon,
  },
  {
    title: 'Support',
    description: 'Reach out to us for assistance or inquiries',
    icon: GlobeAmericasIcon,
  },
  {
    title: 'Contact',
    description: 'Find the perfect solution for your needs.',
    icon: PhoneIcon,
  },
  {
    title: 'News',
    description: 'Read insightful articles, tips, and expert opinions.',
    icon: NewspaperIcon,
  },
  {
    title: 'Products',
    description: 'Find the perfect solution for your needs.',
    icon: RectangleGroupIcon,
  },
  {
    title: 'Special Offers',
    description: 'Explore limited-time deals and bundles',
    icon: TagIcon,
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
        <MenuItem className='flex items-center gap-3 rounded-lg hover:bg-indigo-500/10 active:bg-indigo-500/20 focus:bg-indigo-500/20'>
          <div className='flex items-center justify-center rounded-lg !bg-indigo-50/50 dark:!bg-indigo-900/50 p-2 '>
            {' '}
            {React.createElement(icon, {
              strokeWidth: 2,
              className: 'h-6 text-indigo-300 dark:text-indigo-100 w-6',
            })}
          </div>
          <div>
            <Typography
              variant='h6'
              className={`flex items-center text-sm font-bold text-indigo-500 dark:text-indigo-500`}
            >
              {title}
            </Typography>
            <Typography
              variant='paragraph'
              className={`text-xs !font-medium text-indigo-200`}
            >
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
              className={`flex items-center gap-2 py-2 pr-4 font-medium bg-transparent ${sharedLinkBgStyles}`}
              selected={isMenuOpen || isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((cur) => !cur)}
            >
              Resources
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
        <MenuList className='hidden max-w-screen-xl border-0 rounded-xl lg:block bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur'>
          <ul className='grid grid-cols-3 gap-y-2 outline-none outline-0'>
            {renderItems}
          </ul>
        </MenuList>
      </Menu>
      <div className='block lg:hidden'>
        <Collapse open={isMobileMenuOpen}>{renderItems}</Collapse>
      </div>
    </React.Fragment>
  );
}

function NavList() {
  return (
    <List className='mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1'>
      <Typography as='a' href='#' variant='small' className='font-medium'>
        <ListItem
          className={`flex items-center gap-2 py-2 pr-4  ${sharedLinkBgStyles}`}
        >
          Home
        </ListItem>
      </Typography>
      <NavListMenu />
      <Typography as='a' href='#' variant='small' className='font-medium'>
        <ListItem
          className={`flex items-center gap-2 py-2 pr-4  ${sharedLinkBgStyles}`}
        >
          Contact Us
        </ListItem>
      </Typography>
    </List>
  );
}

const renderActionButtons = () => {
  const sharedStyles = `whitespace-nowrap`;
  return (
    <>
      <ThemeToggle />
      <Button
        variant='gradient'
        size='sm'
        color='indigo'
        fullWidth
        className={sharedStyles}
      >
        Log In
      </Button>
      <Button
        variant='gradient'
        size='sm'
        color='amber'
        fullWidth
        className={sharedStyles}
      >
        Sign In
      </Button>
    </>
  );
};

export default function HeaderNavbar() {
  const [openNav, setOpenNav] = React.useState(false);
  const [theme] = useLocalStorage('theme', DEFAULT_THEME);

  React.useEffect(() => {
    window.addEventListener(
      'resize',
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  return (
    <Navbar
      fullWidth
      className='mx-auto mt-4 px-4 py-2 rounded-lg border-0 dark:bg-gray-800'
    >
      <div className='flex items-center justify-between text-blue-gray-900'>
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
          {!openNav && renderActionButtons()}
        </div>
        <IconButton
          variant='text'
          color='gray'
          className='lg:hidden dark:text-gray-50'
          onClick={() => setOpenNav(!openNav)}
        >
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
          {openNav && renderActionButtons()}
        </div>
      </Collapse>
    </Navbar>
  );
}
