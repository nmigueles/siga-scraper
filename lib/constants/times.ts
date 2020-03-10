export const hours: { [key: string]: any } = {
  m: {
    0: {
      start: '7:45',
      end: '8:30',
    },
    1: {
      start: '8:30',
      end: '9:15',
    },
    2: {
      start: '9:15',
      end: '10:00',
    },
    3: {
      start: '10:15',
      end: '11:00',
    },
    4: {
      start: '11:00',
      end: '11:45',
    },
    5: {
      start: '11:45',
      end: '12:30',
    },
    6: {
      start: '12:30',
      end: '13:15',
    },
  },
  t: {
    0: {
      start: '13:30',
      end: '14:15',
    },
    1: {
      start: '14:15',
      end: '15:00',
    },
    2: {
      start: '15:00',
      end: '15:45',
    },
    3: {
      start: '16:00',
      end: '16:45',
    },
    4: {
      start: '16:45',
      end: '17:30',
    },
    5: {
      start: '17:30',
      end: '18:15',
    },
    6: {
      start: '18:15',
      end: '19:00',
    },
  },
  n: {
    0: {
      start: '18:15',
      end: '19:00',
    },
    1: {
      start: '19:00',
      end: '19:45',
    },
    2: {
      start: '19:45',
      end: '20:30',
    },
    3: {
      start: '20:45',
      end: '21:30',
    },
    4: {
      start: '21:30',
      end: '22:15',
    },
    5: {
      start: '22:15',
      end: '23:00',
    },
    6: {
      start: '6', //Should never go through here.
      end: '6',
    },
  },
};

export const days: { [key: string]: number } = {
  Lu: 1,
  Ma: 2,
  Mi: 3,
  Ju: 4,
  Vi: 5,
  Sa: 6,
};

export const shift: { [key: string]: string } = {
  m: 'Mañana',
  t: 'Tarde',
  n: 'Noche',
};
