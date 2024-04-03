import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  Avatar,
  Tooltip,
  Input
} from '@material-tailwind/react';

const TABLE_HEAD = ['Company Name', 'Position', 'Date Posted', 'Status', ''];

const TABLE_ROWS = [
  {
    img: 'https://docs.material-tailwind.com/img/logos/logo-spotify.svg',
    name: 'Spotify',
    position: 'Engineering Manager',
    date: 'Week ago',
    status: 'active'
  },
  {
    img: 'https://docs.material-tailwind.com/img/logos/logo-amazon.svg',
    name: 'Amazon',
    position: 'Engineering Manager',
    date: '4 days',
    status: 'active'
  },
  {
    img: 'https://docs.material-tailwind.com/img/logos/logo-pinterest.svg',
    name: 'Pinterest',
    position: 'Engineering Manager',
    date: '2 months',
    status: 'closed'
  },
  {
    img: 'https://docs.material-tailwind.com/img/logos/logo-google.svg',
    name: 'Google',
    position: 'Engineering Manager',
    date: '3 days',
    status: 'pending'
  },
  {
    img: 'https://docs.material-tailwind.com/img/logos/logo-netflix.svg',
    name: 'netflix',
    position: 'Engineering Manager',
    date: '1 day',
    status: 'active'
  }
];

function JobBoard() {
  return (
    <Card className="h-full w-full mt-4">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Recent Jobs Matching your Profile
            </Typography>
          </div>
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <div className="w-full md:w-72">
              <Input
                label="Search"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_ROWS.map(({ img, name, position, date, status }, index) => {
              const isLast = index === TABLE_ROWS.length - 1;
              const classes = isLast
                ? 'p-4'
                : 'p-4 border-b border-blue-gray-50';

              return (
                <tr key={name}>
                  <td className={classes}>
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={img}
                        alt={name}
                        size="md"
                        className="border border-blue-gray-50 bg-blue-gray-50/50 object-contain p-1"
                      />
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold"
                      >
                        {name}
                      </Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {position}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {date}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <div className="w-max">
                      <Chip
                        size="sm"
                        variant="ghost"
                        value={status}
                        color={
                          status === 'active'
                            ? 'green'
                            : status === 'pending'
                            ? 'amber'
                            : 'red'
                        }
                      />
                    </div>
                  </td>
                  <td className={classes}>
                    <Button variant="gradient">Apply</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}

export default JobBoard;
